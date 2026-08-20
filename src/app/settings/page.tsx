'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { authFetch } from '@/lib/clientAuth';
import { FaCog, FaEnvelope, FaLock, FaKey, FaCopy, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const C = {
  bg: '#06090F',
  border: 'rgba(255,255,255,0.08)',
  gold: '#D4AF7F',
  text: '#F5F1EA',
  sub: '#8F9BB3',
  green: '#00C853',
  red: '#FF3D71',
};

type Note = { type: 'success' | 'error'; msg: string } | null;

function Field({
  label, type = 'text', value, onChange, placeholder,
}: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase font-bold tracking-widest block mb-2" style={{ color: C.sub }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-sm"
        style={{ background: '#0B0E11', border: `1px solid ${C.border}`, color: C.text }}
      />
    </div>
  );
}

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!authLoading && !user) router.push('/screens/auth/Signin'); }, [authLoading, user, router]);

  const [email, setEmail] = useState('');
  const [emailPwd, setEmailPwd] = useState('');
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailNote, setEmailNote] = useState<Note>(null);

  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdNote, setPwdNote] = useState<Note>(null);

  const [keyPwd, setKeyPwd] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyNote, setKeyNote] = useState<Note>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [delPwd, setDelPwd] = useState('');
  const [delConfirm, setDelConfirm] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delNote, setDelNote] = useState<Note>(null);

  useEffect(() => { if (user?.email) setEmail(user.email); }, [user?.email]);

  const post = async (body: Record<string, unknown>) => {
    const r = await authFetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { ok: r.ok, data: await r.json().catch(() => ({})) };
  };

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
    try { await navigator.clipboard.writeText(newKey); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  const deleteAccount = async () => {
    setDelNote(null);
    if (delConfirm !== 'DELETE') { setDelNote({ type: 'error', msg: 'Type DELETE to confirm.' }); return; }
    setDelBusy(true);
    const { ok, data } = await post({ action: 'deleteAccount', currentPassword: delPwd });
    setDelBusy(false);
    if (ok && data.success) {
      try { localStorage.removeItem('auth_token'); localStorage.removeItem('currentUser'); } catch { /* ignore */ }
      router.push('/screens/auth/Signin');
    } else setDelNote({ type: 'error', msg: data.message || 'Could not delete account.' });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: C.bg, color: C.text }}>
        <p className="text-sm" style={{ color: C.gold, letterSpacing: '0.18em' }}>REDIRECTING…</p>
      </div>
    );
  }

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16 };
  const noteEl = (n: Note) => n && (
    <p className="text-[12px] mt-1" style={{ color: n.type === 'success' ? C.green : C.red }}>{n.msg}</p>
  );

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]" style={{ background: C.bg }}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <div className="luxe-ambient-orb" style={{ background: '#A855F7', top: -200, left: -100 }} />
        <div className="luxe-ambient-orb" style={{ background: '#06B6D4', bottom: -200, right: -100 }} />
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)', borderColor: C.border }}>
          <FaCog style={{ color: C.gold }} />
          <h1 className="text-lg font-black uppercase tracking-widest">Settings</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Email */}
            <section className="p-6" style={card}>
              <div className="flex items-center gap-2.5 mb-5">
                <FaEnvelope style={{ color: C.gold }} size={14} />
                <h2 className="text-sm font-black uppercase tracking-widest">Change Email</h2>
              </div>
              <div className="space-y-4">
                <Field label="New email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                <Field label="Current password" type="password" value={emailPwd} onChange={setEmailPwd} placeholder="••••••••" />
                {noteEl(emailNote)}
                <button onClick={saveEmail} disabled={emailBusy} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                  {emailBusy && <AiOutlineLoading3Quarters className="animate-spin" size={12} />} Update Email
                </button>
              </div>
            </section>

            {/* Password */}
            <section className="p-6" style={card}>
              <div className="flex items-center gap-2.5 mb-5">
                <FaLock style={{ color: C.gold }} size={14} />
                <h2 className="text-sm font-black uppercase tracking-widest">Change Password</h2>
              </div>
              <div className="space-y-4">
                <Field label="Current password" type="password" value={curPwd} onChange={setCurPwd} placeholder="••••••••" />
                <Field label="New password" type="password" value={newPwd} onChange={setNewPwd} placeholder="At least 8 characters" />
                <Field label="Confirm new password" type="password" value={confirmPwd} onChange={setConfirmPwd} placeholder="••••••••" />
                {noteEl(pwdNote)}
                <button onClick={savePassword} disabled={pwdBusy} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                  {pwdBusy && <AiOutlineLoading3Quarters className="animate-spin" size={12} />} Update Password
                </button>
              </div>
            </section>

            {/* Private key */}
            <section className="p-6" style={card}>
              <div className="flex items-center gap-2.5 mb-2">
                <FaKey style={{ color: C.gold }} size={14} />
                <h2 className="text-sm font-black uppercase tracking-widest">Reset Private Key</h2>
              </div>
              <p className="text-xs mb-5" style={{ color: C.sub }}>
                Generates a new private key and invalidates the old one. You&apos;ll see the new key once — store it somewhere safe.
              </p>
              <div className="space-y-4">
                <Field label="Current password" type="password" value={keyPwd} onChange={setKeyPwd} placeholder="••••••••" />
                {newKey && (
                  <div className="p-3 rounded-lg flex items-center justify-between gap-3" style={{ background: '#0B0E11', border: `1px solid rgba(212,175,127,0.4)` }}>
                    <code className="text-[12px] break-all" style={{ color: C.gold }}>{newKey}</code>
                    <button onClick={copyKey} className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,127,0.12)', color: C.gold }} title="Copy">
                      {copied ? <FaCheckCircle size={13} /> : <FaCopy size={12} />}
                    </button>
                  </div>
                )}
                {noteEl(keyNote)}
                <button onClick={resetKey} disabled={keyBusy} className="px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                  style={{ color: C.gold, border: `1px solid rgba(212,175,127,0.4)` }}>
                  {keyBusy && <AiOutlineLoading3Quarters className="animate-spin" size={12} />} Reset Private Key
                </button>
              </div>
            </section>

            {/* Danger zone — delete account */}
            <section className="p-6" style={{ background: 'rgba(255,61,113,0.05)', border: '1px solid rgba(255,61,113,0.3)', borderRadius: 16 }}>
              <div className="flex items-center gap-2.5 mb-2">
                <FaTrashAlt style={{ color: C.red }} size={14} />
                <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: C.red }}>Delete Account</h2>
              </div>
              <p className="text-xs mb-5" style={{ color: C.sub }}>
                Permanently deletes your account and all associated data — balances, holdings, orders, tickets and history. This cannot be undone.
              </p>
              <div className="space-y-4">
                <Field label="Current password" type="password" value={delPwd} onChange={setDelPwd} placeholder="••••••••" />
                <Field label='Type "DELETE" to confirm' value={delConfirm} onChange={setDelConfirm} placeholder="DELETE" />
                {noteEl(delNote)}
                <button
                  onClick={deleteAccount}
                  disabled={delBusy || delConfirm !== 'DELETE'}
                  className="px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(255,61,113,0.15)', color: C.red, border: '1px solid rgba(255,61,113,0.45)' }}
                >
                  {delBusy && <AiOutlineLoading3Quarters className="animate-spin" size={12} />} Delete My Account
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
