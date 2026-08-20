'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaShieldAlt,
  FaUserShield,
  FaUsers,
  FaList,
  FaCheckSquare,
  FaBalanceScale,
} from 'react-icons/fa';

export default function CustodyPage() {
  return (
    <SectionPreview
      kicker="Custody · Institutional Vaults"
      title="Treasury custody,"
      titleAccent="policy-enforced."
      description="Multi-sig institutional vaults with role-based access, programmable withdrawal policies, and full audit trails. Designed for organizations holding meaningful balances on Kandella."
      gradient="linear-gradient(135deg, #C0C8D5 0%, #6366F1 100%)"
      accent="#A855F7"
      status="Institutional gate · Apply"
      metrics={[
        { label: 'Vault types', value: '4', sub: 'Standard, segregated, cold, OTC' },
        { label: 'Roles', value: '3', sub: 'Admin · Trader · Auditor' },
        { label: 'Quorum policies', value: 'M-of-N', sub: 'Configurable per vault' },
        { label: 'Whitelist depth', value: 'Unlimited', sub: 'Address allow-list' },
      ]}
      features={[
        {
          icon: <FaUserShield size={14} />,
          title: 'Role-based access',
          description:
            'Admins set policies and approve withdrawals. Traders execute orders within limits. Auditors hold read-only access to all vaults and history.',
        },
        {
          icon: <FaUsers size={14} />,
          title: 'M-of-N approval quorums',
          description:
            'Configure approval thresholds per vault. Pending withdrawals show avatars of remaining approvers and signature status.',
        },
        {
          icon: <FaList size={14} />,
          title: 'Withdrawal whitelist',
          description:
            'All outbound transfers must go to pre-approved addresses. New address adds require admin approval and a 24h cooling period.',
        },
        {
          icon: <FaCheckSquare size={14} />,
          title: 'Pending approvals queue',
          description:
            'A live queue of in-flight transactions awaiting signatures. Approvers can review and sign with one click and 2FA.',
        },
        {
          icon: <FaBalanceScale size={14} />,
          title: 'Daily limits & cooldowns',
          description:
            'Per-role daily withdrawal caps, large-withdrawal cooldowns (24h cancel window above $10k), and emergency lockdown switch.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: 'OTC integration',
          description:
            'Direct routing from vault balances into the Kandella OTC desk — execute block trades without first moving funds to a hot wallet.',
        },
      ]}
      bullets={[
        'Vault selector with organizational role badges',
        'Policy dashboard: quorum, daily limits, whitelisted addresses',
        'Pending Approvals queue with per-approver status dots',
        'Direct OTC routing from vault balance',
        'Full audit trail exportable as CSV / JSON',
      ]}
      ctas={[
        { label: 'Request Institutional Access', href: '/support', variant: 'primary' },
        { label: 'Speak with the Desk', href: '/support', variant: 'ghost' },
      ]}
    />
  );
}
