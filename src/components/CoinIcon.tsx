'use client';

import { useState } from 'react';

/**
 * Renders a crypto asset's real logo from the cryptocurrency-icons CDN
 * (covers ~430 coins). Falls back to a tinted circle with the ticker initials
 * for any asset the set doesn't include. Symbol is matched case-insensitively
 * by ticker (e.g. BTC, ETH, SOL, TRX, USDT).
 */
export default function CoinIcon({
  symbol,
  size = 24,
  tint = '#D4AF7F',
  style,
}: {
  symbol: string;
  size?: number;
  tint?: string;
  style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  const sym = (symbol || '').trim().toLowerCase();

  if (!sym || errored) {
    return (
      <span
        aria-label={`${symbol} icon`}
        style={{
          width: size,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: `${tint}1f`,
          color: tint,
          fontSize: Math.max(8, Math.round(size * 0.34)),
          fontWeight: 800,
          lineHeight: 1,
          ...style,
        }}
      >
        {(symbol || '?').slice(0, 3).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${sym}.svg`}
      alt={`${symbol} icon`}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{ width: size, height: size, display: 'block', ...style }}
    />
  );
}
