// src/lib/services/spotTradingService.ts
//
// DB-backed trading orchestration. All money movement goes through atomic,
// guarded Prisma updates (the same overdraw-proof pattern used for withdrawals)
// so a user can never go negative and concurrent orders can't double-spend.
//
// Execution model (documented in TRADING_ARCHITECTURE.md): every order is a
// fully-collateralized spot-style swap between the quote currency (the user's
// mainBalance, treated as USDT) and a base-asset Holding. `product` (spot /
// margin / futures) and `leverage` are recorded for reporting and UI, but there
// is no borrowing or liquidation — positions are always fully funded. This is a
// deliberate, safe simplification, not a real derivatives engine.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errorHandler";
import { getReferencePrice } from "@/lib/market/referencePrice";
import { getMarketByBase, TRADE_FEE_RATE } from "@/lib/market/symbols";
import { roundMoney } from "@/lib/utils/money";
import {
  normalizeOrder,
  isMarketable,
  executionPrice,
  computeEconomics,
  reservationFor,
  type RawOrderInput,
  type NormalizedOrder,
} from "./spotEngine";

export interface PlacedOrder {
  id: string;
  product: string;
  symbol: string;
  base: string;
  quote: string;
  side: string;
  type: string;
  price: number | null;
  size: number;
  filledPrice: number | null;
  fee: number;
  leverage: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function serialize(o: {
  id: string; product: string; symbol: string; base: string; quote: string;
  side: string; type: string; price: number | null; size: number;
  filledPrice: number | null; fee: number; leverage: number; status: string;
  createdAt: Date; updatedAt: Date;
}): PlacedOrder {
  return {
    id: o.id, product: o.product, symbol: o.symbol, base: o.base, quote: o.quote,
    side: o.side, type: o.type, price: o.price, size: o.size,
    filledPrice: o.filledPrice, fee: o.fee, leverage: o.leverage, status: o.status,
    createdAt: o.createdAt.toISOString(), updatedAt: o.updatedAt.toISOString(),
  };
}

async function fillBuy(
  tx: Prisma.TransactionClient,
  userId: number,
  order: NormalizedOrder,
  execPrice: number
) {
  const econ = computeEconomics(order.size, execPrice);
  const dec = await tx.user.updateMany({
    where: { id: userId, mainBalance: { gte: econ.buyDebit } },
    data: { mainBalance: { decrement: econ.buyDebit } },
  });
  if (dec.count !== 1) throw new AppError("Insufficient balance", 400, "INSUFFICIENT_FUNDS");

  await tx.holding.upsert({
    where: { userId_asset: { userId, asset: order.base } },
    update: { amount: { increment: order.size } },
    create: { userId, asset: order.base, amount: order.size },
  });
  return econ;
}

async function fillSell(
  tx: Prisma.TransactionClient,
  userId: number,
  order: NormalizedOrder,
  execPrice: number
) {
  const econ = computeEconomics(order.size, execPrice);
  const dec = await tx.holding.updateMany({
    where: { userId, asset: order.base, amount: { gte: order.size } },
    data: { amount: { decrement: order.size } },
  });
  if (dec.count !== 1) throw new AppError(`Insufficient ${order.base} balance`, 400, "INSUFFICIENT_HOLDINGS");

  await tx.user.update({
    where: { id: userId },
    data: { mainBalance: { increment: econ.sellProceeds } },
  });
  return econ;
}

export interface PlaceOrderOptions {
  /** Force an immediate fill at this exact price (used for accepted OTC quotes). */
  forceFillPrice?: number;
}

/** Place an order for the given user. Executes immediately if marketable, else rests. */
export async function placeOrder(
  userId: number,
  input: RawOrderInput,
  opts: PlaceOrderOptions = {}
): Promise<PlacedOrder> {
  const order = normalizeOrder(input);
  const referencePrice = await getReferencePrice(order.symbol);
  const forced = opts.forceFillPrice != null && opts.forceFillPrice > 0;
  const marketable = forced || isMarketable(order.side, order.type, order.price, referencePrice);

  const created = await prisma.$transaction(async (tx) => {
    if (marketable) {
      const execPrice = forced
        ? (opts.forceFillPrice as number)
        : executionPrice(order.type, order.price, referencePrice);
      const econ =
        order.side === "buy"
          ? await fillBuy(tx, userId, order, execPrice)
          : await fillSell(tx, userId, order, execPrice);

      const row = await tx.spotOrder.create({
        data: {
          userId, product: order.product, symbol: order.symbol, base: order.base,
          quote: order.quote, side: order.side, type: order.type,
          price: order.price ?? null, size: order.size, filledPrice: execPrice,
          fee: econ.fee, leverage: order.leverage, reserved: 0, status: "filled",
          clientOrderId: order.clientOrderId ?? null,
        },
      });

      // Audit trail entry, consistent with the rest of the app.
      await tx.transaction.create({
        data: {
          userId, type: "trade", amount: econ.notional,
          description: `${order.side.toUpperCase()} ${order.size} ${order.base} @ ${execPrice} (${order.product})`,
          status: "Success", paymentMethod: order.quote, transactionRef: row.id,
        },
      });
      return row;
    }

    // Non-marketable limit order: rest on the book with funds/holding reserved.
    const reservation = reservationFor(order);
    if (reservation.asset === "quote") {
      const dec = await tx.user.updateMany({
        where: { id: userId, mainBalance: { gte: reservation.amount } },
        data: { mainBalance: { decrement: reservation.amount } },
      });
      if (dec.count !== 1) throw new AppError("Insufficient balance", 400, "INSUFFICIENT_FUNDS");
    } else {
      const dec = await tx.holding.updateMany({
        where: { userId, asset: order.base, amount: { gte: reservation.amount } },
        data: { amount: { decrement: reservation.amount } },
      });
      if (dec.count !== 1) throw new AppError(`Insufficient ${order.base} balance`, 400, "INSUFFICIENT_HOLDINGS");
    }

    return tx.spotOrder.create({
      data: {
        userId, product: order.product, symbol: order.symbol, base: order.base,
        quote: order.quote, side: order.side, type: order.type, price: order.price ?? null,
        size: order.size, filledPrice: null, fee: 0, leverage: order.leverage,
        reserved: reservation.amount, status: "open",
        clientOrderId: order.clientOrderId ?? null,
      },
    });
  });

  return serialize(created);
}

/** Cancel a resting (open) order and refund its reservation. */
export async function cancelOrder(userId: number, orderId: string): Promise<PlacedOrder> {
  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.spotOrder.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");
    if (order.status !== "open") {
      throw new AppError("Only open orders can be cancelled", 400, "NOT_CANCELLABLE");
    }

    if (order.side === "buy") {
      await tx.user.update({
        where: { id: userId },
        data: { mainBalance: { increment: order.reserved } },
      });
    } else {
      await tx.holding.upsert({
        where: { userId_asset: { userId, asset: order.base } },
        update: { amount: { increment: order.reserved } },
        create: { userId, asset: order.base, amount: order.reserved },
      });
    }

    return tx.spotOrder.update({
      where: { id: order.id },
      data: { status: "cancelled", reserved: 0 },
    });
  });

  return serialize(updated);
}

