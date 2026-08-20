'use client';

import { useMarketIndex } from '@/lib/hooks/useMarketIndex';

export default function MarketIndex() {
  const { data, isLoading, isError } = useMarketIndex();

  if (isLoading) {
    return (
      <div
        className="p-4 rounded-xl animate-pulse"
        style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-3 rounded w-1/3 mb-3" style={{ background: '#111827' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between mb-2">
            <div className="h-3 rounded w-1/3" style={{ background: '#111827' }} />
            <div className="h-3 rounded w-1/4" style={{ background: '#111827' }} />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className="p-4 rounded-xl"
        style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-sm font-semibold text-white mb-2">Market Index</h3>
        <p className="text-xs text-center py-4" style={{ color: '#6B7280' }}>Failed to load data</p>
      </div>
    );
  }

  const filteredTop10 = data.top10.filter(
    (coin) => coin.id !== 'bitcoin' && coin.id !== 'ethereum'
  );

  const btcChange = data.btc?.usd_24h_change ?? 0;
  const btcPrice = data.btc?.usd ?? 0;
  const ethChange = data.eth?.usd_24h_change ?? 0;
  const ethPrice = data.eth?.usd ?? 0;

  const indices = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      value: `$${btcPrice.toLocaleString()}`,
      change: `${btcChange.toFixed(2)}%`,
      isPositive: btcChange >= 0,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      value: `$${ethPrice.toLocaleString()}`,
      change: `${ethChange.toFixed(2)}%`,
      isPositive: ethChange >= 0,
    },
    ...filteredTop10.slice(0, 8).map((coin) => {
      const change24h = coin.price_change_percentage_24h ?? 0;
      const price = coin.current_price ?? 0;
      return {
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        value: `$${price.toLocaleString()}`,
        change: `${change24h.toFixed(2)}%`,
        isPositive: change24h >= 0,
      };
    }),
  ];

  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3 className="text-sm font-semibold text-white mb-3">Market Index</h3>
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {indices.map((index) => (
          <div key={index.symbol} className="flex justify-between items-center">
            <div>
              <p className="text-xs text-white">{index.name}</p>
              <p className="text-xs" style={{ color: '#4B5563' }}>{index.symbol}</p>
            </div>
            <div className="text-right">
              <p
                className="text-xs font-medium text-white"
                style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
              >
                {index.value}
              </p>
              <p
                className="text-xs font-medium"
                style={{ color: index.isPositive ? '#10B981' : '#F43F5E' }}
              >
                {index.isPositive ? '+' : ''}{index.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
