'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaSatelliteDish,
  FaShieldAlt,
  FaServer,
  FaChartLine,
  FaCertificate,
  FaSearchLocation,
} from 'react-icons/fa';

export default function DataOraclesPage() {
  return (
    <SectionPreview
      kicker="Data · Oracles & Index Services"
      title="Verifiable data,"
      titleAccent="economically secured."
      description="ATSO — Kandella's decentralized oracle network — powers every price feed, index, and reference rate on the platform. Glance at consensus, security, and freshness without leaving the dashboard."
      gradient="linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)"
      accent="#06B6D4"
      status="Live · 98+ providers"
      metrics={[
        { label: 'Active providers', value: '98+', sub: 'Across ATSO network' },
        { label: 'Economic security', value: '$75M+', sub: 'ATM staked behind feeds' },
        { label: 'Update cadence', value: '~1.8s', sub: 'Median across pairs' },
        { label: 'Index reference', value: '60+', sub: 'Pairs with index rate' },
      ]}
      features={[
        {
          icon: <FaSatelliteDish size={14} />,
          title: 'Live oracle status',
          description:
            'See provider count, consensus confidence, and last-update timestamp for every price feed on the platform.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: 'Economic security',
          description:
            'Each feed displays the total ATM staked by providers backing it. Larger stake = harder to corrupt.',
        },
        {
          icon: <FaServer size={14} />,
          title: 'Provider transparency',
          description:
            'Click any feed to see the full provider list, their stakes, and their historical accuracy scores.',
        },
        {
          icon: <FaChartLine size={14} />,
          title: 'Index rate overlay',
          description:
            'Toggle a dashed reference line on any chart showing the ATSO median index rate, separate from the venue mark price.',
        },
        {
          icon: <FaCertificate size={14} />,
          title: 'Proof of Reserves',
          description:
            'Cryptographic Merkle proof that platform balances are 1:1 backed. Verify your inclusion with one click.',
        },
        {
          icon: <FaSearchLocation size={14} />,
          title: 'Anomaly alerts',
          description:
            'Provider consensus < 50% or stale data > 5s triggers an amber warning across affected trading screens.',
        },
      ]}
      bullets={[
        'Glassmorphic ATSO badge in the upper-right of any trading screen',
        'Median update timestamp + 95% confidence band',
        'Per-pair provider breakdown and historical accuracy',
        'Merkle proof verifier for Proof of Reserves',
        'Stale-data warning when consensus or freshness fails',
      ]}
      ctas={[
        { label: 'Verify Proof of Reserves', href: '/screens/Kandella/PriceFeeds', variant: 'primary' },
        { label: 'Read the Oracle Docs', href: '/screens/Kandella/PriceFeeds', variant: 'ghost' },
      ]}
    />
  );
}
