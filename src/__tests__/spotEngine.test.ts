import {
  normalizeOrder,
  computeFee,
  isMarketable,
  executionPrice,
  computeEconomics,
  reservationFor,
} from "@/lib/services/spotEngine";

describe("spotEngine.normalizeOrder", () => {
  it("normalizes a valid limit buy", () => {
    const o = normalizeOrder({ symbol: "btcusdt", side: "BUY", type: "limit", size: "0.5", price: "60000" });
    expect(o).toMatchObject({ symbol: "BTCUSDT", base: "BTC", quote: "USDT", side: "buy", type: "limit", size: 0.5, price: 60000, product: "spot", leverage: 1 });
  });

  it("rejects unknown symbols", () => {
    expect(() => normalizeOrder({ symbol: "DOGEUSDT", side: "buy", type: "market", size: 1 })).toThrow(/Unsupported/);
  });

  it("rejects non-positive size", () => {
    expect(() => normalizeOrder({ symbol: "BTCUSDT", side: "buy", type: "market", size: 0 })).toThrow(/Size/);
    expect(() => normalizeOrder({ symbol: "BTCUSDT", side: "buy", type: "market", size: -1 })).toThrow(/Size/);
  });

  it("requires a price for limit orders", () => {
    expect(() => normalizeOrder({ symbol: "BTCUSDT", side: "buy", type: "limit", size: 1 })).toThrow(/price/);
  });

  it("caps leverage by product", () => {
    expect(normalizeOrder({ symbol: "BTCUSDT", side: "buy", type: "market", size: 1, product: "futures", leverage: 999 }).leverage).toBe(50);
    expect(normalizeOrder({ symbol: "BTCUSDT", side: "buy", type: "market", size: 1, product: "margin", leverage: 999 }).leverage).toBe(5);
    expect(normalizeOrder({ symbol: "BTCUSDT", side: "buy", type: "market", size: 1, product: "spot", leverage: 999 }).leverage).toBe(1);
  });
});

describe("spotEngine pricing", () => {
  it("computes a 0.10% fee", () => {
    expect(computeFee(10000)).toBe(10);
    expect(computeFee(64281.5)).toBe(64.28);
  });

  it("market orders are always marketable; limits cross correctly", () => {
    expect(isMarketable("buy", "market", undefined, 100)).toBe(true);
    expect(isMarketable("buy", "limit", 101, 100)).toBe(true); // willing to pay above market
    expect(isMarketable("buy", "limit", 99, 100)).toBe(false);
    expect(isMarketable("sell", "limit", 99, 100)).toBe(true); // willing to sell below market
    expect(isMarketable("sell", "limit", 101, 100)).toBe(false);
  });

  it("uses reference price for market, limit price for limit", () => {
    expect(executionPrice("market", undefined, 64281.5)).toBe(64281.5);
    expect(executionPrice("limit", 60000, 64281.5)).toBe(60000);
  });

  it("computes economics with fee on both sides", () => {
    const e = computeEconomics(0.5, 60000); // notional 30000
    expect(e.notional).toBe(30000);
    expect(e.fee).toBe(30);
    expect(e.buyDebit).toBe(30030);
    expect(e.sellProceeds).toBe(29970);
  });

  it("reserves quote for resting buys, base for resting sells", () => {
    expect(reservationFor({ side: "buy", size: 0.5, price: 60000 })).toEqual({ asset: "quote", amount: 30030 });
    expect(reservationFor({ side: "sell", size: 0.5, price: 60000 })).toEqual({ asset: "base", amount: 0.5 });
  });
});
