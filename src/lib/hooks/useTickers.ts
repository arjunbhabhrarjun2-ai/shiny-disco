import { useEffect, useRef, useState } from 'react';
import { tradeApi } from '@/lib/services/tradeApi';
import type { MarketTicker } from '@/types/trade';

/** Live tickers for the whole market list (watchlist). Public, no auth. */
export function useTickers(refreshMs = 6000) {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fetchTickers = async () => {
      try {
        const res = await tradeApi.getAllTickers();
        if (!mounted.current) return;
        setTickers(res.tickers || []);
        setIsError(false);
      } catch {
        if (mounted.current) setIsError(true);
      } finally {
        if (mounted.current) setIsLoading(false);
      }
    };
    fetchTickers();
    const interval = setInterval(fetchTickers, refreshMs);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [refreshMs]);

  return { tickers, isLoading, isError };
}
