'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useCurrency } from '@/components/context/CurrencyContext';
import {
  FaWallet,
  FaHistory,
  FaPlusCircle,
  FaMoneyBillWave,
  FaListAlt,
  FaPaperPlane,
  FaUserFriends,
  FaCopy,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaHeadset,
  FaEllipsisH,
  FaSeedling,
  FaGift,
  FaThLarge,
  FaChartLine,
  FaBolt,
  FaFire,
  FaExchangeAlt,
  FaProjectDiagram,
  FaLink,
  FaShieldAlt,
  FaBriefcase,
  FaCommentDots,
  FaLandmark,
  FaSatelliteDish,
  FaCog,
} from 'react-icons/fa';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';

const C = {
  bgBase: '#0B0D10',
  bgElevated: '#14161B',
  border: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(255,255,255,0.12)',
  textPri: '#F8FAFC',
  textSec: '#94A3B8',
  textTer: '#64748B',
  primary: '#6366F1',
  pink: '#EC4899',
  purple: '#A855F7',
  cyan: '#06B6D4',
  green: '#00FFA3',
  red: '#FF4D4D',
  gold: '#FFD700',
};

const GRAD_PRIMARY =
  'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)';
const GRAD_SUCCESS = 'linear-gradient(90deg, #00FFA3, #00D68F)';
const GRAD_DANGER = 'linear-gradient(90deg, #FF4D4D, #FF1A1A)';
const GRAD_GOLD = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
const GRAD_CYAN = 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)';

interface NavLink {
  icon: React.ReactNode;
  label: string;
  path: string;
  accent: string;
  badge?: { label: string; color: string; bg: string };
}

interface NavGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  items: NavLink[];
}

