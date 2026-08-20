import TradeTerminal from '@/components/trade/TradeTerminal';

export const metadata = {
  title: 'Margin Trading — Kandella',
};

// Margin uses the same live terminal as spot. Leverage is recorded and shown
// for risk context; positions remain fully collateralized (no borrowing /
// liquidation engine) — see TRADING_ARCHITECTURE.md.
export default function MarginTradingPage() {
  return <TradeTerminal product="margin" maxLeverage={5} />;
}
