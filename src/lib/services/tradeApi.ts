import { fetcher } from '@/lib/api';
import { authHeaders, handleAuthExpiry } from '@/lib/clientAuth';
import type {
  MarketTicker,
  MarketOrderBook,
  MarketTrade,
  SpotOrder,
  SpotOrderRequest,
} from '@/types/trade';

const qs = (params: Record<string, string | number | undefined>) => {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.set(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
};

// Authenticated fetch that surfaces the server's error message (instead of the
// raw body) so the UI can show "Insufficient balance" etc.
async function authedFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { ...init, headers: authHeaders(init.headers) });
  if (res.status === 401) {
    handleAuthExpiry();
    throw new Error('Session expired');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export interface HoldingsResponse {
  success: boolean;
  quote: { asset: string; amount: number };
  holdings: { asset: string; amount: number }[];
}

export const tradeApi = {
  // --- market data (public) ---
  getTicker: async (symbol = 'BTCUSDT'): Promise<{ symbol: string; tickers: MarketTicker[] }> => {
    return fetcher(`/api/market/ticker${qs({ symbol })}`);
  },

  getAllTickers: async (): Promise<{ symbol: string | null; tickers: MarketTicker[] }> => {
    return fetcher('/api/market/ticker');
  },

  getOrderBook: async (symbol = 'BTCUSDT', depth = 10): Promise<MarketOrderBook> => {
    return fetcher(`/api/market/orderbook${qs({ symbol, depth })}`);
  },

  getTrades: async (symbol = 'BTCUSDT', limit = 20): Promise<{ symbol: string; trades: MarketTrade[] }> => {
    return fetcher(`/api/market/trades${qs({ symbol, limit })}`);
  },

  // --- orders (authenticated, user-scoped) ---
  getSpotOrders: async (
    params: { symbol?: string; status?: string; product?: string } = {}
  ): Promise<{ success: boolean; orders: SpotOrder[]; total: number }> => {
    return authedFetch(`/api/trade/spot/orders${qs(params)}`);
  },

  createSpotOrder: async (payload: SpotOrderRequest): Promise<{ success: boolean; order: SpotOrder }> => {
    return authedFetch('/api/trade/spot/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  cancelSpotOrder: async (id: string): Promise<{ success: boolean; order: SpotOrder }> => {
    return authedFetch(`/api/trade/spot/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  getHoldings: async (): Promise<HoldingsResponse> => {
    return authedFetch('/api/trade/spot/holdings');
  },

  // --- Asset swaps ---
  getSwapQuote: async (from: string, to: string, amount: number): Promise<{ success: boolean; quote: SwapQuoteResult }> => {
    return authedFetch(`/api/trade/swap${qs({ from, to, amount })}`);
  },

  executeSwap: async (from: string, to: string, amount: number): Promise<{ success: boolean; swap: SwapQuoteResult }> => {
    return authedFetch('/api/trade/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, amount }),
    });
  },

  // --- OTC RFQ ---
  requestOtcQuote: async (payload: { symbol: string; side: 'buy' | 'sell'; notional: number }): Promise<{ success: boolean; quote: OtcQuote }> => {
    return authedFetch('/api/trade/otc/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  acceptOtcQuote: async (token: string): Promise<{ success: boolean; order: SpotOrder }> => {
    return authedFetch('/api/trade/otc/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  },
};

export interface SwapQuoteResult {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  feeUsd: number;
  priceFrom: number;
  priceTo: number;
}

export interface OtcQuote {
  token: string;
  symbol: string;
  base: string;
  quote: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  notional: number;
  expiresAt: string;
}
