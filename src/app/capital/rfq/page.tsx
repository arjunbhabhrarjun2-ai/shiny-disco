'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaExchangeAlt,
  FaClock,
  FaShieldAlt,
  FaUserShield,
  FaCheckCircle,
  FaRobot,
} from 'react-icons/fa';

export default function CapitalRFQPage() {
  return (
    <SectionPreview
      kicker="Capital Desk · RFQ Portal"
      title="Request a quote,"
      titleAccent="trade with size."
      description="A self-service quote request portal for institutional and high-net-worth allocators. Get a live executable quote in seconds and choose your settlement window."
      gradient="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
      accent="#FFD700"
      status="Live · 24/7"
      metrics={[
        { label: 'Min ticket', value: '$500k', sub: 'Eligible accounts' },
        { label: 'Quote validity', value: '15s', sub: 'Live executable' },
        { label: 'Settlement', value: 'T+0 / T+1 / T+2', sub: 'Configurable' },
        { label: 'Median fill', value: '< 90s', sub: 'From request to execute' },
      ]}
      features={[
        {
          icon: <FaExchangeAlt size={14} />,
          title: 'Asset, amount, direction',
          description:
            'A simple three-field form. Get a real quote — not an indication — that you can execute on with one click.',
        },
        {
          icon: <FaClock size={14} />,
          title: '15-second countdown',
          description:
            'Quote cards display a live countdown. Past the timer, request a fresh quote — no stale prices.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: 'Settlement options',
          description:
            'T+0 same-day, T+1 next business, or T+2 standard. Match counterparty preferences without compromising fill quality.',
        },
        {
          icon: <FaUserShield size={14} />,
          title: 'Sanctions screening',
          description:
            'Every quote is pre-screened against jurisdictional restrictions. Execution is blocked if compliance fails.',
        },
        {
          icon: <FaCheckCircle size={14} />,
          title: 'One-click execute',
          description:
            'Accept the quote with a single tap. Trade confirmation, fee summary, and tx receipt land in your inbox immediately.',
        },
        {
          icon: <FaRobot size={14} />,
          title: 'Algorithmic backstop',
          description:
            'Automated pricing engine quotes within tight spreads. Manual desk steps in for exotic pairs or large notional.',
        },
      ]}
      bullets={[
        'Asset selector covering 60+ pairs and exotic instruments',
        'Live countdown timer on every quote',
        'Settlement preference toggle (T+0 / T+1 / T+2)',
        'Accept / reject buttons with disable-on-expire',
        'Post-execution receipt with transparent fee breakdown',
      ]}
      ctas={[
        { label: 'Request a Quote', href: '/support', variant: 'primary' },
        { label: 'Open Chat Trading', href: '/capital/chat', variant: 'ghost' },
      ]}
    />
  );
}
