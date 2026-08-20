export type TradeProduct = 'spot' | 'margin' | 'futures' | 'otc';
export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type OrderStatus = 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
export type PositionSide = 'long' | 'short';

export interface MarketTicker {
  symbol: string;
  base: string;
  quote: string;
  name?: string;
  price: number;
  change24h: number;
  volume24h?: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total?: number;
}

export interface MarketOrderBook {
  symbol: string;
  asks: OrderBookLevel[];
  bids: OrderBookLevel[];
  mid: number;
  spread: number;
  updatedAt: string;
}

export interface MarketTrade {
  id: string;
  symbol: string;
  price: number;
  size: number;
  side: OrderSide;
  timestamp: string;
}

export interface SpotOrderRequest {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price?: number;
  size: number;
  product?: TradeProduct;
  leverage?: number;
  clientOrderId?: string;
}

export interface SpotOrder {
  id: string;
  product: TradeProduct;
  symbol: string;
  base: string;
  quote: string;
  side: OrderSide;
  type: OrderType;
  price?: number | null;
  size: number;
  filledPrice?: number | null;
  fee: number;
  leverage: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RiskSnapshot {
  product: TradeProduct;
  marginRatio?: number;
  liquidationPrice?: number;
  leverage?: number;
  maintenanceMargin?: number;
  warningLevel?: 'safe' | 'moderate' | 'risky' | 'critical';
}

export interface TradePosition {
  id: string;
  product: TradeProduct;
  symbol: string;
  side: PositionSide;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPct: number;
  leverage?: number;
  marginMode?: 'cross' | 'isolated';
  liquidationPrice?: number;
}

export interface OtcRfqRequest {
  baseAsset: string;
  quoteAsset: string;
  side: OrderSide;
  amount: number;
  settlement: 'T+0' | 'T+1' | 'T+2';
}

export interface OtcQuote {
  id: string;
  rfqId: string;
  price: number;
  expiresAt: string;
  status: 'active' | 'accepted' | 'rejected' | 'expired';
}
