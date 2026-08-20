'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaProjectDiagram,
  FaShieldAlt,
  FaChartPie,
  FaHandHoldingUsd,
  FaSync,
  FaExclamationTriangle,
} from 'react-icons/fa';

export default function DeFiPositionsPage() {
  return (
    <SectionPreview
      kicker="Wallet · DeFi Positions"
      title="DeFi positions,"
      titleAccent="monitored together."
      description="A single panel for SparkDex, Kinetic, Enosys, and any EVM-compatible DeFi protocol you have positions in. Track LPs, borrowed assets, and health factors without leaving the dashboard."
      gradient="linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)"
      accent="#06B6D4"
      status="In preview · DeFi linking"
      metrics={[
        { label: 'Protocols', value: '12+', sub: 'EVM-compatible integrations' },
        { label: 'Health factor', value: 'Live', sub: 'Refresh every 15s' },
        { label: 'TVL tracked', value: '$2.1B+', sub: 'Across user wallets' },
        { label: 'Safety alerts', value: 'On', sub: 'Threshold 1.10' },
      ]}
      features={[
        {
          icon: <FaProjectDiagram size={14} />,
          title: 'Per-protocol cards',
          description:
            'Collapsible rows for each protocol — LP positions, supplied & borrowed assets, accrued fees, claim CTAs.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: 'Health factor monitor',
          description:
            'Liquidation risk visualized as a gradient progress bar. Banner appears when any position drops below 1.1.',
        },
        {
          icon: <FaChartPie size={14} />,
          title: 'Concentration view',
          description:
            'Donut chart segments your DeFi exposure by chain, protocol, and asset type. Hover for breakdowns.',
        },
        {
          icon: <FaHandHoldingUsd size={14} />,
          title: 'Inline claim & manage',
          description:
            'Claim accrued rewards, repay debt, and add collateral directly from each card with one signed transaction.',
        },
        {
          icon: <FaSync size={14} />,
          title: 'Auto-refresh',
          description:
            'Positions sync every 15 seconds via on-chain RPC. Manual refresh available with a 1-tap button.',
        },
        {
          icon: <FaExclamationTriangle size={14} />,
          title: 'Risk surfacing',
          description:
            'Smart-contract risk badges based on audit history, oracle dependencies, and TVL freshness.',
        },
      ]}
      bullets={[
        'Wallet selector tabs (Kandella · Imported · Hardware)',
        'Asset list with Send / Receive / Swap / Bridge actions per row',
        'Network mismatch warning when wallet is on the wrong chain',
        'Per-protocol health factor with red banner below 1.1',
        'Cross-chain holdings unified into one USD column',
      ]}
      ctas={[
        { label: 'Connect a Wallet', href: '/portfolio', variant: 'primary' },
        { label: 'Bridge to Kandella', href: '/wallet/bridge', variant: 'ghost' },
      ]}
    />
  );
}
