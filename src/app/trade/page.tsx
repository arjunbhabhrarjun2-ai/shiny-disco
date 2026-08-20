'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaBolt,
  FaFire,
  FaProjectDiagram,
  FaExchangeAlt,
} from 'react-icons/fa';

export default function TradeHubPage() {
  return (
    <SectionPreview
      kicker="Trade · Hub"
      title="Choose your"
      titleAccent="execution venue."
      description="Kandella offers four distinct execution surfaces, each optimized for a different size, horizon, and risk profile."
      gradient="linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)"
      accent="#A855F7"
      status="Live"
      features={[
        {
          icon: <FaBolt size={14} />,
          title: 'Spot',
          description:
            '60+ pairs · 0.01–0.04% fees · click-to-trade L2 order book · maker/taker pricing.',
        },
        {
          icon: <FaFire size={14} />,
          title: 'Margin',
          description:
            'Up to 5x leverage · cross or isolated · 30+ collateral assets · liquidation insurance.',
        },
        {
          icon: <FaProjectDiagram size={14} />,
          title: 'Futures',
          description:
            'Up to 50x leverage · perpetual + CME · funding-rate ticker · API trading with kill switch.',
        },
        {
          icon: <FaExchangeAlt size={14} />,
          title: 'OTC',
          description:
            'Block-size liquidity · 15s executable quotes · chat trading · dedicated relationship coverage.',
        },
      ]}
      ctas={[
        { label: 'Spot', href: '/trade/spot', variant: 'primary' },
        { label: 'Margin', href: '/trade/margin', variant: 'ghost' },
        { label: 'Futures', href: '/trade/futures', variant: 'ghost' },
        { label: 'OTC', href: '/trade/otc', variant: 'ghost' },
      ]}
    />
  );
}
