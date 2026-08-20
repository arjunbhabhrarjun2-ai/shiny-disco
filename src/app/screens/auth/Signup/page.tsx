'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AiOutlineThunderbolt } from "react-icons/ai";
import Logo from '@/components/Logo';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartArea, FaLock } from 'react-icons/fa';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup.string().optional(),
  referralCode: yup.string().optional(),
});

function SignupInner() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [formData, setFormData] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [understandLoss, setUnderstandLoss] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setValue('referralCode', ref);
    }
  }, [searchParams, setValue]);

  const onSubmit = (data: any) => {
    setFormData(data);
    setShowTermsModal(true);
  };

  const handleTermsAccept = async () => {
    if (!termsAccepted || !termsScrolled) return;

    setShowTermsModal(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          termsAccepted: true,
          termsAcceptedIP: '',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPrivateKey(result.privateKey);
        setShowPrivateKeyModal(true);
      } else {
        setModal({
          open: true,
          message: result.error || 'Signup failed. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      setModal({
        open: true,
        message: 'Signup failed. Please try again.',
        type: 'error',
      });
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadKey = () => {
    const blob = new Blob([privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'private-key.txt';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const handleContinue = () => {
    if (!copied && !downloaded) return;
    if (!understandLoss) return;
    router.push('/screens/auth/Signin');
  };

  // Shared editorial input style
  const editorialInputStyle = {
    background: 'rgba(13,19,32,0.6)',
    border: '1px solid rgba(212,175,127,0.18)',
    borderRadius: '12px',
    color: '#F5F1EA',
    outline: 'none',
  };

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.55)';
    e.currentTarget.style.background = 'rgba(23,34,58,0.4)';
  };
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)';
    e.currentTarget.style.background = 'rgba(13,19,32,0.6)';
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
    >
      {/* Editorial ambient layers */}
      <div className="absolute inset-0 bg-grid-editorial pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-140px',
            left: '-80px',
            width: '620px',
            height: '620px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,127,0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* two-column flex container */}
      <div
        className="relative flex flex-col lg:flex-row items-stretch justify-center min-h-screen"
        style={{ zIndex: 1 }}
      >

        {/* ─── LEFT PANEL ─── */}
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="left-panel flex flex-col justify-between items-center lg:items-start
                     px-6 py-10 sm:px-10 sm:py-12 lg:px-14 xl:px-20 lg:py-16
                     w-full lg:w-auto lg:flex-none relative"
          style={{
            background: 'rgba(6,9,15,0.92)',
            borderBottom: '1px solid rgba(212,175,127,0.10)',
          }}
        >
          {/* responsive sidebar override */}
          <style>{`
            @media (min-width: 1024px) {
              .left-panel {
                flex: 0 0 48% !important;
                max-width: 620px !important;
                border-bottom: none !important;
                border-right: 1px solid rgba(212,175,127,0.12) !important;
              }
            }
          `}</style>

          {/* brand mark */}
          <div className="flex items-center gap-3 mb-6 lg:mb-0">
            <Logo size={36} wordmarkSize="1.5rem" />
            <span
              className="hidden lg:inline-block text-[10px] uppercase pl-3"
              style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.7)', borderLeft: '1px solid rgba(212,175,127,0.3)' }}
            >
              Onboarding · Private
            </span>
          </div>

          {/* Center editorial block: kicker + headline + ring decoration */}
          <div className="relative my-0 lg:my-8 w-full" style={{ maxWidth: '500px' }}>
            <div className="hidden lg:flex items-center gap-3 mb-5">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Open Your Vault</span>
            </div>

            <h2
              className="leading-[1.05] mb-5 text-center lg:text-left"
              style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.85rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">Your gateway to smarter </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>crypto</span>
              <span className="font-serif-display text-gradient-editorial"> investments.</span>
            </h2>
            <p
              className="text-sm leading-relaxed text-center lg:text-left"
              style={{ color: '#A9B1C0', maxWidth: '440px' }}
            >
              Join thousands of investors earning structured ROI on BTC, ETH, and
              more — with transparent plans, secure wallets, and real-time tracking.
            </p>

            {/* Decorative dashed gold rings (desktop only) */}
            <div
              className="hidden lg:block absolute -right-10 -top-8 w-44 h-44 rounded-full pointer-events-none"
              style={{ border: '1px dashed rgba(212,175,127,0.4)', opacity: 0.55 }}
            />
            <div
              className="hidden lg:block absolute -right-2 top-6 w-28 h-28 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(212,175,127,0.3)', opacity: 0.5 }}
            />
          </div>

          {/* Main illustration — desktop only */}
          <div className="hidden lg:block w-full" style={{ maxWidth: '460px' }}>
            <svg
              viewBox="0 0 420 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: 'auto' }}
            >
              {/* base card */}
              <rect x="20" y="30" width="380" height="280" rx="28" fill="rgba(13,19,32,0.88)" stroke="rgba(212,175,127,0.18)" strokeWidth="1.5"/>
              <rect x="30" y="40" width="360" height="260" rx="22" fill="none" stroke="rgba(212,175,127,0.08)" strokeWidth="1"/>

              {/* chart area */}
              <rect x="44" y="60" width="332" height="160" rx="14" fill="rgba(255,255,255,0.018)" stroke="rgba(212,175,127,0.12)" strokeWidth="1"/>

              {/* grid lines */}
              {[90, 115, 140, 165, 190].map((y, i) => (
                <line key={i} x1="64" y1={y} x2="356" y2={y} stroke="rgba(212,175,127,0.07)" strokeWidth="1" strokeDasharray="4 6"/>
              ))}

              {/* primary curve — gold */}
              <polyline
                points="64,185 100,162 136,170 172,135 208,118 244,128 280,95 316,110 352,80"
                stroke="url(#lineGradGold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <polygon
                points="64,185 100,162 136,170 172,135 208,118 244,128 280,95 316,110 352,80 352,200 64,200"
                fill="url(#areaFillGold)"
                opacity="0.35"
              />

              {/* secondary curve — blue */}
              <polyline
                points="64,175 100,178 136,160 172,165 208,145 244,155 280,140 316,150 352,130"
                stroke="url(#lineGradBlue)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.65"
              />

              {/* peak dot */}
              <circle cx="352" cy="80" r="5" fill="#D4AF7F" opacity="0.95"/>
              <circle cx="352" cy="80" r="11" fill="#D4AF7F" opacity="0.15"/>

              {/* y-axis labels */}
              <text x="48" y="93" fill="rgba(212,175,127,0.45)" fontSize="9" fontFamily="monospace">$68k</text>
              <text x="48" y="168" fill="rgba(212,175,127,0.35)" fontSize="9" fontFamily="monospace">$54k</text>
              <text x="48" y="198" fill="rgba(212,175,127,0.3)" fontSize="9" fontFamily="monospace">$48k</text>

              {/* x-axis labels */}
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'].map((m, i) => (
                <text key={m} x={64 + i * 36} y={218} fill="rgba(169,177,192,0.55)" fontSize="8.5" fontFamily="monospace" textAnchor="middle">{m}</text>
              ))}

              {/* legend */}
              <circle cx="68" cy="240" r="5" fill="#D4AF7F"/>
              <text x="78" y="244" fill="rgba(245,241,234,0.6)" fontSize="11" fontFamily="sans-serif">BTC/USD</text>
              <circle cx="148" cy="240" r="5" fill="#60A5FA"/>
              <text x="158" y="244" fill="rgba(245,241,234,0.6)" fontSize="11" fontFamily="sans-serif">ETH/USD</text>

              {/* stats row */}
              {[
                { label: 'Portfolio', value: '+38.4%', color: '#10B981', x: 44 },
                { label: 'Active Plans', value: '3', color: '#D4AF7F', x: 168 },
                { label: 'Total Yield', value: '$12.8k', color: '#60A5FA', x: 280 },
              ].map(({ label, value, color, x }) => (
                <g key={label}>
                  <rect x={x} y="262" width="112" height="36" rx="10" fill="rgba(212,175,127,0.04)" stroke="rgba(212,175,127,0.14)" strokeWidth="1"/>
                  <text x={x + 56} y="276" fill="rgba(169,177,192,0.7)" fontSize="8" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">{label.toUpperCase()}</text>
                  <text x={x + 56} y="291" fill={color} fontSize="13" fontWeight="600" fontFamily="monospace" textAnchor="middle">{value}</text>
                </g>
              ))}

              <defs>
                <linearGradient id="lineGradGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF7F" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#E8D3B0" stopOpacity="1"/>
                </linearGradient>
                <linearGradient id="lineGradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.9"/>
                </linearGradient>
                <linearGradient id="areaFillGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF7F" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#D4AF7F" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* trust badges — editorial tile style */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 lg:mt-10 w-full" style={{ maxWidth: '460px' }}>
            {[
              { icon: <FaLock/>, label: 'Bank-grade', sub: 'security', color: '#10B981' },
              { icon: <AiOutlineThunderbolt/>, label: 'Instant', sub: 'deposits', color: '#D4AF7F' },
              { icon: <FaChartArea/>, label: 'Up to 55%', sub: 'ROI', color: '#60A5FA' },
            ].map(({ icon, label, sub, color }) => (
              <div
                key={label}
                className="flex flex-col gap-1 p-3 rounded-xl"
                style={{
                  background: 'rgba(13,19,32,0.45)',
                  border: '1px solid rgba(212,175,127,0.10)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color, fontSize: '0.9rem' }}>{icon}</span>
                  <span className="text-[10px] uppercase" style={{ letterSpacing: '0.18em', color: 'rgba(245,241,234,0.75)' }}>
                    {label}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: '#6B7280' }}>{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── RIGHT PANEL ─── */}
        <div
          className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 py-10 relative"
          style={{ minHeight: '100vh' }}
        >
          <div
            className="hidden lg:block absolute top-8 right-10 text-[10px] uppercase"
            style={{ letterSpacing: '0.28em', color: 'rgba(212,175,127,0.6)' }}
          >
            Enrollment · 01
          </div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-10 rounded-3xl w-full max-w-md relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(23,34,58,0.35) 0%, rgba(13,19,32,0.75) 100%)',
              border: '1px solid rgba(212,175,127,0.16)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Decorative corner accents */}
            <div
              className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at top right, rgba(212,175,127,0.18), transparent 70%)',
              }}
            />

            <div className="mb-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="accent-rule" />
                <span className="text-editorial-kicker">New Account</span>
              </div>
              <h1
                className="leading-[1.05]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}
              >
                <span className="font-serif-display text-gradient-editorial">Create </span>
                <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Account</span>
              </h1>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>First Name</label>
                <input
                  {...register('firstName')}
                  placeholder="Jane"
                  className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                  style={editorialInputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
                {errors.firstName && (
                  <p className="text-rose-400 text-xs mt-2">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Last Name</label>
                <input
                  {...register('lastName')}
                  placeholder="Doe"
                  className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                  style={editorialInputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
                {errors.lastName && (
                  <p className="text-rose-400 text-xs mt-2">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Email Address</label>
              <input
                {...register('email')}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                style={editorialInputStyle}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
              {errors.email && <p className="text-rose-400 text-xs mt-2">{errors.email.message}</p>}
            </div>

            {/* Username */}
            <div className="mt-4">
              <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Username</label>
              <input
                {...register('username')}
                placeholder="janedoe"
                className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                style={editorialInputStyle}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
              {errors.username && (
                <p className="text-rose-400 text-xs mt-2">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative mt-4">
              <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                style={editorialInputStyle}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-[10px] uppercase font-medium px-2 py-1 rounded-md transition-colors"
                style={{ letterSpacing: '0.18em', color: '#D4AF7F', background: 'rgba(212,175,127,0.08)' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-2">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative mt-4">
              <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                style={editorialInputStyle}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 bottom-3 text-[10px] uppercase font-medium px-2 py-1 rounded-md transition-colors"
                style={{ letterSpacing: '0.18em', color: '#D4AF7F', background: 'rgba(212,175,127,0.08)' }}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-xs mt-2">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label className="block text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Phone <span style={{ color: '#6B7280', letterSpacing: '0.1em' }}>(optional)</span></label>
              <input
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3.5 text-sm transition-all duration-200"
                style={editorialInputStyle}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn-gold w-full py-4 rounded-xl mt-6 font-semibold transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              style={{ letterSpacing: '0.08em' }}
            >
              {loading ? 'Creating Account...' : 'Sign Up →'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,127,0.2), transparent)' }} />
              <span className="text-[10px] uppercase" style={{ letterSpacing: '0.28em', color: 'rgba(212,175,127,0.5)' }}>
                Member
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,127,0.2), transparent)' }} />
            </div>

            <p className="text-sm text-center" style={{ color: '#A9B1C0' }}>
              Already have an account?{' '}
              <a
                href="/screens/auth/Signin"
                className="font-medium transition-colors duration-200"
                style={{ color: '#D4AF7F' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#F5F1EA'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F'; }}
              >
                Login →
              </a>
            </p>
          </motion.form>

          {/* Alert Modal */}
          <AnimatePresence>
            {modal.open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
                style={{ background: 'rgba(6,9,15,0.75)', backdropFilter: 'blur(6px)' }}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl shadow-2xl p-7 w-full max-w-sm text-center"
                  style={{
                    background: 'linear-gradient(180deg, rgba(23,34,58,0.9) 0%, rgba(13,19,32,0.95) 100%)',
                    border: `1px solid ${modal.type === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(244,63,94,0.35)'}`,
                    color: '#F5F1EA',
                  }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="accent-rule" style={{ maxWidth: '40px' }} />
                    <span className="text-editorial-kicker" style={{ color: modal.type === 'success' ? '#10B981' : '#F43F5E' }}>
                      {modal.type === 'success' ? 'Success' : 'Error'}
                    </span>
                    <span className="accent-rule" style={{ maxWidth: '40px' }} />
                  </div>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#A9B1C0' }}>{modal.message}</p>
                  <button
                    onClick={() => setModal((prev) => ({ ...prev, open: false }))}
                    className="btn-gold px-8 py-2.5 rounded-xl font-semibold text-sm"
                    style={{ letterSpacing: '0.08em' }}
                  >
                    OK
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TERMS MODAL */}
          <AnimatePresence>
            {showTermsModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6"
                style={{ background: 'rgba(6,9,15,0.8)', backdropFilter: 'blur(8px)' }}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-3xl max-h-[85vh] overflow-y-auto"
                  style={{
                    background: 'linear-gradient(180deg, rgba(23,34,58,0.88) 0%, rgba(13,19,32,0.95) 100%)',
                    border: '1px solid rgba(212,175,127,0.22)',
                    color: '#F5F1EA',
                  }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="accent-rule" />
                    <span className="text-editorial-kicker">Legal Notice</span>
                    <span className="accent-rule" />
                  </div>
                  <h2
                    className="text-center mb-6"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                  >
                    <span className="font-serif-display text-gradient-editorial">Terms and </span>
                    <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Conditions</span>
                  </h2>

                  <div className="text-sm space-y-6 overflow-y-auto flex-1 mb-6" style={{ color: 'rgba(245,241,234,0.75)' }}>
                    {/* Header */}
                    <div className="text-center pb-4" style={{ borderBottom: '1px solid rgba(212,175,127,0.2)' }}>
                      <h1 className="font-serif-display text-xl mb-2" style={{ color: '#F5F1EA' }}>Kandella</h1>
                      <p className="text-[11px] uppercase" style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.6)' }}>Last Updated: 6th October 2025</p>
                    </div>

                    {/* Introduction */}
                    <section>
                      <p>
                        These Terms and Conditions ("Terms") define the operating framework for
                        Kandella ("the Platform," "we," "us," "our"). By accessing, onboarding, or
                        transacting on the Platform, the user ("you," "your") acknowledges these Terms
                        as the governing standard for all interactions.
                      </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        1. Platform Definition & Scope
                      </h3>
                      <p>
                        Kandella is a full-stack cryptocurrency investment platform enabling users
                        to deposit digital assets, execute investment plans, track ROI, and manage
                        withdrawals in a secure, automated environment. The Platform includes all web
                        assets, API services, dashboards, and system-driven notifications.
                      </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        2. Eligibility & User Onboarding
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Minimum age requirement: 18 years.</li>
                        <li>Cryptocurrency engagements must be legal in your jurisdiction.</li>
                        <li>Registration requires accurate, up-to-date identity information.</li>
                        <li>We reserve full discretion to decline, suspend, or terminate any account.</li>
                      </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        3. User Accounts & Security
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Users are responsible for securing login credentials and devices.</li>
                        <li>Unauthorized activities must be reported immediately.</li>
                        <li>
                          The Platform employs industry-standard security measures (hashing,
                          rate-limiting, CSRF protection, audit logging).
                        </li>
                        <li>
                          No digital system is immune to compromise; by using the Platform, you
                          acknowledge residual operational risk.
                        </li>
                      </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>4. Deposits</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Supported assets: BTC, ETH, USDT (ERC20, BSC), SOL, XRP.</li>
                        <li>Minimum deposit: $1,000 USD, maximum: $1,000,000 USD.</li>
                        <li>All deposits require admin approval after blockchain confirmation.</li>
                        <li>
                          Deposits sent to incorrect wallet addresses are irreversible; we do not
                          recover or replace misdirected funds.
                        </li>
                        <li>The Platform may impose deposit fees, clearly stated before processing.</li>
                      </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>5. Withdrawals</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All withdrawal requests move through an admin approval workflow.</li>
                        <li>
                          Users must provide accurate external wallet addresses. Incorrect entries
                          resulting in loss are borne solely by the user.
                        </li>
                        <li>
                          Processing times vary based on network conditions, compliance checks, security
                          reviews, and operational capacity.
                        </li>
                        <li>Withdrawal fees—where applicable—will be disclosed prior to execution.</li>
                      </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>6. Investment Plans</h3>
                      <p className="mb-3">
                        Users may allocate funds into the following structured plans:
                      </p>

                      <div className="overflow-x-auto mb-3 rounded-xl" style={{ border: '1px solid rgba(212,175,127,0.2)' }}>
                        <table className="min-w-full">
                          <thead>
                            <tr style={{ background: 'rgba(212,175,127,0.08)' }}>
                              <th className="px-3 py-2.5 text-xs sm:text-sm font-serif-display text-left" style={{ color: '#F5F1EA', borderBottom: '1px solid rgba(212,175,127,0.2)' }}>Plan</th>
                              <th className="px-3 py-2.5 text-xs sm:text-sm font-serif-display text-left" style={{ color: '#F5F1EA', borderBottom: '1px solid rgba(212,175,127,0.2)' }}>Duration</th>
                              <th className="px-3 py-2.5 text-xs sm:text-sm font-serif-display text-left" style={{ color: '#F5F1EA', borderBottom: '1px solid rgba(212,175,127,0.2)' }}>ROI</th>
                              <th className="px-3 py-2.5 text-xs sm:text-sm font-serif-display text-left" style={{ color: '#F5F1EA', borderBottom: '1px solid rgba(212,175,127,0.2)' }}>Min</th>
                              <th className="px-3 py-2.5 text-xs sm:text-sm font-serif-display text-left" style={{ color: '#F5F1EA', borderBottom: '1px solid rgba(212,175,127,0.2)' }}>Max</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2.5 text-xs sm:text-sm" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>Mining</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>30 days</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ color: '#D4AF7F', borderBottom: '1px solid rgba(212,175,127,0.1)' }}>30%</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>$1,000</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>$19,999</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2.5 text-xs sm:text-sm" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>Premium</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>60 days</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ color: '#D4AF7F', borderBottom: '1px solid rgba(212,175,127,0.1)' }}>40%</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>$20,000</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}>$99,999</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2.5 text-xs sm:text-sm">Gold</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm">90 days</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums" style={{ color: '#D4AF7F' }}>55%</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums">$100,000</td>
                              <td className="px-3 py-2.5 text-xs sm:text-sm tabular-nums">$1,000,000</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="font-semibold mb-2" style={{ color: '#F5F1EA' }}>Key investment rules:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Funds are locked for the duration of the plan.</li>
                        <li>
                          Early termination—when permitted—will incur penalties or forfeiture of accrued
                          ROI.
                        </li>
                        <li>ROI accrual is automated and credited at maturity.</li>
                        <li>Past performance does not guarantee future results.</li>
                      </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        7. Market Risk Disclosure
                      </h3>
                      <p className="mb-2">
                        Cryptocurrency markets are inherently volatile. By investing, you acknowledge:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>You may lose part or all of your invested capital.</li>
                        <li>Kandella does not offer financial, legal, or tax advice.</li>
                        <li>
                          System performance may be impacted by network issues, regulatory actions, or
                          third-party service disruptions.
                        </li>
                        <li>You are solely responsible for your investment decisions.</li>
                      </ul>
                    </section>

                    {/* Section 8 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        8. Referral & Rewards Program
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Reward points are granted based on verified, successful referrals.</li>
                        <li>
                          Abuse, manipulation, or fraudulent referral activity leads to suspension and
                          point forfeiture.
                        </li>
                        <li>
                          Kandella may modify or discontinue the rewards framework at any time.
                        </li>
                      </ul>
                    </section>

                    {/* Section 9 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>9. Support & Escalation</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All support requests must flow through the in-platform ticketing system.</li>
                        <li>Response prioritization aligns with issue severity.</li>
                        <li>Our decisions on disputes and account reviews are final.</li>
                      </ul>
                    </section>

                    {/* Section 10 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>10. Prohibited Conduct</h3>
                      <p className="mb-2">Users are strictly barred from:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Money laundering, fraud, phishing, or illegal financial activity.</li>
                        <li>
                          Attempting to manipulate balances, exploit bugs, or bypass security protocols.
                        </li>
                        <li>Submitting forged documentation or misleading information.</li>
                        <li>Reverse-engineering or disrupting platform infrastructure.</li>
                      </ul>
                      <p className="mt-2">
                        Violations result in account suspension, asset freeze, and reporting to relevant
                        authorities.
                      </p>
                    </section>

                    {/* Section 11 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        11. Account Suspension & Termination
                      </h3>
                      <p className="mb-2">We retain the right to:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Suspend accounts under investigation.</li>
                        <li>
                          Terminate accounts for breaches, regulatory obligations, or suspicious
                          activity.
                        </li>
                        <li>Withhold withdrawals pending KYC, AML, or security reviews.</li>
                      </ul>
                      <p className="mt-2">
                        Users may deactivate accounts at any time, subject to the resolution of
                        outstanding balances and requests.
                      </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>12. Liability Framework</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Our liability is capped at the total amount of verified deposits in your
                          Platform account.
                        </li>
                        <li>
                          We are not responsible for:
                          <ul className="list-circle pl-5 mt-1 space-y-1">
                            <li>Network failures</li>
                            <li>Market volatility</li>
                            <li>User errors (e.g., wrong wallet address)</li>
                            <li>Third-party service disruptions</li>
                          </ul>
                        </li>
                        <li>
                          We do not provide indemnity for consequential, indirect, or incidental
                          damages.
                        </li>
                      </ul>
                      <p className="mt-2">
                        Users agree to indemnify Kandella against claims resulting from misuse of
                        the Platform.
                      </p>
                    </section>

                    {/* Section 13 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        13. Data Usage & Privacy
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          We collect and process data to support authentication, compliance, analytics,
                          and operations.
                        </li>
                        <li>
                          Data handling follows industry-standard principles for security and regulatory
                          alignment.
                        </li>
                        <li>
                          Details are outlined in our separate <strong style={{ color: '#D4AF7F' }}>Privacy Policy</strong>.
                        </li>
                      </ul>
                    </section>

                    {/* Section 14 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        14. Jurisdiction & Legal Governance
                      </h3>
                      <p className="mb-2">
                        Cryptocurrency operates in a multi-jurisdictional global environment with no
                        unified regulatory framework. Each country maintains its own rules, standards,
                        and supervisory expectations.
                      </p>
                      <p>Kandella adopts a governance stance aligned with:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          International AML/CFT guidelines issued by the Financial Action Task Force
                          (FATF)
                        </li>
                        <li>Industry-standard compliance practices</li>
                      </ul>
                    </section>

                    {/* Section 15 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        15. Amendments & Versioning
                      </h3>
                      <p>
                        Kandella may update these Terms periodically. Continued platform usage
                        signals acceptance of revised Terms. Major updates will be communicated via
                        in-app notifications or email.
                      </p>
                    </section>

                    {/* Section 16 */}
                    <section>
                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                        16. Contact & Compliance
                      </h3>
                      <ul className="space-y-1">
                        <li>
                          Email:{' '}
                          <a href="mailto:support@cryptotradeprime.io" className="hover:underline" style={{ color: '#D4AF7F' }}>
                            support@cryptotradeprime.io
                          </a>
                        </li>
                        <li>
                          Website:{' '}
                          <a href="https://www.cryptotradeprime.io" className="hover:underline" style={{ color: '#D4AF7F' }}>
                            https://www.cryptotradeprime.io
                          </a>
                        </li>
                      </ul>
                    </section>

                    {/* Privacy Policy */}
                    <section className="pt-6" style={{ borderTop: '1px solid rgba(212,175,127,0.2)' }}>
                      <h2 className="font-serif-display text-xl mb-3" style={{ color: '#F5F1EA' }}>
                        Kandella Privacy Policy
                      </h2>
                      <p className="text-[11px] uppercase mb-4" style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.6)' }}>Last Updated: 6th October 2025</p>

                      <p className="mb-4">
                        This Privacy Policy outlines how Kandella ("we," "us," "our") collects,
                        processes, stores, and protects user data across our investment platform.
                      </p>

                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>1. Data We Collect</h3>
                      <p className="mb-2">We collect the following categories of data:</p>

                      <h4 className="font-semibold mt-3 mb-1" style={{ color: '#F5F1EA' }}>Account & Identity Data</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Name</li>
                        <li>Email</li>
                      </ul>

                      <h4 className="font-semibold mt-3 mb-1" style={{ color: '#F5F1EA' }}>Financial & Transactional Data</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Deposit information</li>
                        <li>Wallet addresses</li>
                        <li>Investment history</li>
                        <li>Withdrawal activity</li>
                        <li>Transaction logs</li>
                      </ul>

                      <h4 className="font-semibold mt-3 mb-1" style={{ color: '#F5F1EA' }}>Technical Data</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>IP address</li>
                        <li>Device identifiers</li>
                        <li>Browser metadata</li>
                        <li>Usage statistics</li>
                        <li>Security logs</li>
                      </ul>

                      <h4 className="font-semibold mt-3 mb-1" style={{ color: '#F5F1EA' }}>Support & Communications</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Messages sent via tickets</li>
                        <li>Email correspondence</li>
                        <li>System notifications</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        2. How We Use Your Data
                      </h3>
                      <p>
                        Data is processed to improve platform integrity and deliver operational value:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Account creation and authentication</li>
                        <li>Fraud prevention and AML/CFT compliance</li>
                        <li>Transaction execution</li>
                        <li>Investment allocation and ROI processing</li>
                        <li>Customer support and dispute resolution</li>
                        <li>System diagnostics and performance optimization</li>
                        <li>Regulatory obligations, when applicable</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        3. Data Storage & Security
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Encrypted databases</li>
                        <li>Hashed credentials</li>
                        <li>Rate-limiting and CSRF protection</li>
                        <li>Audit trails and access logs</li>
                        <li>Role-based admin permissions</li>
                      </ul>
                      <p className="mt-2">
                        We maintain best-practice security standards but cannot guarantee absolute
                        immunity from cyber threats.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>4. Data Sharing</h3>
                      <p className="mb-2">We do not sell user data.</p>
                      <p className="mb-2">We may share necessary data with:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Regulatory authorities (if legally required)</li>
                        <li>Payment and blockchain infrastructure providers</li>
                        <li>Security and compliance tools</li>
                        <li>Internal admin personnel</li>
                      </ul>
                      <p className="mt-2">
                        All sharing follows strict necessity and security protocols.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>5. Data Retention</h3>
                      <p className="mb-2">We retain data for as long as reasonably required for:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Regulatory obligations</li>
                        <li>Financial auditing</li>
                        <li>Dispute resolution</li>
                        <li>Operational analysis</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>6. User Rights</h3>
                      <p className="mb-2">Where supported by local law, users may request:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Data access</li>
                        <li>Data correction</li>
                        <li>Account deletion</li>
                        <li>Processing limitations</li>
                      </ul>
                      <p className="mt-2">Requests must go through our support system.</p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        7. International Data Transfers
                      </h3>
                      <p>
                        Due to the global nature of cryptocurrency systems, data may be processed or
                        stored across jurisdictions. We apply standard safeguards to maintain security
                        and compliance.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>8. Policy Updates</h3>
                      <p>
                        We may revise this Privacy Policy. Continued use of the platform signifies
                        acceptance of updates.
                      </p>
                    </section>

                    {/* Risk Disclosure */}
                    <section className="pt-6" style={{ borderTop: '1px solid rgba(212,175,127,0.2)' }}>
                      <h2 className="font-serif-display text-xl mb-3" style={{ color: '#F5F1EA' }}>
                        Kandella – Risk Disclosure Statement
                      </h2>
                      <p className="text-[11px] uppercase mb-4" style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.6)' }}>Last Updated: 6th October 2025</p>

                      <p className="mb-4">
                        Cryptocurrency investments carry high risk. Users must evaluate personal risk
                        tolerance before participating.
                      </p>

                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>1. Market Volatility</h3>
                      <p>
                        Digital assets can experience extreme price fluctuations. ROI is not guaranteed.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        2. Technological Risks
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Blockchain congestion</li>
                        <li>Smart-contract or protocol failures</li>
                        <li>Network splits, forks, or disruptions</li>
                        <li>Wallet compatibility issues</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        3. Regulatory Risks
                      </h3>
                      <p className="mb-2">Crypto laws vary globally. New regulations may impact:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Asset availability</li>
                        <li>Withdrawal permissions</li>
                        <li>Platform operations</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        4. Cybersecurity Risks
                      </h3>
                      <p className="mb-2">While we deploy best-practice controls, risks include:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Phishing</li>
                        <li>Account compromise</li>
                        <li>Malware</li>
                        <li>Third-party system failures</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>5. Liquidity Risks</h3>
                      <p>Certain assets may face low liquidity, impacting withdrawals or pricing.</p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        6. Operational Risks
                      </h3>
                      <p>These include:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Technical outages</li>
                        <li>Scheduled and unscheduled maintenance</li>
                        <li>Third-party dependency failures</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        7. No Financial Advice
                      </h3>
                      <p>
                        Kandella does not offer investment, tax, or legal advice. All investment
                        decisions are self-directed.
                      </p>
                    </section>

                    {/* User Agreement */}
                    <section className="pt-6" style={{ borderTop: '1px solid rgba(212,175,127,0.2)' }}>
                      <h2 className="font-serif-display text-xl mb-3" style={{ color: '#F5F1EA' }}>
                        Kandella User Agreement
                      </h2>
                      <p className="text-[11px] uppercase mb-4" style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.6)' }}>Last Updated: 6th October 2025</p>

                      <p className="mb-4">
                        This User Agreement governs the relationship between Kandella and its
                        users.
                      </p>

                      <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>1. Acceptance</h3>
                      <p>
                        Using the Platform constitutes acceptance of this Agreement, the Terms &
                        Conditions, the Privacy Policy, and any other supporting governance documents.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        2. Account Responsibilities
                      </h3>
                      <p className="mb-2">Users agree to:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Provide accurate registration details</li>
                        <li>Maintain account confidentiality</li>
                        <li>Avoid multi-accounting or fraudulent activities</li>
                        <li>Comply with security instructions issued by the Platform</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        3. Platform Responsibilities
                      </h3>
                      <p className="mb-2">Kandella will:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Maintain operational availability when possible</li>
                        <li>Process transactions in alignment with platform logic</li>
                        <li>Apply security best practices</li>
                        <li>Provide ticket-based customer support</li>
                      </ul>
                      <p className="mt-2">
                        We are not responsible for third-party disruptions beyond our operational
                        control.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        4. Transactions & Investments
                      </h3>
                      <p className="mb-2">Users acknowledge:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All deposits and withdrawals require admin approval</li>
                        <li>Blockchain transactions are irreversible</li>
                        <li>Investment plans have fixed durations</li>
                        <li>ROI projections are estimates, not guarantees</li>
                        <li>Early exit rules and penalties apply</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>5. Prohibited Use</h3>
                      <p className="mb-2">Users may not:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Engage in illegal or suspicious transactions</li>
                        <li>Use the Platform for money laundering, fraud, or terrorist financing</li>
                        <li>Spam, hack, or manipulate system functions</li>
                        <li>Interfere with security protocols</li>
                        <li>Attempt chargebacks after legitimate deposits</li>
                      </ul>
                      <p className="mt-2">Violations result in immediate suspension or termination.</p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        6. Dispute Resolution
                      </h3>
                      <p>
                        All disputes must be initiated via the support ticket system. Kandella
                        reserves the right to make final determinations.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        7. Platform Modifications
                      </h3>
                      <p>
                        We may modify services, investment plans, fees, or operational mechanisms at our
                        discretion. Users will receive notices where appropriate.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>8. Liability</h3>
                      <p className="mb-2">
                        Liability is limited to the value of verified user deposits.
                      </p>
                      <p className="mb-2">We are not liable for:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Lost private keys</li>
                        <li>Incorrect wallet addresses</li>
                        <li>Market losses</li>
                        <li>Force majeure events</li>
                        <li>Regulatory actions impacting service continuity</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>9. Termination</h3>
                      <p className="mb-2">We may suspend or terminate accounts for:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Non-compliance</li>
                        <li>Suspicious activity</li>
                        <li>Violations of platform policies</li>
                      </ul>
                      <p className="mt-2">
                        Users may also close accounts, subject to the settlement of outstanding
                        balances.
                      </p>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>
                        10. Governing Law & Jurisdiction
                      </h3>
                      <p className="mb-2">
                        Cryptocurrency operates in a multi-jurisdictional global environment with no
                        unified regulatory framework. Each country maintains its own rules, standards,
                        and supervisory expectations.
                      </p>
                      <p>Kandella adopts a governance stance aligned with:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          International AML/CFT guidelines issued by the Financial Action Task Force
                          (FATF)
                        </li>
                        <li>Industry-standard compliance practices</li>
                      </ul>

                      <h3 className="font-serif-display text-lg mt-4 mb-2" style={{ color: '#F5F1EA' }}>11. Contact</h3>
                      <ul className="space-y-1">
                        <li>
                          Email:{' '}
                          <a href="mailto:support@cryptotradeprime.io" className="hover:underline" style={{ color: '#D4AF7F' }}>
                            support@kandella.io
                          </a>
                        </li>
                        <li>
                          Website:{' '}
                          <a href="https://www.kandella.io" className="hover:underline" style={{ color: '#D4AF7F' }}>
                            https://www.kandella.io
                          </a>
                        </li>
                      </ul>
                    </section>

                    {/* Acknowledgment */}
                    <div className="pt-6 mt-6 text-center" style={{ borderTop: '1px solid rgba(212,175,127,0.2)' }}>
                      <p className="text-sm">
                        By using Kandella, you acknowledge that you have read, understood, and
                        agree to be bound by all the above Terms and Conditions, Privacy Policy, Risk
                        Disclosure Statement, and User Agreement.
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 mb-3 mt-6 p-3 rounded-xl"
                    style={{ background: 'rgba(212,175,127,0.04)', border: '1px solid rgba(212,175,127,0.12)' }}
                  >
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="accent-[#D4AF7F] w-4 h-4"
                    />
                    <label htmlFor="termsAccepted" className="text-sm" style={{ color: '#A9B1C0' }}>
                      I have read and agree to the Terms and Conditions
                    </label>
                  </div>

                  <div
                    className="flex items-center gap-3 mb-6 p-3 rounded-xl"
                    style={{ background: 'rgba(212,175,127,0.04)', border: '1px solid rgba(212,175,127,0.12)' }}
                  >
                    <input
                      type="checkbox"
                      id="termsScrolled"
                      checked={termsScrolled}
                      onChange={(e) => setTermsScrolled(e.target.checked)}
                      className="accent-[#D4AF7F] w-4 h-4"
                    />
                    <label htmlFor="termsScrolled" className="text-sm" style={{ color: '#A9B1C0' }}>
                      I confirm I have scrolled through the entire document
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <button
                      onClick={() => setShowTermsModal(false)}
                      className="btn-ghost-gold px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTermsAccept}
                      disabled={!termsAccepted || !termsScrolled}
                      className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                        termsAccepted && termsScrolled
                          ? 'btn-gold'
                          : 'cursor-not-allowed opacity-40'
                      }`}
                      style={
                        !(termsAccepted && termsScrolled)
                          ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F1EA', letterSpacing: '0.08em' }
                          : { letterSpacing: '0.08em' }
                      }
                    >
                      Accept & Continue →
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Private Key Modal */}
          <AnimatePresence>
            {showPrivateKeyModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6"
                style={{ background: 'rgba(6,9,15,0.8)', backdropFilter: 'blur(8px)' }}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                  style={{
                    background: 'linear-gradient(180deg, rgba(23,34,58,0.9) 0%, rgba(13,19,32,0.96) 100%)',
                    border: '1px solid rgba(212,175,127,0.3)',
                    color: '#F5F1EA',
                  }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="accent-rule" />
                    <span className="text-editorial-kicker" style={{ color: '#D4AF7F' }}>Important</span>
                    <span className="accent-rule" />
                  </div>

                  <h2
                    className="text-center mb-4 leading-[1.1]"
                    style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)' }}
                  >
                    <span className="font-serif-display text-gradient-editorial">Save your </span>
                    <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Private Key</span>
                  </h2>

                  <p className="mb-5 text-sm sm:text-base text-center" style={{ color: '#A9B1C0' }}>
                    Your private key is crucial for account access. Please save it securely. You will
                    need it to log in.
                  </p>

                  <div
                    className="p-5 rounded-2xl mb-5"
                    style={{
                      background: 'rgba(13,19,32,0.65)',
                      border: '1px solid rgba(212,175,127,0.25)',
                    }}
                  >
                    <p className="text-[10px] uppercase mb-2" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>Private Key</p>
                    <p className="font-mono text-xs sm:text-sm break-all" style={{ color: '#F5F1EA' }}>{privateKey}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <button
                      onClick={copyToClipboard}
                      className="btn-gold flex-1 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button
                      onClick={downloadKey}
                      className="btn-ghost-gold flex-1 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      {downloaded ? 'Downloaded!' : 'Download as File'}
                    </button>
                  </div>

                  <div
                    className="flex items-start gap-3 mb-6 p-3 rounded-xl"
                    style={{ background: 'rgba(212,175,127,0.04)', border: '1px solid rgba(212,175,127,0.12)' }}
                  >
                    <input
                      type="checkbox"
                      id="understandLoss"
                      checked={understandLoss}
                      onChange={(e) => setUnderstandLoss(e.target.checked)}
                      className="accent-[#D4AF7F] w-4 h-4 mt-0.5 shrink-0"
                    />
                    <label htmlFor="understandLoss" className="text-sm" style={{ color: '#A9B1C0' }}>
                      I understand that if I lose this key, I may not be able to access my account
                    </label>
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={!understandLoss || (!copied && !downloaded)}
                    className={`w-full px-4 py-3.5 rounded-xl font-semibold transition-all ${
                      understandLoss && (copied || downloaded)
                        ? 'btn-gold'
                        : 'cursor-not-allowed opacity-40'
                    }`}
                    style={
                      !(understandLoss && (copied || downloaded))
                        ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F1EA', letterSpacing: '0.08em' }
                        : { letterSpacing: '0.08em' }
                    }
                  >
                    Continue to Sign In →
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>{/* end right panel */}
      </div>{/* end two-column container */}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--color-bg)', minHeight: '100vh' }} />}>
      <SignupInner />
    </Suspense>
  );
}
