import TradeTerminal from '@/components/trade/TradeTerminal';

export const metadata = {
  title: 'Spot Trading — Kandella',
};

export default function SpotTradePage() {
  return <TradeTerminal product="spot" maxLeverage={1} />;
}
