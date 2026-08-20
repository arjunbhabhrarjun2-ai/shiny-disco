'use client';

/**
 * Global display-currency context. Holds the selected fiat (USD/EUR/GBP),
 * live FX rates (from /api/fx), and helpers to convert/format USD amounts.
 * Persists the choice to localStorage so it survives reloads. Every balance or
 * value in the UI can call useCurrency().format(usdAmount) to display in the
 * user's chosen currency.
 */

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';

export type Fiat = 'USD' | 'EUR' | 'GBP';

const SYMBOLS: Record<Fiat, string> = { USD: '$', EUR: '€', GBP: '£' };
const FALLBACK_RATES: Record<Fiat, number> = { USD: 1, EUR: 0.86103, GBP: 0.7445 };

interface CurrencyContextValue {
  currency: Fiat;
  setCurrency: (c: Fiat) => void;
  symbol: string;
  rates: Record<Fiat, number>;
  rate: number;
  convert: (usd: number) => number;
  format: (usd: number, opts?: { decimals?: number }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Fiat>('USD');
  const [rates, setRates] = useState<Record<Fiat, number>>(FALLBACK_RATES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('display_currency') as Fiat | null;
      if (saved === 'USD' || saved === 'EUR' || saved === 'GBP') setCurrencyState(saved);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/fx');
        if (!res.ok) return;
        const j = await res.json();
        if (!cancelled && j?.rates) {
          setRates({
            USD: 1,
            EUR: j.rates.EUR ?? FALLBACK_RATES.EUR,
            GBP: j.rates.GBP ?? FALLBACK_RATES.GBP,
          });
        }
      } catch { /* keep current */ }
    };
    load();
    const id = setInterval(load, 30 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const setCurrency = useCallback((c: Fiat) => {
    setCurrencyState(c);
    try { localStorage.setItem('display_currency', c); } catch { /* ignore */ }
  }, []);

  const rate = rates[currency] ?? 1;
  const convert = useCallback((usd: number) => (Number(usd) || 0) * rate, [rate]);
  const format = useCallback(
    (usd: number, opts?: { decimals?: number }) => {
      const d = opts?.decimals ?? 2;
      const v = (Number(usd) || 0) * rate;
      return `${SYMBOLS[currency]}${v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
    },
    [rate, currency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, symbol: SYMBOLS[currency], rates, rate, convert, format }),
    [currency, setCurrency, rates, rate, convert, format]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Safe fallback if used outside the provider (USD, no conversion).
    return {
      currency: 'USD', setCurrency: () => {}, symbol: '$',
      rates: FALLBACK_RATES, rate: 1,
      convert: (usd: number) => Number(usd) || 0,
      format: (usd: number, opts?: { decimals?: number }) =>
        `$${(Number(usd) || 0).toLocaleString('en-US', { minimumFractionDigits: opts?.decimals ?? 2, maximumFractionDigits: opts?.decimals ?? 2 })}`,
    };
  }
  return ctx;
}
