import TradeTerminal from '@/components/trade/TradeTerminal';

export const metadata = {
  title: 'Futures Trading — Kandella',
};

// Futures uses the same live terminal as spot. Leverage is recorded and shown
// for risk context; positions remain fully collateralized (no perp funding /
// liquidation engine) — see TRADING_ARCHITECTURE.md.
export default function FuturesTradingPage() {
  return <TradeTerminal product="futures" maxLeverage={50} />;
}
