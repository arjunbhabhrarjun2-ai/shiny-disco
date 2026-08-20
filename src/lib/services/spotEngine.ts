// src/lib/services/spotEngine.ts
//
// Pure trading logic — no DB, no network — so it can be unit-tested in isolation.
// The DB-backed orchestration lives in spotTradingService.ts and calls into here.

import { getMarket, TRADE_FEE_RATE } from "@/lib/market/symbols";
import { roundMoney, toCents, fromCents } from "@/lib/utils/money";
import { AppError } from "@/lib/errorHandler";

export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit";
export type TradeProduct = "spot" | "margin" | "futures";

export interface RawOrderInput {
  symbol?: unknown;
  side?: unknown;
  type?: unknown;
  size?: unknown;
  price?: unknown;
  product?: unknown;
  leverage?: unknown;
  clientOrderId?: unknown;
}

export interface NormalizedOrder {
  symbol: string;
  base: string;
  quote: string;
  side: OrderSide;
  type: OrderType;
  size: number;
  price?: number; // limit price (required for limit)
  product: TradeProduct;
  leverage: number;
  clientOrderId?: string;
}

const MAX_SIZE = 1_000_000;
const MAX_LEVERAGE: Record<TradeProduct, number> = {
  spot: 1,
  margin: 5,
  futures: 50,
};

/** Validate & normalize an untrusted order payload. Throws AppError(400). */
export function normalizeOrder(input: RawOrderInput): NormalizedOrder {
  const symbol = String(input.symbol ?? "").toUpperCase();
  const market = getMarket(symbol);
  if (!market) throw new AppError("Unsupported trading pair", 400, "BAD_SYMBOL");

  const side = String(input.side ?? "").toLowerCase();
  if (side !== "buy" && side !== "sell") {
    throw new AppError("Side must be 'buy' or 'sell'", 400, "BAD_SIDE");
  }

  const type = String(input.type ?? "limit").toLowerCase();
  if (type !== "market" && type !== "limit") {
    throw new AppError("Type must be 'market' or 'limit'", 400, "BAD_TYPE");
  }

  const size = Number(input.size);
  if (!Number.isFinite(size) || size <= 0 || size > MAX_SIZE) {
    throw new AppError("Size must be a positive number", 400, "BAD_SIZE");
  }

  let price: number | undefined;
  if (type === "limit") {
    price = Number(input.price);
    if (!Number.isFinite(price) || price <= 0) {
      throw new AppError("Limit orders require a positive price", 400, "BAD_PRICE");
    }
    price = roundMoney(price);
  }

  const product = (["spot", "margin", "futures"].includes(String(input.product))
    ? String(input.product)
    : "spot") as TradeProduct;

  let leverage = Number(input.leverage ?? 1);
  if (!Number.isFinite(leverage) || leverage < 1) leverage = 1;
  leverage = Math.min(Math.floor(leverage), MAX_LEVERAGE[product]);

  const clientOrderId =
    typeof input.clientOrderId === "string" && input.clientOrderId.length <= 64
      ? input.clientOrderId
      : undefined;

  return {
    symbol: market.symbol,
    base: market.base,
    quote: market.quote,
    side,
    type,
    size,
    price,
    product,
    leverage,
    clientOrderId,
  };
}

/** Fee on a notional value (quote currency). */
export function computeFee(notional: number): number {
  return roundMoney(Math.abs(notional) * TRADE_FEE_RATE);
}

/** A market order always executes; a limit order executes only if price-crossed. */
export function isMarketable(
  side: OrderSide,
  type: OrderType,
  limitPrice: number | undefined,
  referencePrice: number
): boolean {
  if (type === "market") return true;
  if (limitPrice == null) return false;
  return side === "buy" ? limitPrice >= referencePrice : limitPrice <= referencePrice;
}

/** Price an order fills at. */
export function executionPrice(
  type: OrderType,
  limitPrice: number | undefined,
  referencePrice: number
): number {
  return type === "market" ? referencePrice : (limitPrice as number);
}

export interface OrderEconomics {
  notional: number; // size * execPrice
  fee: number;
  /** Quote currency that must be debited up front for a BUY (notional + fee). */
  buyDebit: number;
  /** Quote currency credited to the user for a SELL (notional - fee). */
  sellProceeds: number;
}

export function computeEconomics(size: number, execPrice: number): OrderEconomics {
  const notional = fromCents(Math.round(size * execPrice * 100)); // cents-exact
  const fee = computeFee(notional);
  return {
    notional,
    fee,
    buyDebit: roundMoney(notional + fee),
    sellProceeds: Math.max(0, roundMoney(notional - fee)),
  };
}

/** Reservation locked when a limit order rests on the book. */
export function reservationFor(
  order: Pick<NormalizedOrder, "side" | "size" | "price">
): { asset: "quote" | "base"; amount: number } {
  if (order.side === "buy") {
    const econ = computeEconomics(order.size, order.price as number);
    return { asset: "quote", amount: econ.buyDebit };
  }
  return { asset: "base", amount: order.size };
}

export { toCents, fromCents };
