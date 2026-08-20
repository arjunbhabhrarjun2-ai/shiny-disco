'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PrivateKeyModal from '@/components/PrivateKeyModal';
import Logo from '@/components/Logo';
import { FaGlobe, FaKey, FaShieldAlt } from 'react-icons/fa';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function SigninPage() {
  const router = useRouter();
  const { login, verifyCredentials, verifyPrivateKey } = useAuth();
  const [credentialError, setCredentialError] = useState<string>('');
  const [privateKeyError, setPrivateKeyError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<{ id: number; email: string } | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setCredentialError('');
    const result = await verifyCredentials(data.email.toLowerCase(), data.password);
    setIsSubmitting(false);
    if (!result.success) {
      setCredentialError(result.message || 'Invalid email or password. Please try again.');
      return;
    }
    setPendingUser({ id: result.userId!, email: result.email! });
    setShowModal(true);
    setRetryCount(0);
    setPrivateKeyError('');
  };

  const handlePrivateKeySubmit = async (privateKey: string) => {
    if (!pendingUser) return;
    setIsVerifyingKey(true);
    setPrivateKeyError('');
    const result = await verifyPrivateKey(pendingUser.id, privateKey);
    setIsVerifyingKey(false);
    if (!result.success) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setPrivateKeyError(result.message || 'Invalid private key. Please try again.');
      if (newRetryCount >= 3) {
        setPrivateKeyError('Maximum retry attempts reached. Please contact support for assistance.');
      }
      return;
    }
    setShowModal(false);
    setTimeout(() => { router.push('/dashboard'); }, 100);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPendingUser(null);
    setRetryCount(0);
    setPrivateKeyError('');
  };

  const inputStyle = {
    background: 'rgba(13,19,32,0.6)',
    border: '1px solid rgba(212,175,127,0.18)',
    borderRadius: '12px',
    color: '#F5F1EA',
    outline: 'none',
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
    >
      {/* Editorial grid & noise */}
      <div className="absolute inset-0 bg-grid-editorial pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      {/* Warm ambient glows */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 100% 0%, rgba(212,175,127,0.10) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 0% 100%, rgba(59,130,246,0.05) 0%, transparent 65%)' }}
      />

      <div className="relative flex flex-col lg:flex-row w-full z-10">

        {/* ─── LEFT PANEL ─── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:w-[48%] flex-col justify-between px-14 xl:px-20 py-14 relative"
          style={{ borderRight: '1px solid rgba(212,175,127,0.12)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo size={36} wordmarkSize="1.5rem" />
            <span
              className="text-[10px] uppercase pl-3"
              style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.7)', borderLeft: '1px solid rgba(212,175,127,0.3)' }}
            >
              Est. 2019 · Est · Secure
            </span>
          </div>

          {/* Center block: kicker + editorial headline + decorative ring */}
          <div className="relative my-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Private Portal</span>
            </div>

            <h2
              className="leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">Secure access to your </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>portfolio.</span>
            </h2>

            <p className="text-sm leading-relaxed max-w-md" style={{ color: '#A9B1C0' }}>
              Your account is protected with AES-256 encryption and private-key
              verification — ensuring only you can access your funds.
            </p>

            {/* Decorative dashed gold ring — editorial accent */}
            <div
              className="absolute -right-10 -top-6 w-40 h-40 rounded-full opacity-40 pointer-events-none"
              style={{
                border: '1px dashed rgba(212,175,127,0.45)',
              }}
            />
            <div
              className="absolute -right-4 top-6 w-24 h-24 rounded-full opacity-30 pointer-events-none"
              style={{
                border: '1px solid rgba(212,175,127,0.3)',
              }}
            />
          </div>

          {/* Security vault illustration — upgraded for editorial palette */}
          <div className="relative w-full mb-10" style={{ maxWidth: '440px' }}>
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
              <rect x="20" y="20" width="360" height="260" rx="24" fill="rgba(13,19,32,0.85)" stroke="rgba(212,175,127,0.18)" strokeWidth="1"/>
              {/* Hairline border inset */}
              <rect x="30" y="30" width="340" height="240" rx="18" fill="none" stroke="rgba(212,175,127,0.08)" strokeWidth="1"/>

              {/* Shield */}
              <path d="M200 55L244 73L244 120Q244 158 200 176Q156 158 156 120L156 73Z" fill="url(#sgGold)" stroke="rgba(212,175,127,0.45)" strokeWidth="1.5"/>

              {/* Lock */}
              <rect x="184" y="112" width="32" height="26" rx="5" fill="rgba(245,241,234,0.08)" stroke="rgba(212,175,127,0.35)" strokeWidth="1"/>
              <path d="M190 112L190 104Q190 95 200 95Q210 95 210 104L210 112" stroke="rgba(212,175,127,0.55)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="200" cy="123" r="3" fill="#D4AF7F"/>
              <rect x="198.5" y="123" width="3" height="5" rx="1" fill="#D4AF7F"/>

              {/* Check */}
              <path d="M188 150L196 158L212 142" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Orbit dots */}
              <circle cx="316" cy="70" r="7" fill="rgba(212,175,127,0.15)" stroke="rgba(212,175,127,0.45)" strokeWidth="1.5"/>
              <circle cx="316" cy="70" r="3" fill="#D4AF7F"/>
              <circle cx="328" cy="210" r="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"/>
              <circle cx="328" cy="210" r="2.5" fill="#10B981"/>
              <circle cx="72" cy="90" r="5" fill="rgba(96,165,250,0.15)" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2"/>
              <circle cx="72" cy="90" r="2" fill="#60A5FA"/>

              {/* Dashed connectors */}
              <line x1="244" y1="84" x2="309" y2="70" stroke="rgba(212,175,127,0.22)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="244" y1="150" x2="322" y2="204" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="156" y1="100" x2="77" y2="90" stroke="rgba(96,165,250,0.22)" strokeWidth="1" strokeDasharray="4 5"/>

              {/* Bottom stat bar */}
              <rect x="44" y="202" width="312" height="60" rx="14" fill="rgba(255,255,255,0.015)" stroke="rgba(212,175,127,0.12)" strokeWidth="1"/>
              <line x1="148" y1="212" x2="148" y2="252" stroke="rgba(212,175,127,0.12)" strokeWidth="1"/>
              <line x1="252" y1="212" x2="252" y2="252" stroke="rgba(212,175,127,0.12)" strokeWidth="1"/>

              <text x="64" y="224" fill="#6B7280" fontSize="8" fontFamily="system-ui" letterSpacing="2">ENCRYPTION</text>
              <text x="64" y="244" fill="#10B981" fontSize="12" fontWeight="600" fontFamily="monospace">AES-256</text>

              <text x="168" y="224" fill="#6B7280" fontSize="8" fontFamily="system-ui" letterSpacing="2">2FA AUTH</text>
              <text x="168" y="244" fill="#60A5FA" fontSize="12" fontWeight="600" fontFamily="monospace">Active</text>

              <text x="272" y="224" fill="#6B7280" fontSize="8" fontFamily="system-ui" letterSpacing="2">LAST LOGIN</text>
              <text x="272" y="244" fill="#D4AF7F" fontSize="12" fontWeight="600" fontFamily="monospace">Secure</text>

              <defs>
                <linearGradient id="sgGold" x1="156" y1="55" x2="244" y2="176" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(212,175,127,0.28)"/>
                  <stop offset="100%" stopColor="rgba(212,175,127,0.05)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Badges — refined editorial tiles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FaShieldAlt />, label: 'End-to-end', sub: 'encrypted', color: '#10B981' },
              { icon: <FaKey />, label: 'Private key', sub: 'authentication', color: '#D4AF7F' },
              { icon: <FaGlobe />, label: 'Global', sub: 'access', color: '#60A5FA' },
            ].map(({ icon, label, sub, color }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 p-3 rounded-xl"
                style={{
                  background: 'rgba(13,19,32,0.4)',
                  border: '1px solid rgba(212,175,127,0.10)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color }}>{icon}</span>
                  <span className="text-[10px] uppercase" style={{ letterSpacing: '0.18em', color: 'rgba(245,241,234,0.7)' }}>
                    {label}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: '#6B7280' }}>{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── RIGHT PANEL — form ─── */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 py-10 min-h-screen relative">

          {/* Top right accent mark */}
          <div
            className="hidden lg:block absolute top-8 right-10 text-[10px] uppercase"
            style={{ letterSpacing: '0.28em', color: 'rgba(212,175,127,0.6)' }}
          >
            Session · 01
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size={36} wordmarkSize="1.5rem" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="accent-rule" />
                <span className="text-editorial-kicker">Welcome back</span>
              </div>
              <h1
                className="leading-[1.05] mb-3"
                style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)' }}
              >
                <span className="font-serif-display text-gradient-editorial">Sign </span>
                <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>In</span>
              </h1>
              <p className="text-sm" style={{ color: '#A9B1C0' }}>
                Welcome back — enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  className="block text-[10px] uppercase mb-2.5"
                  style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}
                >
                  Email Address
                </label>
                <input
                  {...register('email')}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 text-sm transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.55)';
                    e.currentTarget.style.background = 'rgba(23,34,58,0.4)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)';
                    e.currentTarget.style.background = 'rgba(13,19,32,0.6)';
                  }}
                />
                {errors.email && <p className="text-rose-400 text-xs mt-2">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-[10px] uppercase mb-2.5"
                  style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 text-sm transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.55)';
                    e.currentTarget.style.background = 'rgba(23,34,58,0.4)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,175,127,0.18)';
                    e.currentTarget.style.background = 'rgba(13,19,32,0.6)';
                  }}
                />
                {errors.password && <p className="text-rose-400 text-xs mt-2">{errors.password.message}</p>}
              </div>

              {/* Error */}
              {credentialError && (
                <div
                  className="p-4 rounded-xl text-sm"
                  style={{
                    background: 'rgba(244,63,94,0.08)',
                    border: '1px solid rgba(244,63,94,0.3)',
                    color: '#FB7185',
                  }}
                >
                  We couldn't sign you in. Please check your credentials and try again.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full py-4 rounded-xl text-sm font-semibold transition-all mt-3"
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.08em',
                }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,127,0.2), transparent)' }} />
              <span className="text-[10px] uppercase" style={{ letterSpacing: '0.28em', color: 'rgba(212,175,127,0.5)' }}>
                New here
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,127,0.2), transparent)' }} />
            </div>

            <p className="text-sm text-center" style={{ color: '#A9B1C0' }}>
              Don't have an account?{' '}
              <a
                href="/screens/auth/Signup"
                className="font-medium transition-colors duration-200"
                style={{ color: '#D4AF7F' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#F5F1EA'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F'; }}
              >
                Create account →
              </a>
            </p>
          </motion.div>

          {/* Bottom right footer mark */}
          <div
            className="hidden lg:block absolute bottom-8 right-10 text-[10px] uppercase"
            style={{ letterSpacing: '0.28em', color: 'rgba(169,177,192,0.4)' }}
          >
            Kandella · Encrypted Session
          </div>
        </div>
      </div>

      {/* Private Key Modal */}
      <PrivateKeyModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handlePrivateKeySubmit}
        email={pendingUser?.email || ''}
        error={privateKeyError}
        isLoading={isVerifyingKey}
        retryCount={retryCount}
        maxRetries={3}
      />
    </div>
  );
}
