import { createOtcQuote, verifyOtcQuote } from "@/lib/trade/otcQuote";

process.env.JWT_SECRET = "test-jwt-secret-for-otc-quote-signing";

describe("otcQuote", () => {
  it("round-trips a valid quote", () => {
    const { token } = createOtcQuote({ symbol: "BTCUSDT", side: "buy", size: 0.5, price: 64000 });
    const result = verifyOtcQuote(token);
    expect(result.valid).toBe(true);
    expect(result.data).toMatchObject({ symbol: "BTCUSDT", side: "buy", size: 0.5, price: 64000 });
  });

  it("rejects a tampered price (signature covers the payload)", () => {
    const { token } = createOtcQuote({ symbol: "BTCUSDT", side: "buy", size: 0.5, price: 64000 });
    const [encoded, sig] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({ symbol: "BTCUSDT", side: "buy", size: 0.5, price: 1, exp: Math.floor(Date.now() / 1000) + 15 })
    ).toString("base64url");
    const result = verifyOtcQuote(`${forged}.${sig}`);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("bad_signature");
    expect(encoded).not.toBe(forged);
  });

  it("rejects an expired quote", () => {
    const { token } = createOtcQuote({ symbol: "BTCUSDT", side: "sell", size: 1, price: 100 }, -1);
    const result = verifyOtcQuote(token);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("expired");
  });

  it("rejects malformed tokens", () => {
    expect(verifyOtcQuote(null).valid).toBe(false);
    expect(verifyOtcQuote("nope").valid).toBe(false);
  });
});
