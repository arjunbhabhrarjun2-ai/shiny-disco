import { useCallback, useEffect, useRef, useState } from 'react';
import { tradeApi } from '@/lib/services/tradeApi';
import type { SpotOrderRequest, SpotOrder } from '@/types/trade';

interface UseSpotOrdersResult {
  orders: SpotOrder[];
  openOrders: SpotOrder[];
  isLoading: boolean;
  isSubmitting: boolean;
  isError: boolean;
  errorMessage: string | null;
  submitOrder: (payload: SpotOrderRequest) => Promise<SpotOrder | null>;
  cancelOrder: (id: string) => Promise<boolean>;
  mutate: () => Promise<void>;
}

/**
 * User-scoped spot/derivatives orders. Requires an authenticated session (the
 * service attaches the Bearer token). Polls for status changes.
 */
export function useSpotOrders(
  params: { symbol?: string; product?: string } = {},
  refreshMs = 7000
): UseSpotOrdersResult {
  const { symbol, product } = params;
  const [orders, setOrders] = useState<SpotOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mounted = useRef(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await tradeApi.getSpotOrders({ symbol, product });
      if (!mounted.current) return;
      setOrders(res.orders || []);
      setIsError(false);
    } catch (e) {
      if (!mounted.current) return;
      setIsError(true);
      setErrorMessage(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, [symbol, product]);

  useEffect(() => {
    mounted.current = true;
    setIsLoading(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, refreshMs);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [fetchOrders, refreshMs]);

  const submitOrder = useCallback(async (payload: SpotOrderRequest) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await tradeApi.createSpotOrder(payload);
      setOrders((prev) => [res.order, ...prev]);
      setIsError(false);
      return res.order;
    } catch (e) {
      setIsError(true);
      setErrorMessage(e instanceof Error ? e.message : 'Order failed');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id: string) => {
    setErrorMessage(null);
    try {
      const res = await tradeApi.cancelSpotOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? res.order : o)));
      return true;
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Cancel failed');
      return false;
    }
  }, []);

  return {
    orders,
    openOrders: orders.filter((o) => o.status === 'open' || o.status === 'pending'),
    isLoading,
    isSubmitting,
    isError,
    errorMessage,
    submitOrder,
    cancelOrder,
    mutate: fetchOrders,
  };
}