export interface ModifyOrderChanges {
  price?: unknown;
  size?: unknown;
}

/**
 * Modify a resting (open) limit order's price and/or size. Implemented as
 * cancel-and-replace: the old reservation is refunded first, then a fresh order
 * is placed with the new parameters (which re-reserves and may immediately fill
 * if the new price is now marketable). Refund-first means a failure to place the
 * replacement simply leaves the user's funds intact — never double-spent.
 */
export async function modifyOrder(
  userId: number,
  orderId: string,
  changes: ModifyOrderChanges
): Promise<PlacedOrder> {
  const existing = await prisma.spotOrder.findFirst({ where: { id: orderId, userId } });
  if (!existing) throw new AppError("Order not found", 404, "NOT_FOUND");
  if (existing.status !== "open") {
    throw new AppError("Only open orders can be modified", 400, "NOT_MODIFIABLE");
  }
  if (existing.type !== "limit") {
    throw new AppError("Only limit orders can be modified", 400, "NOT_MODIFIABLE");
  }

  const newPrice = changes.price != null ? Number(changes.price) : existing.price;
  const newSize = changes.size != null ? Number(changes.size) : existing.size;
  if (!Number.isFinite(newPrice as number) || (newPrice as number) <= 0) {
    throw new AppError("Limit orders require a positive price", 400, "BAD_PRICE");
  }
  if (!Number.isFinite(newSize) || newSize <= 0) {
    throw new AppError("Size must be a positive number", 400, "BAD_SIZE");
  }

  // Refund the old reservation, then place the replacement.
  await cancelOrder(userId, orderId);
  return placeOrder(userId, {
    symbol: existing.symbol,
    side: existing.side,
    type: "limit",
    size: newSize,
    price: newPrice as number,
    product: existing.product,
    leverage: existing.leverage,
  });
}

