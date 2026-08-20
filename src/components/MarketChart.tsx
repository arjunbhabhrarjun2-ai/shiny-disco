'use client';

import React, { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useSWR from 'swr';
import { useMarketIndex, getCoinFromIndex } from '@/lib/hooks/useMarketIndex';
import ChartSelector from './ChartSelector';
import TimeframeSelector from './TimeframeSelector';
import { chart } from '@/lib/tokens';

interface MarketChartProps {
  height?: number;
}

const ASSETS = ['BTC/USD', 'ETH/USD', 'USDT/USD', 'XRP/USD', 'SOL/USD', 'USDT-BSC/USD'];
const TIMEFRAMES = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MarketChart({ height = 300 }: MarketChartProps) {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[0]);

  const { data: marketData } = useMarketIndex();

  const { data: chartResponse, error, isLoading } = useSWR(
    `/api/market/chart?asset=${selectedAsset}&timeframe=${selectedTimeframe}`,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false }
  );

  const isError = !!error;

  const chartData = useMemo(() => {
    if (!chartResponse?.prices) return [];
    return chartResponse.prices.map((point: any) => ({
      time: new Date(point.time).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: selectedTimeframe === '1D' ? '2-digit' : undefined,
        minute: selectedTimeframe === '1D' ? '2-digit' : undefined,
        hour12: false,
      }),
      price: point.price,
      timestamp: point.time,
    }));
  }, [chartResponse, selectedTimeframe]);

  const coinData = getCoinFromIndex(marketData, selectedAsset);
  const currentPrice = coinData?.current_price || chartData[chartData.length - 1]?.price || 0;
  const changePercent = coinData?.price_change_percentage_24h || 0;
  const firstPrice = chartData[0]?.price || currentPrice;
  const historicalChange = firstPrice > 0 ? ((currentPrice - firstPrice) / firstPrice) * 100 : 0;
  const displayChangePercent = selectedTimeframe === '1D' ? changePercent : historicalChange;
  const isPositive = displayChangePercent >= 0;
  const changeColor = isPositive ? chart.tertiary : '#F43F5E';
  const changeSymbol = isPositive ? '+' : '';

  if (isLoading) {
    return (
      <div
        className="p-6 rounded-xl animate-pulse"
        style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-4 rounded w-1/4 mb-4" style={{ background: '#111827' }} />
        <div className="h-8 rounded w-1/3 mb-6" style={{ background: '#111827' }} />
        <div className="h-64 rounded" style={{ background: '#111827' }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="p-6 rounded-xl"
        style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-center py-8" style={{ color: '#F43F5E' }}>Failed to load market data</div>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <ChartSelector assets={ASSETS} selectedAsset={selectedAsset} onSelect={setSelectedAsset} />
      <TimeframeSelector
        timeframes={TIMEFRAMES}
        selectedTimeframe={selectedTimeframe}
        onSelect={setSelectedTimeframe}
      />

      {/* Chart header */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h3 className="text-sm font-medium" style={{ color: '#9CA3AF' }}>{selectedAsset}</h3>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span
              className="text-2xl font-semibold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
            >
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className="text-sm font-medium px-2 py-0.5 rounded-md"
              style={{
                color: changeColor,
                background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              }}
            >
              {changeSymbol}{Math.abs(displayChangePercent).toFixed(2)}%
            </span>
            {marketData && (
              <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
              >
                LIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={changeColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={changeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="transparent"
            tick={{ fill: '#6B7280', fontSize: 10 }}
            interval="preserveStartEnd"
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: '#6B7280', fontSize: 10 }}
            domain={['dataMin - 10', 'dataMax + 10']}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#F9FAFB',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
            labelFormatter={(label) => `${label}`}
            formatter={(value) => {
              const numericValue =
                typeof value === 'number'
                  ? value
                  : typeof value === 'string'
                    ? Number(value)
                    : NaN;
              const formattedValue = Number.isFinite(numericValue)
                ? `$${numericValue.toLocaleString()}`
                : `$${value ?? ''}`;
              return [formattedValue, 'Price'];
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={changeColor}
            strokeWidth={1.5}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
