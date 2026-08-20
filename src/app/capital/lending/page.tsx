'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaLandmark,
  FaPercent,
  FaShieldAlt,
  FaBalanceScale,
  FaExclamationTriangle,
  FaSyncAlt,
} from 'react-icons/fa';

export default function CapitalLendingPage() {
  return (
    <SectionPreview
      kicker="Capital Desk · Lending"
      title="Borrow against"
      titleAccent="what you hold."
      description="High-net-worth lending against eligible collateral. Transparent LTV, real-time margin-call thresholds, and fixed-rate or floating-rate terms structured by the Kandella credit desk."
      gradient="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
      accent="#FFD700"
      status="By application · ≥ $500k"
      metrics={[
        { label: 'Min loan', value: '$500k', sub: 'Eligible accounts' },
        { label: 'Max LTV', value: '70%', sub: 'Tier-1 collateral' },
        { label: 'Margin call', value: '85% LTV', sub: 'Top-up window 24h' },
        { label: 'Liquidation', value: '95% LTV', sub: 'Programmatic enforcement' },
      ]}
      features={[
        {
          icon: <FaLandmark size={14} />,
          title: 'Flexible collateral',
          description:
            'BTC, ETH, USDC, USDT, SOL, XRP — and select Kandella Bond positions. LTV tiers per asset.',
        },
        {
          icon: <FaPercent size={14} />,
          title: 'Fixed or floating',
          description:
            'Choose a fixed-term loan (30, 60, 90 days) or a floating-rate facility indexed to ATSO oracle benchmarks.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: 'Segregated collateral',
          description:
            'Pledged assets remain in regulated cold storage. No rehypothecation without explicit written consent.',
        },
        {
          icon: <FaBalanceScale size={14} />,
          title: 'Live LTV monitor',
          description:
            'Real-time loan-to-value ratio with traffic-light status. Automated alerts at 70%, 80%, and 85%.',
        },
        {
          icon: <FaExclamationTriangle size={14} />,
          title: 'Margin-call workflow',
          description:
            'When LTV exceeds 85%, a 24-hour top-up window opens. Add collateral or repay principal to restore safety.',
        },
        {
          icon: <FaSyncAlt size={14} />,
          title: 'Repay any time',
          description:
            'Partial or full repayment with no penalty on floating-rate facilities. Fixed-term loans accept early repayment with pro-rata interest.',
        },
      ]}
      bullets={[
        'Outstanding balance, accrued interest, and next payment date',
        'Per-loan collateral composition and LTV traffic light',
        'Margin-call countdown banner at LTV ≥ 85%',
        'Inline repayment and top-up actions',
        'Loan history with full payment ledger',
      ]}
      ctas={[
        { label: 'Apply for a Facility', href: '/support', variant: 'primary' },
        { label: 'Speak with the Desk', href: '/capital/chat', variant: 'ghost' },
      ]}
    />
  );
}
