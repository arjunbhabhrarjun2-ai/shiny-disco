'use client';

import { useMarketIndex, getAllPriceChanges, useHistoricalVolatility } from '@/lib/hooks/useMarketIndex';
import {
  calculateMarketVolatility,
  calculateVolatility,
  getVolatilityColor,
  getVolatilityLabel,
  getVolatilityMessage,
} from '@/lib/utils/marketCalculations';

interface VolatilityMeterProps {
  useHistorical?: boolean;
  asset?: string;
  timeframe?: string;
}

export default function VolatilityMeter({
  useHistorical = false,
  asset = 'BTC/USD',
  timeframe = '1D',
}: VolatilityMeterProps) {
  const { data: marketData, isLoading: marketLoading } = useMarketIndex();
  const { chartData, isLoading: chartLoading } = useHistoricalVolatility(asset, timeframe);
  const isLoading = marketLoading || (useHistorical && chartLoading);

  let volatilityLevel = 50;
  let calculationMethod = 'Market (24h)';

  if (useHistorical && chartData.length > 0) {
    const prices = chartData.map((point: any) => point.price);
    volatilityLevel = calculateVolatility(prices);
    calculationMethod = `Historical (${timeframe})`;
  } else if (marketData) {
    const priceChanges = getAllPriceChanges(marketData);
    volatilityLevel = calculateMarketVolatility(priceChanges);
    calculationMethod = 'Market (24h)';
  }

  const barColor = volatilityLevel < 30 ? '#10B981' : volatilityLevel < 70 ? '#F59E0B' : '#F43F5E';

  if (isLoading) {
    return (
      <div
        className="p-4 rounded-xl animate-pulse"
        style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-3 rounded w-1/3 mb-3" style={{ background: '#111827' }} />
        <div className="h-2.5 rounded-full mb-2" style={{ background: '#111827' }} />
        <div className="h-3 rounded w-1/2" style={{ background: '#111827' }} />
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-white">Market Volatility</h3>
        <span className="text-xs" style={{ color: '#6B7280' }}>{calculationMethod}</span>
      </div>

      <div className="space-y-3">
        {/* Gauge bar */}
        <div>
          <div
            className="w-full rounded-full h-2.5"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${volatilityLevel}%`, background: barColor }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: '#4B5563' }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Level + label */}
        <div className="flex justify-between items-center">
          <span className="text-xs" style={{ color: '#6B7280' }}>Current Level:</span>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: barColor, fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
            >
              {volatilityLevel.toFixed(1)}%
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{
                background: `${barColor}18`,
                color: barColor,
              }}
            >
              {getVolatilityLabel(volatilityLevel)}
            </span>
          </div>
        </div>

        <p className="text-xs" style={{ color: '#6B7280' }}>
          {getVolatilityMessage(volatilityLevel)}
        </p>

        {useHistorical && chartData.length > 0 && (
          <p className="text-xs pt-2" style={{ color: '#4B5563', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            Calculated from {chartData.length} data points
          </p>
        )}
      </div>
    </div>
  );
}
