import {
  roundMoney,
  addMoney,
  subtractMoney,
  toCents,
  fromCents,
  parseAmount,
  formatMoney,
} from "@/lib/utils/money";

describe("money utils", () => {
  it("adds without float drift (0.1 + 0.2 === 0.3)", () => {
    expect(addMoney(0.1, 0.2)).toBe(0.3);
    expect(0.1 + 0.2).not.toBe(0.3); // sanity: native float is wrong
  });

  it("subtracts without float drift", () => {
    expect(subtractMoney(0.3, 0.1)).toBe(0.2);
    expect(subtractMoney(100.0, 99.99)).toBe(0.01);
  });

  it("rounds to cents", () => {
    expect(roundMoney(1.005)).toBe(1.01);
    expect(roundMoney(2.675)).toBe(2.68);
  });

  it("converts to/from cents exactly", () => {
    expect(toCents(19.99)).toBe(1999);
    expect(fromCents(1999)).toBe(19.99);
  });

  it("parseAmount validates and normalizes", () => {
    expect(parseAmount("100.005")).toBe(100.01);
    expect(() => parseAmount("-1")).toThrow();
    expect(() => parseAmount("abc")).toThrow();
    expect(() => parseAmount(Infinity)).toThrow();
    expect(() => parseAmount(2_000_000)).toThrow();
    expect(() => parseAmount(500, { min: 1000 })).toThrow();
  });

  it("formats money", () => {
    expect(formatMoney(1234.5)).toBe("1,234.50");
    expect(formatMoney(0)).toBe("0.00");
  });
});
