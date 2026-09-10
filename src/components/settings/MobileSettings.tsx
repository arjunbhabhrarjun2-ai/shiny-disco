'use client';

/**
 * Kandella · mobile-only Settings composition (< md).
 * Faithful composition of the settings mock main content (settings.txt) built
 * on the shared .k-* mobile shell. Every form/button is wired to the SAME real
 * API contract the desktop settings page uses (src/app/settings/page.tsx):
 * authFetch POST /api/user/settings with actions email · password · privateKey
 * · deleteAccount. Currency reads/writes the global CurrencyContext. Desktop
 * rendering is completely separate and untouched.
 */

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useCurrency } from '@/components/context/CurrencyContext';
import type { Fiat } from '@/components/context/CurrencyContext';
import { authFetch } from '@/lib/clientAuth';
import NotificationButton from '@/components/NotificationButton';

type Note = { type: 'success' | 'error'; msg: string } | null;

const CURRENCIES: { code: Fiat; name: string }[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];
const SYMBOL: Record<Fiat, string> = { USD: '$', EUR: '€', GBP: '£' };

/* Row chevron — same geometry as the mock */
const IconChevron = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export default function MobileSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, symbol, setCurrency } = useCurrency();

  /* ── Change email ───────────────────────────────────────────────── */
  const [email, setEmail] = useState('');
  const [emailPwd, setEmailPwd] = useState('');
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailNote, setEmailNote] = useState<Note>(null);

  /* ── Change password ────────────────────────────────────────────── */
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdNote, setPwdNote] = useState<Note>(null);

  /* ── Reset private key ──────────────────────────────────────────── */
  const [keyPwd, setKeyPwd] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyNote, setKeyNote] = useState<Note>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /* ── Delete account ─────────────────────────────────────────────── */
  const [delPwd, setDelPwd] = useState('');
  const [delConfirm, setDelConfirm] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delNote, setDelNote] = useState<Note>(null);

  /* ── General card ───────────────────────────────────────────────── */
  const [currencyOpen, setCurrencyOpen] = useState(false);
  // No notification-preference API exists anywhere in the app, so the
  // Transaction alerts switch is a controlled local toggle (mock default: on).
  const [alertsOn, setAlertsOn] = useState(true);

  /* ── Local toast (mirrors the prototype's k-toast) ──────────────── */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Pre-fill the new-email field with the signed-in user's address. */
  useEffect(() => { if (user?.email) setEmail(user.email); }, [user?.email]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  /* Authenticated settings POST — same contract as the desktop page. */
  const post = async (body: Record<string, unknown>) => {
    const r = await authFetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { ok: r.ok, data: await r.json().catch(() => ({})) };
  };

  /* ── Handlers (logic mirrors the desktop settings page) ─────────── */
  const saveEmail = async () => {
    setEmailNote(null); setEmailBusy(true);
    const { ok, data } = await post({ action: 'email', email, currentPassword: emailPwd });
    setEmailBusy(false);
    if (ok && data.success) { setEmailNote({ type: 'success', msg: 'Email updated.' }); setEmailPwd(''); }
    else setEmailNote({ type: 'error', msg: data.message || 'Could not update email.' });
  };

  const savePassword = async () => {
    setPwdNote(null);
    if (newPwd.length < 8) { setPwdNote({ type: 'error', msg: 'New password must be at least 8 characters.' }); return; }
    if (newPwd !== confirmPwd) { setPwdNote({ type: 'error', msg: 'New passwords do not match.' }); return; }
    setPwdBusy(true);
    const { ok, data } = await post({ action: 'password', currentPassword: curPwd, newPassword: newPwd });
    setPwdBusy(false);
    if (ok && data.success) { setPwdNote({ type: 'success', msg: 'Password updated.' }); setCurPwd(''); setNewPwd(''); setConfirmPwd(''); }
    else setPwdNote({ type: 'error', msg: data.message || 'Could not update password.' });
  };

  const resetKey = async () => {
    setKeyNote(null); setNewKey(null); setKeyBusy(true);
    const { ok, data } = await post({ action: 'privateKey', currentPassword: keyPwd });
    setKeyBusy(false);
    if (ok && data.success && data.privateKey) {
      setNewKey(data.privateKey);
      setKeyNote({ type: 'success', msg: 'Private key reset. Save it now — it will not be shown again.' });
      setKeyPwd('');
    } else setKeyNote({ type: 'error', msg: data.message || 'Could not reset private key.' });
  };

  const copyKey = async () => {
    if (!newKey) return;
    try {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      showToast('Private key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const deleteAccount = async () => {
    setDelNote(null);
    if (delConfirm.trim() !== 'DELETE') { setDelNote({ type: 'error', msg: 'Type DELETE to confirm.' }); return; }
    setDelBusy(true);
    const { ok, data } = await post({ action: 'deleteAccount', currentPassword: delPwd });
    setDelBusy(false);
    if (ok && data.success) {
      try { localStorage.removeItem('auth_token'); localStorage.removeItem('currentUser'); } catch { /* ignore */ }
      router.push('/screens/auth/Signin');
    } else setDelNote({ type: 'error', msg: data.message || 'Could not delete account.' });
  };

  /* Keep the page from scrolling behind the currency sheet + Escape to close. */
  useEffect(() => {
    if (!currencyOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCurrencyOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [currencyOpen]);

  const note = (n: Note) =>
    n && (
      <p style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 10, color: n.type === 'success' ? 'var(--mint)' : 'var(--down)' }}>
        {n.msg}
      </p>
    );

  /* Delete stays disabled until a password AND "DELETE" are present (mock). */
  const deleteReady = delPwd.length > 0 && delConfirm.trim() === 'DELETE';

  const field = (label: string, children: ReactNode, hint?: string) => (
    <div className="k-field">
      <div className="k-field__label">
        <span>{label}</span>
        {hint && <span className="k-field__hint">{hint}</span>}
      </div>
      {children}
    </div>
  );

  return (
    <>
      {/* ── Top bar: back → dashboard · title · spacer · notifications ── */}
      <header className="k-topbar">
        <button type="button" className="k-iconbtn" aria-label="Go back" onClick={() => router.push('/dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="k-topbar__title">Settings</span>
        <span className="k-topbar__spacer" />
        <NotificationButton />
      </header>

      {/* ── Main content ── */}
      <main style={{ flex: '1 1 auto', paddingBottom: 'calc(var(--tabbar-h) + 40px + env(safe-area-inset-bottom, 0px))' }}>
        {/* ── Change email ── */}
        <section className="k-card" style={{ margin: '14px 16px 0', padding: 16 }}>
          <h2 className="k-card__title" style={{ fontSize: 15, fontWeight: 750 }}>Change email</h2>
          {field('New email', (
            <input className="k-input" type="email" inputMode="email" autoComplete="email"
              placeholder="you@example.com" aria-label="New email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          ))}
          {field('Current password', (
            <input className="k-input" type="password" autoComplete="current-password"
              placeholder="Enter current password" aria-label="Current password"
              value={emailPwd} onChange={(e) => setEmailPwd(e.target.value)} />
          ))}
          {note(emailNote)}
          <button type="button" className="k-btn k-btn--ghost k-btn--block" style={{ marginTop: 16 }}
            onClick={saveEmail} disabled={emailBusy}>
            {emailBusy ? 'Updating…' : 'Update email'}
          </button>
        </section>

        {/* ── Change password ── */}
        <section className="k-card" style={{ margin: '12px 16px 0', padding: 16 }}>
          <h2 className="k-card__title" style={{ fontSize: 15, fontWeight: 750 }}>Change password</h2>
          {field('Current password', (
            <input className="k-input" type="password" autoComplete="current-password"
              placeholder="Enter current password" aria-label="Current password"
              value={curPwd} onChange={(e) => setCurPwd(e.target.value)} />
          ))}
          {field('New password', (
            <input className="k-input" type="password" autoComplete="new-password"
              placeholder="8+ characters, mix of letters and numbers" aria-label="New password"
              value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
          ))}
          {field('Confirm new password', (
            <input className="k-input" type="password" autoComplete="new-password"
              placeholder="Re-enter the new password" aria-label="Confirm new password"
              value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
          ))}
          {note(pwdNote)}
          <button type="button" className="k-btn k-btn--ghost k-btn--block" style={{ marginTop: 16 }}
            onClick={savePassword} disabled={pwdBusy}>
            {pwdBusy ? 'Updating…' : 'Update password'}
          </button>
        </section>

        {/* ── Reset private key ── */}
        <section className="k-card" style={{ margin: '12px 16px 0', padding: 16 }}>
          <h2 className="k-card__title" style={{ fontSize: 15, fontWeight: 750 }}>Reset private key</h2>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)', marginTop: 8 }}>
            Generates a new private key and invalidates the old one. You&rsquo;ll see the new key once — store it somewhere safe.
          </p>
          {field('Current password', (
            <input className="k-input" type="password" autoComplete="current-password"
              placeholder="Enter current password" aria-label="Current password"
              value={keyPwd} onChange={(e) => setKeyPwd(e.target.value)} />
          ))}
          {newKey && (
            <div style={{
              marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--r-m)',
              background: 'oklch(0.118 0.014 262 / 0.7)',
              border: '1px solid color-mix(in oklch, var(--accent) 45%, transparent)',
            }}>
              <code className="num" style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 1.5, wordBreak: 'break-all', color: 'var(--accent-soft)' }}>
                {newKey}
              </code>
              <button type="button" className="k-iconbtn" style={{ flex: '0 0 auto', color: 'var(--accent)' }}
                onClick={copyKey} aria-label="Copy private key">
                {copied ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          )}
          {note(keyNote)}
          <button type="button" className="k-btn k-btn--ghost k-btn--block"
            style={{ marginTop: 16, color: 'var(--down)', borderColor: 'color-mix(in oklch, var(--down) 45%, transparent)' }}
            onClick={resetKey} disabled={keyBusy}>
            {keyBusy ? 'Resetting…' : 'Reset private key'}
          </button>
        </section>

        {/* ── Delete account ── */}
        <section className="k-card"
          style={{ margin: '12px 16px 0', padding: 16, borderColor: 'color-mix(in oklch, var(--danger) 38%, transparent)' }}>
          <h2 className="k-card__title" style={{ fontSize: 15, fontWeight: 750, color: 'var(--down)' }}>Delete account</h2>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)', marginTop: 8 }}>
            Permanently deletes your account and all associated data — balances, holdings, orders, tickets and history. This cannot be undone.
          </p>
          {field('Current password', (
            <input className="k-input" type="password" autoComplete="current-password"
              placeholder="Enter current password" aria-label="Current password"
              value={delPwd} onChange={(e) => setDelPwd(e.target.value)} />
          ))}
          {field('Type “DELETE” to confirm', (
            <input className="k-input" type="text" autoCapitalize="characters"
              placeholder="DELETE" aria-label="Type DELETE to confirm"
              value={delConfirm} onChange={(e) => setDelConfirm(e.target.value)} />
          ))}
          {note(delNote)}
          <button type="button" className="k-btn k-btn--danger k-btn--block" style={{ marginTop: 16 }}
            onClick={deleteAccount} disabled={delBusy || !deleteReady}>
            {delBusy ? 'Deleting…' : 'Delete my account'}
          </button>
        </section>

        {/* ── Currency · Language · alerts · legal ── */}
        <section className="k-card" style={{ margin: '12px 16px 0' }}>
          <ul className="k-list k-list--flush">
            {/* Currency → opens the display-currency chooser (CurrencyContext) */}
            <li>
              <button type="button" className="k-row" onClick={() => setCurrencyOpen(true)}>
                <span className="k-row__glyph" style={{ background: 'color-mix(in oklch, var(--accent) 13%, transparent)', color: 'var(--accent-soft)' }}>
                  <span className="num" style={{ color: 'var(--accent-soft)' }}>{symbol}</span>
                </span>
                <span className="k-row__main"><span className="k-row__title">Currency</span></span>
                <span className="k-row__trail"><span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{currency} ({symbol})</span></span>
                <IconChevron className="k-row__chev" />
              </button>
            </li>
            <div className="k-hr" />

            {/* Language → single-locale app; toast explains (no i18n API exists) */}
            <li>
              <button type="button" className="k-row" onClick={() => showToast('English is the only language currently supported.')}>
                <span className="k-row__glyph" style={{ background: 'oklch(0.959 0.010 81.8/0.07)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9Z" />
                  </svg>
                </span>
                <span className="k-row__main"><span className="k-row__title">Language</span></span>
                <span className="k-row__trail"><span style={{ fontSize: 13, color: 'var(--fg-2)' }}>English</span></span>
                <IconChevron className="k-row__chev" />
              </button>
            </li>
            <div className="k-hr" />

            {/* Transaction alerts → local preference only (no backend state) */}
            <li>
              <div className="k-row">
                <span className="k-row__glyph" style={{ background: 'color-mix(in oklch, var(--up) 12%, transparent)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--up)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
                    <path d="M10.3 19a2 2 0 0 0 3.4 0" />
                  </svg>
                </span>
                <span className="k-row__main">
                  <span className="k-row__title">Transaction alerts</span>
                  <span className="k-row__sub">Deposits, withdrawals, orders</span>
                </span>
                <label className="k-toggle">
                  <input type="checkbox" checked={alertsOn} onChange={(e) => setAlertsOn(e.target.checked)} aria-label="Transaction alerts" />
                  <span className="k-switch" aria-hidden="true" />
                </label>
              </div>
            </li>
            <div className="k-hr" />

            {/* Legal & privacy → existing legal screen */}
            <li>
              <button type="button" className="k-row" onClick={() => router.push('/screens/Legal')}>
                <span className="k-row__glyph" style={{ background: 'oklch(0.959 0.010 81.8/0.07)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                    <path d="M7 4.5h10" />
                    <path d="M7 9.5h10" />
                    <path d="M7 14.5h6" />
                    <rect x="4.5" y="3" width="15" height="18" rx="2" />
                  </svg>
                </span>
                <span className="k-row__main"><span className="k-row__title">Legal &amp; privacy</span></span>
                <IconChevron className="k-row__chev" />
              </button>
            </li>
          </ul>
        </section>
      </main>

      {/* ── Currency chooser sheet ── */}
      {currencyOpen && (
        <>
          <div className="k-scrim is-open" aria-hidden="true" onClick={() => setCurrencyOpen(false)} />
          <div className="k-sheet is-open" role="dialog" aria-modal="true" aria-label="Choose display currency">
            <div className="k-sheet__handle"><i aria-hidden="true" /></div>
            <div className="k-sheet__head">
              <span className="k-sheet__title">Display currency</span>
              <button type="button" className="k-iconbtn" aria-label="Close" onClick={() => setCurrencyOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="k-sheet__body">
              <ul className="k-list k-list--flush">
                {CURRENCIES.map((c) => {
                  const active = c.code === currency;
                  return (
                    <li key={c.code}>
                      <button type="button" className="k-row" aria-pressed={active}
                        onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}>
                        <span className="k-row__glyph" style={{ background: 'color-mix(in oklch, var(--accent) 13%, transparent)', color: 'var(--accent-soft)' }}>
                          <span className="num">{SYMBOL[c.code]}</span>
                        </span>
                        <span className="k-row__main"><span className="k-row__title">{c.name}</span></span>
                        <span className="k-row__trail">
                          <span style={{ fontSize: 13, fontWeight: active ? 700 : 600, color: active ? 'var(--accent-soft)' : 'var(--fg-2)' }}>
                            {c.code} ({SYMBOL[c.code]})
                          </span>
                        </span>
                        {active && (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* ── Toast (only opens on interaction, auto-dismisses) ── */}
      <div className={`k-toast${toast ? ' is-open' : ''}`} role="status" aria-live="polite">
        {toast ?? ''}
      </div>
    </>
  );
}
