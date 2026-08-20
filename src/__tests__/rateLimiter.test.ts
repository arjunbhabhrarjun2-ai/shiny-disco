import { rateLimit, clientIp } from "@/lib/rateLimiter";

describe("rateLimiter", () => {
  it("allows up to max then blocks within the window", () => {
    const id = `test:${Math.random()}`;
    const cfg = { windowMs: 60_000, max: 3 };

    expect(rateLimit(id, cfg).allowed).toBe(true);
    expect(rateLimit(id, cfg).allowed).toBe(true);
    const third = rateLimit(id, cfg);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = rateLimit(id, cfg);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    const id = `test:${Math.random()}`;
    const cfg = { windowMs: -1, max: 1 }; // window already elapsed each call
    expect(rateLimit(id, cfg).allowed).toBe(true);
    expect(rateLimit(id, cfg).allowed).toBe(true); // new window every time
  });

  it("extracts client ip from x-forwarded-for", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "9.9.9.9, 10.0.0.1" },
    });
    expect(clientIp(req)).toBe("9.9.9.9");
  });

  it("falls back to 'unknown' without proxy headers", () => {
    const req = new Request("https://x.test");
    expect(clientIp(req)).toBe("unknown");
  });
});