export default function Sidebar() {
  const { user, refreshUser, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { dashboard, isLoading } = useDashboard(user?.email || null);

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [refLink, setRefLink] = useState<string>('');
  // Global display currency (live FX conversion) — shared across the app.
  const { currency: selectedCurrency, setCurrency: setSelectedCurrency, convert: convertCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    trade: false,
    earn: false,
    wallet: false,
    capital: false,
    activity: false,
    account: false,
  });

  useEffect(() => {
    document.body.style.overflow = mobileMoreOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMoreOpen]);

  useEffect(() => {
    if (user?.id && !user.referralCode) {
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (user?.referralCode) {
      const link = `https://kandella.net/signup?ref=${encodeURIComponent(user.referralCode)}`;
      setRefLink(link);
    } else if (user?.email) {
      fetchReferralCodeDirectly();
    } else {
      setRefLink('');
    }
  }, [user?.referralCode, user?.email]);

  // Auto-open the group that contains the active route
  useEffect(() => {
    if (!pathname) return;
    setOpenGroups((prev) => {
      const next = { ...prev };
      if (pathname.startsWith('/trade')) next.trade = true;
      if (pathname === '/stake' || pathname === '/airdrops') next.earn = true;
      if (pathname.startsWith('/wallet') || pathname === '/portfolio') next.wallet = true;
      if (pathname.startsWith('/capital')) next.capital = true;
      if (
        pathname === '/transaction' ||
        pathname === '/addFunds' ||
        pathname === '/depositHistory' ||
        pathname === '/withdrawal' ||
        pathname === '/withdrawalHistory'
      )
        next.activity = true;
      if (pathname === '/support' || pathname === 'referral') next.account = true;
      return next;
    });
  }, [pathname]);

  const fetchReferralCodeDirectly = async () => {
    try {
      if (!user?.id) return null;
      const response = await fetch(`/api/user/referral?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.referralCode) {
          const newLink = `https://kandella.net/signup?ref=${encodeURIComponent(data.referralCode)}`;
          setRefLink(newLink);
          if (setUser) {
            setUser((prev) =>
              prev ? { ...prev, referralCode: data.referralCode } : prev
            );
          }
          const currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.referralCode = data.referralCode;
            localStorage.setItem('currentUser', JSON.stringify(userData));
          }
          return data.referralCode;
        }
      }
    } catch (error) {
      console.error('Error fetching referral code:', error);
    }
    return null;
  };

  const copyReferralLink = async (link: string) => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('copyReferralLink error:', err);
    }
  };

  const currencySymbolMap: Record<'USD' | 'EUR' | 'GBP', string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const formatMoney = (val: any) =>
    typeof val === 'number' && !isNaN(val)
      ? val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '0.00';

  // Top-level standalone items (above groups).
  // Trade / Earn / Wallet are now single destinations — the old grouped
  // sub-items (Spot, Margin, Futures, OTC, Staking, AirDrops, Portfolio,
  // DeFi, Bridge, RFQ, Chat, Lending, Bonds, Custody, Data) were removed.
  const primaryNav: NavLink[] = [
    { icon: <FaThLarge size={12} />, label: 'Dashboard', path: '/dashboard', accent: GRAD_PRIMARY },
    { icon: <FaChartLine size={12} />, label: 'Trade', path: '/trade/spot', accent: GRAD_PRIMARY },
    { icon: <FaSeedling size={12} />, label: 'Earn', path: '/stake', accent: GRAD_CYAN },
    { icon: <FaWallet size={12} />, label: 'Wallet', path: '/portfolio', accent: GRAD_PRIMARY },
    { icon: <FaListAlt size={12} />, label: 'Orders', path: '/transaction', accent: GRAD_PRIMARY },
    // Referral opens a modal (handled in NavItem by checking path === 'referral')
    { icon: <FaUserFriends size={12} />, label: 'Referral', path: 'referral', accent: GRAD_PRIMARY },
    { icon: <FaHeadset size={12} />, label: 'Support', path: '/support', accent: GRAD_PRIMARY },
  ];

  // Grouped nav per spec section 2.1
  const groups: NavGroup[] = [
    {
      key: 'trade',
      label: 'Trade',
      icon: <FaChartLine size={11} />,
      accent: GRAD_PRIMARY,
      items: [
        { icon: <FaBolt size={11} />, label: 'Spot', path: '/trade/spot', accent: GRAD_PRIMARY },
        { icon: <FaFire size={11} />, label: 'Margin', path: '/trade/margin', accent: GRAD_PRIMARY },
        {
          icon: <FaProjectDiagram size={11} />,
          label: 'Futures',
          path: '/trade/futures',
          accent: GRAD_PRIMARY,
        },
        {
          icon: <FaExchangeAlt size={11} />,
          label: 'OTC Desk',
          path: '/trade/otc',
          accent: GRAD_PRIMARY,
        },
      ],
    },
    {
      key: 'earn',
      label: 'Earn',
      icon: <FaSeedling size={11} />,
      accent: GRAD_CYAN,
      items: [
        { icon: <FaSeedling size={11} />, label: 'Staking', path: '/stake', accent: GRAD_CYAN },
        {
          icon: <FaGift size={11} />,
          label: 'AirDrops',
          path: '/airdrops',
          accent: GRAD_GOLD,
        },
      ],
    },
    {
      key: 'wallet',
      label: 'Wallet',
      icon: <FaWallet size={11} />,
      accent: GRAD_PRIMARY,
      items: [
        {
          icon: <FaWallet size={11} />,
          label: 'Portfolio',
          path: '/portfolio',
          accent: GRAD_PRIMARY,
        },
        {
          icon: <FaProjectDiagram size={11} />,
          label: 'DeFi Positions',
          path: '/wallet/defi',
          accent: GRAD_PRIMARY,
        },
        {
          icon: <FaLink size={11} />,
          label: 'Bridge (ATAssets)',
          path: '/wallet/bridge',
          accent: GRAD_CYAN,
        },
      ],
    },
    {
      key: 'capital',
      label: 'Capital Desk',
      icon: <FaBriefcase size={11} />,
      accent: GRAD_GOLD,
      items: [
        {
          icon: <FaExchangeAlt size={11} />,
          label: 'RFQ Portal',
          path: '/capital/rfq',
          accent: GRAD_GOLD,
        },
        {
          icon: <FaCommentDots size={11} />,
          label: 'Chat Trading',
          path: '/capital/chat',
          accent: GRAD_PRIMARY,
        },
        {
          icon: <FaLandmark size={11} />,
          label: 'Lending',
          path: '/capital/lending',
          accent: GRAD_GOLD,
        },
      ],
    },
    {
      key: 'activity',
      label: 'Activity',
      icon: <FaListAlt size={11} />,
      accent: GRAD_PRIMARY,
      items: [
        {
          icon: <FaListAlt size={11} />,
          label: 'Transactions',
          path: '/transaction',
          accent: GRAD_PRIMARY,
        },
        {
          icon: <FaPlusCircle size={11} />,
          label: 'Add Funds',
          path: '/addFunds',
          accent: GRAD_SUCCESS,
        },
        {
          icon: <FaPaperPlane size={11} />,
          label: 'Withdraw',
          path: '/withdrawal',
          accent: GRAD_DANGER,
        },
      ],
    },
    {
      key: 'account',
      label: 'Account',
      icon: <FaUserFriends size={11} />,
      accent: GRAD_PRIMARY,
      items: [
        {
          icon: <FaUserFriends size={11} />,
          label: 'Referral',
          path: 'referral',
          accent: GRAD_PRIMARY,
        },
        {
          icon: <FaHeadset size={11} />,
          label: 'Support',
          path: '/support',
          accent: GRAD_PRIMARY,
        },
      ],
    },
  ];

  // Standalone items between groups
  const bondsItem: NavLink = {
    icon: <FaMoneyBillWave size={12} />,
    label: 'Bonds',
    path: '/investmentPlans',
    accent: GRAD_GOLD,
  };

  const custodyItem: NavLink = {
    icon: <FaShieldAlt size={12} />,
    label: 'Custody',
    path: '/custody',
    accent: 'linear-gradient(135deg, #C0C8D5 0%, #6366F1 100%)',
    badge: {
      label: 'Inst.',
      color: '#A855F7',
      bg: 'rgba(168,85,247,0.10)',
    },
  };

  const dataItem: NavLink = {
    icon: <FaSatelliteDish size={12} />,
    label: 'Data & Oracles',
    path: '/data',
    accent: GRAD_CYAN,
  };

  const NavItem = ({ item }: { item: NavLink }) => {
    const isActive = pathname === item.path;
    return (
      <div
        onClick={() =>
          item.path === 'referral' ? setShowReferralModal(true) : router.push(item.path)
        }
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200"
        style={{
          background: isActive
            ? 'linear-gradient(90deg, rgba(99,102,241,0.10) 0%, rgba(168,85,247,0.04) 100%)'
            : 'transparent',
          color: isActive ? C.textPri : C.textSec,
          border: isActive
            ? '1px solid rgba(168, 85, 247, 0.22)'
            : '1px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)';
            (e.currentTarget as HTMLDivElement).style.color = C.textPri;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            (e.currentTarget as HTMLDivElement).style.color = C.textSec;
          }
        }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-bar"
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
            style={{
              background: item.accent,
              boxShadow: '0 0 12px rgba(168,85,247,0.5)',
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <span
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{
            background: isActive ? item.accent : 'rgba(255,255,255,0.03)',
            color: isActive ? '#0B0D10' : C.textSec,
            border: isActive ? 'none' : '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span
              className="text-[12.5px] flex-1 truncate"
              style={{
                letterSpacing: '0.01em',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                className="text-[8px] uppercase font-medium px-1.5 py-0.5 rounded-full shrink-0"
                style={{
                  background: item.badge.bg,
                  color: item.badge.color,
                  border: `1px solid ${item.badge.color}38`,
                  letterSpacing: '0.18em',
                }}
              >
                {item.badge.label}
              </span>
            )}
          </>
        )}
      </div>
    );
  };

  const NavGroupItem = ({ group }: { group: NavGroup }) => {
    const isOpen = !!openGroups[group.key];
    const hasActiveChild = group.items.some((it) => pathname === it.path);

    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() =>
            setOpenGroups((prev) => ({ ...prev, [group.key]: !prev[group.key] }))
          }
          className="w-full relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
          style={{
            background: hasActiveChild
              ? 'rgba(255,255,255,0.025)'
              : 'transparent',
            color: hasActiveChild ? C.textPri : C.textSec,
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            if (!hasActiveChild) {
              (e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.02)';
              (e.currentTarget as HTMLButtonElement).style.color = C.textPri;
            }
          }}
          onMouseLeave={(e) => {
            if (!hasActiveChild) {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = C.textSec;
            }
          }}
        >
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{
              background: hasActiveChild ? group.accent : 'rgba(255,255,255,0.03)',
              color: hasActiveChild ? '#0B0D10' : C.textSec,
              border: hasActiveChild ? 'none' : '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {group.icon}
          </span>
          {!collapsed && (
            <>
              <span
                className="text-[12.5px] flex-1 text-left"
                style={{
                  letterSpacing: '0.01em',
                  fontWeight: hasActiveChild ? 500 : 400,
                }}
              >
                {group.label}
              </span>
              <FaChevronDown
                size={9}
                style={{
                  color: C.textTer,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                className="ml-3 pl-3 space-y-0.5 mt-1"
                style={{ borderLeft: `1px solid ${C.border}` }}
              >
                {group.items.map((item, i) => (
                  <NavItem key={i} item={item} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div style={{ background: C.bgBase }}>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside
        className={`hidden md:flex fixed md:static top-0 left-0 z-40 flex-col justify-between h-screen transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0B0D10 0%, #08090C 100%)',
          borderRight: `1px solid ${C.border}`,
        }}
      >
        <div className="flex-1 overflow-y-auto custom-scroll">
          {/* Brand + collapse */}
          <div className="flex justify-between items-center px-4 pt-5 pb-3">
            {!collapsed && (
              <div className="flex items-center">
                <Logo size={30} wordmarkSize="1.1rem" />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md transition-all duration-200"
              style={{
                color: C.textSec,
                border: `1px solid ${C.border}`,
                background: 'rgba(255,255,255,0.02)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = C.textPri;
                (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderAccent;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = C.textSec;
                (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
              }}
            >
              {collapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
            </button>
          </div>

          {/* Glassmorphic balance card */}
          {!collapsed && (
            <div
              className="mx-3 mb-5 p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[9px] uppercase font-medium"
                    style={{ color: C.textSec, letterSpacing: '0.24em' }}
                  >
                    Account
                  </span>
                  <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push('/settings')}
                    title="Settings"
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderAccent}`, color: C.textSec }}
                  >
                    <FaCog size={10} />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCurrencyOpen((prev) => !prev)}
                      className="text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        background: 'rgba(0,255,163,0.06)',
                        border: '1px solid rgba(0,255,163,0.18)',
                        color: C.green,
                        letterSpacing: '0.18em',
                      }}
                    >
                      {selectedCurrency}
                      <FaChevronDown
                        size={8}
                        style={{
                          transform: currencyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </button>
                    {currencyOpen && (
                      <div
                        className="absolute right-0 mt-1 rounded-lg overflow-hidden z-30"
                        style={{
                          background: C.bgElevated,
                          border: `1px solid ${C.borderAccent}`,
                          minWidth: 70,
                        }}
                      >
                        {(['USD', 'EUR', 'GBP'] as const).map((currency) => (
                          <button
                            key={currency}
                            type="button"
                            onClick={() => {
                              setSelectedCurrency(currency);
                              setCurrencyOpen(false);
                            }}
                            className="w-full text-left px-2 py-1.5 text-[10px] uppercase transition-colors"
                            style={{
                              color: selectedCurrency === currency ? C.textPri : C.textSec,
                              background:
                                selectedCurrency === currency
                                  ? 'rgba(99,102,241,0.12)'
                                  : 'transparent',
                              letterSpacing: '0.12em',
                            }}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                </div>

                {isLoading ? (
                  <p className="text-xs" style={{ color: C.textSec }}>
                    Loading…
                  </p>
                ) : (
                  <>
                    <p
                      className="text-[9px] uppercase mb-1"
                      style={{ color: C.textTer, letterSpacing: '0.2em' }}
                    >
                      Total Balance
                    </p>
                    <p
                      className="font-serif-display tabular-nums mb-3"
                      style={{
                        background: GRAD_PRIMARY,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.5rem',
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {currencySymbolMap[selectedCurrency]}
                      {formatMoney(
                        convertCurrency(
                          ((dashboard as any)?.mainBalance || 0) +
                            ((dashboard as any)?.interestBalance || 0)
                        )
                      )}
                    </p>

                    <div
                      className="grid grid-cols-2 gap-2 mt-3 pt-3"
                      style={{ borderTop: `1px solid ${C.border}` }}
                    >
                      {[
                        { label: 'Available', key: 'mainBalance' },
                        { label: 'Accrued', key: 'interestBalance' },
                        { label: 'Deposited', key: 'totalDeposit' },
                        { label: 'Earned', key: 'totalEarn' },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <p
                            className="text-[8px] uppercase mb-0.5"
                            style={{ color: C.textTer, letterSpacing: '0.18em' }}
                          >
                            {label}
                          </p>
                          <p
                            className="tabular-nums"
                            style={{
                              color: C.textPri,
                              fontSize: 11,
                              fontFamily: 'var(--font-jetbrains-mono, monospace)',
                            }}
                          >
                            {currencySymbolMap[selectedCurrency]}
                            {formatMoney(convertCurrency((dashboard as any)?.[key] || 0))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push('/addFunds')}
                    className="flex-1 py-2 rounded-lg text-[10px] uppercase font-medium transition-all duration-200"
                    style={{
                      background: GRAD_PRIMARY,
                      color: C.textPri,
                      letterSpacing: '0.16em',
                      boxShadow: '0 4px 14px -2px rgba(168,85,247,0.4)',
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => router.push('/investmentPlans')}
                    className="flex-1 py-2 rounded-lg text-[10px] uppercase font-medium transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      color: C.textPri,
                      border: `1px solid ${C.borderAccent}`,
                      letterSpacing: '0.16em',
                    }}
                  >
                    Invest
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="px-2 space-y-0.5 pb-4">
            {!collapsed && (
              <p
                className="text-[9px] uppercase px-3 pt-2 pb-1.5 font-medium"
                style={{ color: C.textTer, letterSpacing: '0.26em' }}
              >
                Overview
              </p>
            )}
            {primaryNav.map((item, idx) => (
              <NavItem key={idx} item={item} />
            ))}
          </nav>
        </div>

      </aside>

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <nav
        id="mobile-tabbar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-1"
        style={{
          background: 'rgba(11, 13, 16, 0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: `1px solid ${C.border}`,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.45)',
          paddingTop: '0.5rem',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        {[
          { icon: <FaThLarge size={12} />, label: 'Home', path: '/dashboard', accent: GRAD_PRIMARY },
          { icon: <FaChartLine size={12} />, label: 'Trade', path: '/trade/spot', accent: GRAD_PRIMARY },
          { icon: <FaSeedling size={12} />, label: 'Earn', path: '/stake', accent: GRAD_CYAN },
          { icon: <FaWallet size={12} />, label: 'Wallet', path: '/portfolio', accent: GRAD_PRIMARY },
        ].map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all flex-1 min-w-0 relative"
              style={{ color: isActive ? C.textPri : C.textSec }}
            >
              {isActive && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{
                    background: item.accent,
                    boxShadow: '0 0 10px rgba(168,85,247,0.6)',
                  }}
                />
              )}
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{
                  background: isActive ? item.accent : 'transparent',
                  color: isActive ? '#0B0D10' : C.textSec,
                }}
              >
                {item.icon}
              </span>
              <span
                className="truncate w-full text-center text-[10px] uppercase"
                style={{ letterSpacing: '0.12em' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMoreOpen(true)}
          className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-xs flex-1"
          style={{ color: C.textSec }}
        >
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${C.border}`,
            }}
          >
            <FaEllipsisH size={12} />
          </span>
          <span className="text-[10px] uppercase" style={{ letterSpacing: '0.12em' }}>
            More
          </span>
        </button>
      </nav>

      {/* ─── MOBILE "MORE" BOTTOM SHEET ─── */}
      <AnimatePresence>
        {mobileMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMoreOpen(false)}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl pt-5 px-5 max-h-[85vh] overflow-y-auto"
              style={{
                background:
                  'linear-gradient(180deg, rgba(11,13,16,0.98) 0%, rgba(8,9,12,1) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: `1px solid ${C.borderAccent}`,
                borderBottom: 'none',
                paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
              }}
            >
              <div className="flex justify-center mb-4">
                <span
                  className="w-10 h-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                />
              </div>

              {/* Sheet title + close */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[11px] uppercase font-bold"
                  style={{ color: C.textPri, letterSpacing: '0.24em' }}
                >
                  More
                </span>
                <button
                  onClick={() => setMobileMoreOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    color: C.textSec,
                    border: `1px solid ${C.border}`,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <FaTimes size={11} />
                </button>
              </div>

              {/* Account summary — mirrors the desktop sidebar balance card:
                  Account · Total Balance · Available · Accrued · Deposited ·
                  Earned, with the Settings + currency toggle. */}
              <div
                className="mb-4 p-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] uppercase font-medium"
                      style={{ color: C.textSec, letterSpacing: '0.24em' }}
                    >
                      Account
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMoreOpen(false);
                          router.push('/settings');
                        }}
                        title="Settings"
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderAccent}`, color: C.textSec }}
                      >
                        <FaCog size={11} />
                      </button>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setCurrencyOpen((prev) => !prev)}
                          className="text-[9px] uppercase px-2 py-1 rounded-full flex items-center gap-1"
                          style={{
                            background: 'rgba(0,255,163,0.06)',
                            border: '1px solid rgba(0,255,163,0.18)',
                            color: C.green,
                            letterSpacing: '0.18em',
                          }}
                        >
                          {selectedCurrency}
                          <FaChevronDown
                            size={8}
                            style={{
                              transform: currencyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </button>
                        {currencyOpen && (
                          <div
                            className="absolute right-0 mt-1 rounded-lg overflow-hidden z-30"
                            style={{
                              background: C.bgElevated,
                              border: `1px solid ${C.borderAccent}`,
                              minWidth: 70,
                            }}
                          >
                            {(['USD', 'EUR', 'GBP'] as const).map((currency) => (
                              <button
                                key={currency}
                                type="button"
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setCurrencyOpen(false);
                                }}
                                className="w-full text-left px-2 py-1.5 text-[10px] uppercase transition-colors"
                                style={{
                                  color: selectedCurrency === currency ? C.textPri : C.textSec,
                                  background:
                                    selectedCurrency === currency
                                      ? 'rgba(99,102,241,0.12)'
                                      : 'transparent',
                                  letterSpacing: '0.12em',
                                }}
                              >
                                {currency}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <p className="text-xs" style={{ color: C.textSec }}>
                      Loading…
                    </p>
                  ) : (
                    <>
                      <p
                        className="text-[9px] uppercase mb-1"
                        style={{ color: C.textTer, letterSpacing: '0.2em' }}
                      >
                        Total Balance
                      </p>
                      <p
                        className="font-serif-display tabular-nums mb-3"
                        style={{
                          background: GRAD_PRIMARY,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: '1.5rem',
                          lineHeight: 1.1,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {currencySymbolMap[selectedCurrency]}
                        {formatMoney(
                          convertCurrency(
                            ((dashboard as any)?.mainBalance || 0) +
                              ((dashboard as any)?.interestBalance || 0)
                          )
                        )}
                      </p>

                      <div
                        className="grid grid-cols-2 gap-2 mt-3 pt-3"
                        style={{ borderTop: `1px solid ${C.border}` }}
                      >
                        {[
                          { label: 'Available', key: 'mainBalance' },
                          { label: 'Accrued', key: 'interestBalance' },
                          { label: 'Deposited', key: 'totalDeposit' },
                          { label: 'Earned', key: 'totalEarn' },
                        ].map(({ label, key }) => (
                          <div key={key}>
                            <p
                              className="text-[9px] uppercase mb-0.5"
                              style={{ color: C.textTer, letterSpacing: '0.18em' }}
                            >
                              {label}
                            </p>
                            <p
                              className="tabular-nums"
                              style={{
                                color: C.textPri,
                                fontSize: 12,
                                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                              }}
                            >
                              {currencySymbolMap[selectedCurrency]}
                              {formatMoney(convertCurrency((dashboard as any)?.[key] || 0))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick actions — Deposit / Withdraw always one tap away */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => {
                    router.push('/addFunds');
                    setMobileMoreOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  style={{
                    background: GRAD_PRIMARY,
                    color: C.textPri,
                    boxShadow: '0 4px 14px -2px rgba(168,85,247,0.4)',
                  }}
                >
                  <FaPlusCircle size={13} />
                  Deposit
                </button>
                <button
                  onClick={() => {
                    router.push('/withdrawal');
                    setMobileMoreOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: C.textSec,
                    border: `1px solid ${C.borderAccent}`,
                  }}
                >
                  <FaPaperPlane size={12} />
                  Withdraw
                </button>
              </div>

              <div className="mb-3">
                <span
                  className="text-[10px] uppercase font-medium"
                  style={{ color: C.textSec, letterSpacing: '0.24em' }}
                >
                  All Sections
                </span>
              </div>

              {/* Flat nav grid — matches the desktop sidebar exactly:
                  Dashboard · Trade · Earn · Wallet · Orders · Referral ·
                  Support · Settings. */}
              <div className="grid grid-cols-2 gap-2">
                {primaryNav.map((it) => {
                  const isActive = pathname === it.path;
                  return (
                    <button
                      key={it.label}
                      onClick={() => {
                        if (it.path === 'referral') {
                          setShowReferralModal(true);
                        } else {
                          router.push(it.path);
                        }
                        setMobileMoreOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-3 rounded-lg text-xs transition-all text-left"
                      style={{
                        background: isActive
                          ? 'rgba(168,85,247,0.10)'
                          : 'rgba(255,255,255,0.02)',
                        border: isActive
                          ? '1px solid rgba(168,85,247,0.32)'
                          : `1px solid ${C.border}`,
                        color: isActive ? C.textPri : C.textSec,
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{
                          background: isActive ? it.accent : 'transparent',
                          color: isActive ? '#0B0D10' : C.textSec,
                        }}
                      >
                        {it.icon}
                      </span>
                      <span className="text-[11px] truncate">{it.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── REFERRAL MODAL ─── */}
      <AnimatePresence>
        {showReferralModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden overflow-y-auto relative"
              style={{
                background: 'rgba(20, 22, 27, 0.95)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: `1px solid ${C.borderAccent}`,
                maxHeight: '92vh',
              }}
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                }}
              />

              <div
                className="relative px-7 py-6"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                {/* Web3 referral hero — self-contained inline SVG (3D reward
                    token wired to a glowing referral network). */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 18,
                    marginBottom: 18,
                    padding: 6,
                    overflow: 'hidden',
                    background:
                      'radial-gradient(120% 100% at 50% 0%, rgba(168,85,247,0.16) 0%, rgba(6,182,212,0.08) 45%, rgba(255,255,255,0.02) 100%)',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <svg
                    viewBox="0 0 400 200"
                    width="100%"
                    style={{ display: 'block' }}
                    role="img"
                    aria-label="Refer friends and earn rewards"
                  >
                    <defs>
                      <radialGradient id="rfGlow" cx="50%" cy="42%" r="60%">
                        <stop offset="0%" stopColor="rgba(168,85,247,0.55)" />
                        <stop offset="100%" stopColor="rgba(168,85,247,0)" />
                      </radialGradient>
                      <radialGradient id="rfGlow2" cx="82%" cy="72%" r="55%">
                        <stop offset="0%" stopColor="rgba(6,182,212,0.40)" />
                        <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                      </radialGradient>
                      <radialGradient id="rfCoin" cx="38%" cy="28%" r="80%">
                        <stop offset="0%" stopColor="#FBEFC9" />
                        <stop offset="46%" stopColor="#E6C078" />
                        <stop offset="100%" stopColor="#B8893F" />
                      </radialGradient>
                      <linearGradient id="rfEdge" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A07C3C" />
                        <stop offset="100%" stopColor="#6E5026" />
                      </linearGradient>
                      <linearGradient id="rfRing" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FBEFC9" />
                        <stop offset="100%" stopColor="#C99C53" />
                      </linearGradient>
                      <radialGradient id="rfNode" cx="34%" cy="28%" r="85%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </radialGradient>
                    </defs>

                    {/* ambient glows */}
                    <ellipse cx="200" cy="96" rx="160" ry="92" fill="url(#rfGlow)" />
                    <ellipse cx="306" cy="140" rx="120" ry="74" fill="url(#rfGlow2)" />

                    {/* network connectors */}
                    <g stroke="rgba(212,175,127,0.45)" strokeWidth="1.5" strokeDasharray="2 6" fill="none" strokeLinecap="round">
                      <path d="M200 116 L96 62" />
                      <path d="M200 116 L304 56" />
                      <path d="M200 116 L334 132" />
                    </g>
                    <g fill="#D4AF7F">
                      <circle cx="148" cy="89" r="2" />
                      <circle cx="252" cy="86" r="2" />
                      <circle cx="267" cy="124" r="2" />
                    </g>

                    {/* reward token — hexagonal coin with 3D edge */}
                    <ellipse cx="200" cy="176" rx="46" ry="9" fill="rgba(0,0,0,0.30)" />
                    <path
                      d="M200 79 L241.6 103 L241.6 151 L200 175 L158.4 151 L158.4 103 Z"
                      fill="url(#rfEdge)"
                    />
                    <path
                      d="M200 72 L241.6 96 L241.6 144 L200 168 L158.4 144 L158.4 96 Z"
                      fill="url(#rfCoin)"
                      stroke="url(#rfRing)"
                      strokeWidth="2"
                    />
                    <path
                      d="M200 86 L229.4 103 L229.4 137 L200 154 L170.6 137 L170.6 103 Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1"
                    />
                    <ellipse cx="186" cy="100" rx="20" ry="10" fill="rgba(255,255,255,0.40)" transform="rotate(-24 186 100)" />
                    <text x="200" y="138" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="50" fontWeight="700" fill="#6E5026">$</text>

                    {/* referral avatars */}
                    {[
                      { x: 96, y: 62, ring: '#A855F7' },
                      { x: 304, y: 56, ring: '#06B6D4' },
                      { x: 334, y: 132, ring: '#00C853' },
                    ].map((n) => (
                      <g key={`${n.x}-${n.y}`}>
                        <circle cx={n.x} cy={n.y} r="22" fill="url(#rfNode)" stroke={n.ring} strokeWidth="1.5" />
                        <circle cx={n.x} cy={n.y - 5} r="5.5" fill="rgba(255,255,255,0.92)" />
                        <path d={`M${n.x - 9} ${n.y + 12} a 9 8 0 0 1 18 0 Z`} fill="rgba(255,255,255,0.92)" />
                      </g>
                    ))}

                    {/* sparkles */}
                    <g fill="#FBEFC9">
                      <path d="M250 150 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" opacity="0.9" />
                      <path d="M150 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z" opacity="0.7" />
                    </g>
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-block w-8 h-px"
                    style={{ background: GRAD_PRIMARY }}
                  />
                  <span
                    className="text-[10px] uppercase font-medium"
                    style={{ color: C.purple, letterSpacing: '0.26em' }}
                  >
                    Referral Programme
                  </span>
                </div>
                <h2
                  className="leading-[1.12] font-serif-display"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', color: C.textPri }}
                >
                  Refer Friends. Earn Rewards. Get Up to{' '}
                  <span
                    className="font-serif-italic"
                    style={{
                      background: GRAD_PRIMARY,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    $150!
                  </span>
                </h2>
                <p className="font-serif-italic mt-2" style={{ color: C.purple, fontSize: '0.98rem' }}>
                  Why keep a good thing to yourself?
                </p>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: C.textSec }}>
                  Share your referral link with friends, family, and your network, and get
                  rewarded every time someone joins through your link. It&apos;s simple, fast,
                  and rewarding.
                </p>
              </div>

              <div className="relative px-7 py-6 space-y-6">
                <div>
                  <h3 className="font-serif-display mb-3" style={{ color: C.textPri, fontSize: '1rem' }}>
                    How It Works
                  </h3>
                  <div className="space-y-3">
                    {[
                      ['01', 'Sign up and get your unique referral link'],
                      ['02', 'Share it with others'],
                      ['03', 'Earn rewards when your referrals complete the required actions'],
                    ].map(([n, t]) => (
                      <div key={n} className="flex items-start gap-3">
                        <span
                          className="font-serif-display tabular-nums w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                          style={{ background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.28)', color: C.purple }}
                        >
                          {n}
                        </span>
                        <p className="text-sm" style={{ color: C.textSec, lineHeight: 1.5, paddingTop: 5 }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif-display mb-2" style={{ color: C.textPri, fontSize: '1rem' }}>
                    Earn Up to{' '}
                    <span
                      className="font-serif-italic"
                      style={{ background: GRAD_PRIMARY, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      $150
                    </span>
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>
                    The more people you refer, the more you earn. Every successful referral brings
                    you closer to bigger rewards, with earning opportunities of up to $150 and
                    beyond.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif-display mb-3" style={{ color: C.textPri, fontSize: '1rem' }}>
                    Why Refer?
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'Instant access to your personal referral link',
                      'Easy tracking of your referrals and earnings',
                      'No complicated process',
                      'Unlimited sharing potential',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span
                          className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                          style={{ marginTop: 2, color: C.green, background: 'rgba(0,255,163,0.10)', border: '1px solid rgba(0,255,163,0.28)' }}
                        >
                          ✓
                        </span>
                        <span className="text-sm" style={{ color: C.textSec, lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif-display mb-2" style={{ color: C.textPri, fontSize: '1rem' }}>
                    Start Earning Today
                  </h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: C.textSec }}>
                    Turn your connections into rewards. Share your link, invite others, and watch
                    your earnings grow.
                  </p>
                  <p className="font-serif-italic" style={{ color: C.purple, fontSize: '0.92rem', lineHeight: 1.5 }}>
                    Refer. Earn. Repeat. Your next reward could be just one referral away.
                  </p>
                </div>

                <div>
                  <span
                    className="text-[10px] uppercase font-medium block mb-3"
                    style={{ color: C.textSec, letterSpacing: '0.24em' }}
                  >
                    Your Referral Link
                  </span>
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{
                      background: 'linear-gradient(145deg, #0f1115, #1a1d24)',
                      boxShadow:
                        'inset 4px 4px 8px #0a0c10, inset -4px -4px 8px rgba(36,40,48,0.45)',
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <span
                      className="flex-1 truncate text-xs tabular-nums"
                      style={{
                        color: refLink ? C.textPri : C.textTer,
                        fontFamily: 'var(--font-jetbrains-mono, monospace)',
                      }}
                    >
                      {refLink || 'Generating your link…'}
                    </span>
                    <button
                      onClick={() => copyReferralLink(refLink)}
                      disabled={!refLink}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        color: refLink ? '#0B0D10' : C.textTer,
                        background: refLink ? GRAD_PRIMARY : 'rgba(255,255,255,0.03)',
                        border: refLink ? 'none' : `1px solid ${C.border}`,
                        cursor: refLink ? 'pointer' : 'not-allowed',
                      }}
                      title="Copy referral link"
                    >
                      <FaCopy size={11} />
                    </button>
                  </div>
                  {copied && (
                    <p
                      className="text-[11px] uppercase mt-3 flex items-center gap-2"
                      style={{ color: C.green, letterSpacing: '0.2em' }}
                    >
                      <span>✓</span> Referral link copied
                    </p>
                  )}
                </div>
              </div>

              <div className="relative px-7 pb-7">
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="w-full py-3 rounded-lg text-[12px] uppercase font-medium transition-all duration-200"
                  style={{
                    background: GRAD_PRIMARY,
                    color: C.textPri,
                    letterSpacing: '0.22em',
                    boxShadow: '0 4px 14px -2px rgba(168,85,247,0.4)',
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
