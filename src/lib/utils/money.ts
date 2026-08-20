// src/lib/utils/money.ts
//
// Money math helpers. Balances are currently stored as floating-point in the DB
// (a P1 finding — floats are not exact: 0.1 + 0.2 !== 0.3). Migrating the schema
// to Decimal is the real fix (see SECURITY_REMEDIATION.md), but until that lands,
// route this layer through these helpers so app-level arithmetic is rounded to
// cents and never accumulates binary-float drift.
//
// After the Decimal migration, swap the internals here for Prisma.Decimal /
// decimal.js while keeping the same function names — call sites won't change.

/** Round to 2 decimal places using integer cents to avoid float drift. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("roundMoney: value must be a finite number");
  }
  // Add a tiny epsilon before rounding to counter representation error.
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** a + b, computed in integer cents to avoid float drift. */
export function addMoney(a: number, b: number): number {
  return fromCents(toCents(a) + toCents(b));
}

/** a - b, computed in integer cents to avoid float drift. */
export function subtractMoney(a: number, b: number): number {
  return fromCents(toCents(a) - toCents(b));
}

/** Convert a money amount to integer cents (exact). */
export function toCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100);
}

/** Convert integer cents back to a money amount. */
export function fromCents(cents: number): number {
  return roundMoney(cents / 100);
}

/**
 * Validate and normalize an incoming money amount from an untrusted source.
 * Throws on NaN/Infinity/negatives/over-cap. Returns a cents-rounded number.
 */
export function parseAmount(
  input: unknown,
  opts: { min?: number; max?: number } = {}
): number {
  const n = typeof input === "string" ? Number(input) : (input as number);
  if (typeof n !== "number" || !Number.isFinite(n)) {
    throw new Error("Invalid amount");
  }
  const value = roundMoney(n);
  const min = opts.min ?? 0;
  const max = opts.max ?? 1_000_000;
  if (value < min) throw new Error(`Amount must be at least ${min}`);
  if (value > max) throw new Error(`Amount must not exceed ${max}`);
  return value;
}

/** Format a money amount for display, e.g. 1234.5 -> "1,234.50". */
export function formatMoney(value: number): string {
  return roundMoney(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