export interface ListOrdersParams {
  symbol?: string;
  status?: string;
  product?: string;
  limit?: number;
  offset?: number;
}

const ALLOWED_STATUS = new Set(["open", "filled", "cancelled", "rejected", "pending"]);
const ALLOWED_PRODUCT = new Set(["spot", "margin", "futures"]);

export async function listOrders(userId: number, params: ListOrdersParams = {}) {
  const where: Prisma.SpotOrderWhereInput = { userId };
  if (params.symbol) where.symbol = params.symbol.toUpperCase();
  // Only apply recognized filter values; ignore garbage so a bad query param
  // can't silently return an empty/incorrect set.
  if (params.status && ALLOWED_STATUS.has(params.status)) where.status = params.status;
  if (params.product && ALLOWED_PRODUCT.has(params.product)) where.product = params.product;

  // Guard against NaN (e.g. ?limit=abc) reaching Prisma's take/skip.
  const rawLimit = params.limit;
  const rawOffset = params.offset;
  const take = Math.min(Math.max(Number.isFinite(rawLimit as number) ? (rawLimit as number) : 50, 1), 200);
  const skip = Math.max(Number.isFinite(rawOffset as number) ? (rawOffset as number) : 0, 0);

  const [rows, total] = await Promise.all([
    prisma.spotOrder.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
    prisma.spotOrder.count({ where }),
  ]);

  return { orders: rows.map(serialize), total };
}

/**
 * Fill any resting (open) limit orders that have become marketable against the
 * current reference price. Reservations were already locked at placement, so a
 * fill just releases them into the opposite asset. Intended to be called on a
 * schedule (cron / scheduled task) or after notable price moves.
 * Returns the number of orders filled.
 */
export async function matchRestingOrders(limit = 200): Promise<number> {
  const open = await prisma.spotOrder.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "asc" },
    take: Math.min(Math.max(limit, 1), 1000),
  });
  if (open.length === 0) return 0;

  // Price each distinct symbol once.
  const symbols = Array.from(new Set(open.map((o) => o.symbol)));
  const prices = new Map<string, number>();
  await Promise.all(
    symbols.map(async (s) => {
      try {
        prices.set(s, await getReferencePrice(s));
      } catch {
        /* skip unpriceable symbols */
      }
    })
  );

  let filled = 0;
  for (const o of open) {
    const ref = prices.get(o.symbol);
    if (ref == null || o.price == null) continue;
    const marketable = o.side === "buy" ? o.price >= ref : o.price <= ref;
    if (!marketable) continue;

    const econ = computeEconomics(o.size, o.price);
    try {
      await prisma.$transaction(async (tx) => {
        // Re-check it is still open inside the tx to avoid double-fills.
        const current = await tx.spotOrder.findUnique({ where: { id: o.id } });
        if (!current || current.status !== "open") return;

        if (o.side === "buy") {
          // Quote (notional + fee) already reserved at placement → credit base.
          await tx.holding.upsert({
            where: { userId_asset: { userId: o.userId, asset: o.base } },
            update: { amount: { increment: o.size } },
            create: { userId: o.userId, asset: o.base, amount: o.size },
          });
        } else {
          // Base already reserved → credit quote proceeds.
          await tx.user.update({
            where: { id: o.userId },
            data: { mainBalance: { increment: econ.sellProceeds } },
          });
        }

        await tx.spotOrder.update({
          where: { id: o.id },
          data: { status: "filled", filledPrice: o.price, fee: econ.fee, reserved: 0 },
        });

        await tx.transaction.create({
          data: {
            userId: o.userId, type: "trade", amount: econ.notional,
            description: `${o.side.toUpperCase()} ${o.size} ${o.base} @ ${o.price} (limit fill)`,
            status: "Success", paymentMethod: o.quote, transactionRef: o.id,
          },
        });
      });
      filled += 1;
    } catch {
      /* leave the order open; it will be retried next run */
    }
  }
  return filled;
}

// ── Asset swaps (Wallet) ──────────────────────────────────────────────────
// Convert one asset directly into another using live prices. The quote currency
// USDT maps to the user's mainBalance; base assets map to Holdings. Atomic and
// overdraw-proof, identical guarantees to order execution.

const SWAP_FEE_RATE = TRADE_FEE_RATE; // 0.10%

