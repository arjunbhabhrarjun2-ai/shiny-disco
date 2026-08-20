'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import { FaExchangeAlt, FaCommentDots, FaLandmark } from 'react-icons/fa';

export default function CapitalDeskHubPage() {
  return (
    <SectionPreview
      kicker="Capital Desk · Hub"
      title="Block-size execution,"
      titleAccent="relationship-based."
      description="Three high-touch surfaces for size that does not fit a public order book — and lending against assets you already hold."
      gradient="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
      accent="#FFD700"
      status="Desk Open"
      features={[
        {
          icon: <FaExchangeAlt size={14} />,
          title: 'RFQ Portal',
          description:
            'Self-service quote requests. Live executable quote with 15-second validity and configurable settlement.',
        },
        {
          icon: <FaCommentDots size={14} />,
          title: 'Chat Trading',
          description:
            'Direct messaging with the Kandella desk. Order cards inside chat populate the RFQ flow when clicked.',
        },
        {
          icon: <FaLandmark size={14} />,
          title: 'Lending',
          description:
            'Borrow against eligible collateral above $500k with transparent LTV, interest, and margin-call thresholds.',
        },
      ]}
      ctas={[
        { label: 'RFQ Portal', href: '/capital/rfq', variant: 'primary' },
        { label: 'Chat Trading', href: '/capital/chat', variant: 'ghost' },
        { label: 'Lending', href: '/capital/lending', variant: 'ghost' },
      ]}
    />
  );
}
