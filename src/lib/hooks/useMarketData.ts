import { useEffect, useState } from 'react';
import { tradeApi } from '@/lib/services/tradeApi';
import type { MarketTicker, MarketOrderBook, MarketTrade } from '@/types/trade';

interface UseMarketDataResult {
  tickers: MarketTicker[];
  orderBook: MarketOrderBook | null;
  trades: MarketTrade[];
  isLoading: boolean;
  isError: boolean;
  mutate: () => Promise<void>;
}

export function useMarketData(symbol = 'BTCUSDT', refreshMs = 5000): UseMarketDataResult {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [orderBook, setOrderBook] = useState<MarketOrderBook | null>(null);
  const [trades, setTrades] = useState<MarketTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      const [tickerRes, bookRes, tradesRes] = await Promise.all([
        tradeApi.getTicker(symbol),
        tradeApi.getOrderBook(symbol, 10),
        tradeApi.getTrades(symbol, 20),
      ]);

      setTickers(tickerRes.tickers || []);
      setOrderBook(bookRes || null);
      setTrades(tradesRes.trades || []);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();

    const interval = setInterval(fetchData, refreshMs);
    return () => clearInterval(interval);
  }, [symbol, refreshMs]);

  return {
    tickers,
    orderBook,
    trades,
    isLoading,
    isError,
    mutate: fetchData,
  };
}