async function assetUsdPrice(asset: string): Promise<number> {
  if (asset === "USDT") return 1;
  const market = getMarketByBase(asset);
  if (!market) throw new AppError(`Unsupported asset: ${asset}`, 400, "BAD_ASSET");
  return getReferencePrice(market.symbol);
}

export interface SwapQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  rate: number; // how many toAsset per 1 fromAsset
  feeUsd: number;
  priceFrom: number;
  priceTo: number;
}

function normalizeAsset(a: unknown): string {
  const s = String(a ?? "").toUpperCase().trim();
  if (s !== "USDT" && !getMarketByBase(s)) {
    throw new AppError(`Unsupported asset: ${s || "(empty)"}`, 400, "BAD_ASSET");
  }
  return s;
}

/** Price a swap without executing it. */
export async function quoteSwap(
  fromAssetRaw: unknown,
  toAssetRaw: unknown,
  fromAmountRaw: unknown
): Promise<SwapQuote> {
  const fromAsset = normalizeAsset(fromAssetRaw);
  const toAsset = normalizeAsset(toAssetRaw);
  if (fromAsset === toAsset) throw new AppError("Choose two different assets", 400, "SAME_ASSET");
  const fromAmount = Number(fromAmountRaw);
  if (!Number.isFinite(fromAmount) || fromAmount <= 0) {
    throw new AppError("Amount must be positive", 400, "BAD_AMOUNT");
  }

  const [priceFrom, priceTo] = await Promise.all([assetUsdPrice(fromAsset), assetUsdPrice(toAsset)]);
  const valueUsd = fromAmount * priceFrom;
  const feeUsd = roundMoney(valueUsd * SWAP_FEE_RATE);
  const toAmount = (valueUsd - feeUsd) / priceTo;
  return {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    rate: priceFrom / priceTo,
    feeUsd,
    priceFrom,
    priceTo,
  };
}

async function debitAsset(tx: Prisma.TransactionClient, userId: number, asset: string, amount: number) {
  if (asset === "USDT") {
    const dec = await tx.user.updateMany({
      where: { id: userId, mainBalance: { gte: amount } },
      data: { mainBalance: { decrement: amount } },
    });
    if (dec.count !== 1) throw new AppError("Insufficient USDT balance", 400, "INSUFFICIENT_FUNDS");
  } else {
    const dec = await tx.holding.updateMany({
      where: { userId, asset, amount: { gte: amount } },
      data: { amount: { decrement: amount } },
    });
    if (dec.count !== 1) throw new AppError(`Insufficient ${asset} balance`, 400, "INSUFFICIENT_HOLDINGS");
  }
}

async function creditAsset(tx: Prisma.TransactionClient, userId: number, asset: string, amount: number) {
  if (asset === "USDT") {
    await tx.user.update({ where: { id: userId }, data: { mainBalance: { increment: amount } } });
  } else {
    await tx.holding.upsert({
      where: { userId_asset: { userId, asset } },
      update: { amount: { increment: amount } },
      create: { userId, asset, amount },
    });
  }
}

/** Execute an asset swap for a user at live rates. */
export async function swapAssets(
  userId: number,
  fromAssetRaw: unknown,
  toAssetRaw: unknown,
  fromAmountRaw: unknown
): Promise<SwapQuote & { executed: true }> {
  const quote = await quoteSwap(fromAssetRaw, toAssetRaw, fromAmountRaw);

  await prisma.$transaction(async (tx) => {
    await debitAsset(tx, userId, quote.fromAsset, quote.fromAmount);
    await creditAsset(tx, userId, quote.toAsset, quote.toAmount);
    await tx.transaction.create({
      data: {
        userId,
        type: "swap",
        amount: roundMoney(quote.fromAmount * quote.priceFrom),
        description: `Swap ${quote.fromAmount} ${quote.fromAsset} → ${quote.toAmount.toFixed(8)} ${quote.toAsset}`,
        status: "Success",
        paymentMethod: `${quote.fromAsset}->${quote.toAsset}`,
      },
    });
  });

  return { ...quote, executed: true };
}

export async function getHoldings(userId: number) {
  const [user, holdings] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { mainBalance: true } }),
    prisma.holding.findMany({ where: { userId }, orderBy: { asset: "asc" } }),
  ]);
  return {
    quote: { asset: "USDT", amount: user?.mainBalance ?? 0 },
    holdings: holdings
      .filter((h) => h.amount > 0)
      .map((h) => ({ asset: h.asset, amount: h.amount })),
  };
}
