'use client';

import Link from 'next/link';
import { FaArrowDown, FaArrowUp, FaChartLine, FaSeedling, FaGift } from 'react-icons/fa';

interface ActionItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}

const ACTIONS: ActionItem[] = [
  {
    label: 'Deposit',
    href: '/addFunds',
    icon: <FaArrowDown size={14} />,
    gradient: 'linear-gradient(135deg, #00FFA3 0%, #00D68F 100%)',
    glow: 'rgba(0, 255, 163, 0.30)',
  },
  {
    label: 'Withdraw',
    href: '/withdrawal',
    icon: <FaArrowUp size={14} />,
    gradient: 'linear-gradient(135deg, #FF4D4D 0%, #FF1A1A 100%)',
    glow: 'rgba(255, 77, 77, 0.30)',
  },
  {
    label: 'Trade',
    href: '/investmentPlans',
    icon: <FaChartLine size={14} />,
    gradient: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
    glow: 'rgba(168, 85, 247, 0.30)',
  },
  {
    label: 'Stake',
    href: '/stake',
    icon: <FaSeedling size={14} />,
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
    glow: 'rgba(6, 182, 212, 0.30)',
  },
  {
    label: 'Claim AirDrop',
    href: '/airdrops',
    icon: <FaGift size={14} />,
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    glow: 'rgba(255, 215, 0, 0.30)',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(145deg, #0f1115, #1a1d24)',
            boxShadow: '6px 6px 14px #0a0c10, -6px -6px 14px rgba(36, 40, 48, 0.55)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `8px 8px 18px #0a0c10, -8px -8px 18px rgba(36, 40, 48, 0.65), 0 0 24px ${action.glow}`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '6px 6px 14px #0a0c10, -6px -6px 14px rgba(36, 40, 48, 0.55)';
          }}
        >
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
            style={{
              background: action.gradient,
              boxShadow: `0 4px 14px -2px ${action.glow}`,
            }}
          >
            {action.icon}
          </span>
          <span
            className="text-[12px] font-medium uppercase truncate"
            style={{ color: '#F8FAFC', letterSpacing: '0.12em' }}
          >
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
