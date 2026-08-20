import { useCallback, useEffect, useRef, useState } from 'react';
import { tradeApi, type HoldingsResponse } from '@/lib/services/tradeApi';

interface UseHoldingsResult {
  quote: { asset: string; amount: number };
  holdings: { asset: string; amount: number }[];
  isLoading: boolean;
  isError: boolean;
  mutate: () => Promise<void>;
}

/** The authenticated user's quote balance (USDT) and per-asset base holdings. */
export function useHoldings(refreshMs = 8000): UseHoldingsResult {
  const [data, setData] = useState<HoldingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const mounted = useRef(true);

  const fetchHoldings = useCallback(async () => {
    try {
      const res = await tradeApi.getHoldings();
      if (!mounted.current) return;
      setData(res);
      setIsError(false);
    } catch {
      if (mounted.current) setIsError(true);
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchHoldings();
    const interval = setInterval(fetchHoldings, refreshMs);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [fetchHoldings, refreshMs]);

  return {
    quote: data?.quote ?? { asset: 'USDT', amount: 0 },
    holdings: data?.holdings ?? [],
    isLoading,
    isError,
    mutate: fetchHoldings,
  };
}
