'use client';

/**
 * Wire transfer panel — shared by the Deposit (addFunds) and Withdrawal pages.
 *
 * DEPOSIT: the user generates a wire account; nothing bank-specific is shown on
 *   screen — the panel simply routes them to support, which provides the wire
 *   instructions (the generated reference travels inside the ticket).
 *
 * WITHDRAWAL: the user types their own bank details and processes the payout;
 *   submitting opens a support ticket containing the details and the amount.
 */

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUniversity,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeadset,
  FaShieldAlt,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAuth } from '@/components/context/AuthContext';
import { authFetch } from '@/lib/clientAuth';

export interface WireTransferPanelProps {
  mode: 'deposit' | 'withdrawal';
  /** Human-readable amount the user is moving (e.g. "$1,500.00" / "0.50 BTC"). */
  amountText?: string;
  /** Called after a ticket has been created successfully. */
  onTicketCreated?: () => void;
}

interface WireFields {
  accountName: string;
  accountNumber: string;
  routing: string;
  swift: string;
  iban: string;
  bank: string;
  bankAddress: string;
  reference: string;
}

const EMPTY_FIELDS: WireFields = {
  accountName: '',
  accountNumber: '',
  routing: '',
  swift: '',
  iban: '',
  bank: '',
  bankAddress: '',
  reference: '',
};

/** Small stable hash so a given user always gets the same internal wire reference. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function alnum(seed: number, length: number): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  let x = seed;
  while (out.length < length) {
    x = (Math.imul(x, 48271) + 11) >>> 0;
    out += alphabet[x % alphabet.length];
  }
  return out.slice(0, length);
}

export default function WireTransferPanel({ mode, amountText, onTicketCreated }: WireTransferPanelProps) {
  const router = useRouter();
  const { user } = useAuth();

  const isDeposit = mode === 'deposit';
  const accent = isDeposit ? '#0095FF' : '#D4AF7F';
  const accentSoft = isDeposit ? 'rgba(0,149,255,0.10)' : 'rgba(212,175,127,0.10)';
  const accentBorder = isDeposit ? 'rgba(0,149,255,0.30)' : 'rgba(212,175,127,0.30)';

  // ── deposit: internal reference (never displayed) ──
  const [stage, setStage] = useState<'idle' | 'generating' | 'ready'>('idle');
  const reference = useMemo(
    () => `WIRE-${alnum(hash(`${user?.id ?? 'anon'}:${user?.email ?? 'guest'}`) + 37, 8)}`,
    [user?.id, user?.email],
  );

  // ── shared submission state ──
  const [submitStage, setSubmitStage] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  // ── withdrawal: user-entered bank details ──
  const [fields, setFields] = useState<WireFields>(EMPTY_FIELDS);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof WireFields, string>>>({});

  const generate = useCallback(() => {
    setStage('generating');
    window.setTimeout(() => setStage('ready'), 1600);
  }, []);

  /** Creates the support ticket that carries the wire context. */
  const submitWire = useCallback(
    async (payload: { subject: string; message: string }) => {
      setSubmitStage('sending');
      setMessage(null);
      try {
        const res = await authFetch('/api/support/create-ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setSubmitStage('error');
          setMessage(data?.error || 'Could not submit your wire request. Please try again.');
          return;
        }
        setSubmitStage('sent');
        setMessage('Wire request submitted — opening Support…');
        if (onTicketCreated) onTicketCreated();
        window.setTimeout(() => router.push('/support'), 800);
      } catch {
        setSubmitStage('error');
        setMessage('Could not submit your wire request. Please try again.');
      }
    },
    [router, onTicketCreated],
  );

  /** Deposit: nobody sees bank details here — support provides them. */
  const contactSupport = useCallback(() => {
    submitWire({
      subject: `Wire transfer deposit — ${reference}`,
      message: [
        'Wire transfer deposit request.',
        '',
        `Amount: ${amountText || 'not specified yet'}`,
        `Internal wire reference: ${reference}`,
        `Account holder: ${[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Account holder'}`,
        `Raised: ${new Date().toLocaleString('en-GB', { hour12: false })}`,
        '',
        'Please send the full wire instructions (beneficiary, account number, routing, SWIFT/BIC and reference), the collection window, and confirm the deposit once it lands.',
      ].join('\n'),
    });
  }, [submitWire, reference, amountText, user?.firstName, user?.lastName, user?.email]);

  /** Withdrawal: validate the details the user typed, then process the payout. */
  const processWireWithdrawal = useCallback(() => {
    const errors: Partial<Record<keyof WireFields, string>> = {};
    if (!fields.accountName.trim()) errors.accountName = 'Account name is required';
    if (!fields.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    if (!fields.bank.trim()) errors.bank = 'Bank name is required';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    submitWire({
      subject: `Wire withdrawal — ${amountText || 'amount not set'}`,
      message: [
        'Wire transfer payout request.',
        '',
        `Amount: ${amountText || 'not specified yet'}`,
        `Account name: ${fields.accountName.trim()}`,
        `Account number: ${fields.accountNumber.trim()}`,
        `Routing (ABA): ${fields.routing.trim() || '—'}`,
        `SWIFT / BIC: ${fields.swift.trim() || '—'}`,
        `IBAN: ${fields.iban.trim() || '—'}`,
        `Bank: ${fields.bank.trim()}`,
        `Bank address: ${fields.bankAddress.trim() || '—'}`,
        `Reference: ${fields.reference.trim() || '—'}`,
        `Raised: ${new Date().toLocaleString('en-GB', { hour12: false })}`,
        '',
        'Please process this wire payout and confirm the schedule.',
      ].join('\n'),
    });
  }, [fields, amountText, submitWire]);

  const inputStyle: React.CSSProperties = {
    background: '#0B0E11',
    border: '1px solid #404753',
    color: '#F0F2F5',
  };

  const renderField = (
    key: keyof WireFields,
    label: string,
    placeholder: string,
    required = false,
    mono = true,
  ) => (
    <div>
      <label
        className="block text-[10px] uppercase tracking-widest mb-1.5"
        style={{ color: '#5A6578' }}
      >
        {label} {required && <span style={{ color: accent }}>*</span>}
      </label>
      <input
        type="text"
        value={fields[key]}
        onChange={(e) => {
          setFields((prev) => ({ ...prev, [key]: e.target.value }));
          if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
        }}
        placeholder={placeholder}
        className={`w-full rounded-lg px-3.5 py-3 text-sm focus:outline-none ${mono ? 'font-mono' : ''}`}
        style={{
          ...inputStyle,
          borderColor: fieldErrors[key] ? 'rgba(255,61,113,0.6)' : '#404753',
        }}
      />
      {fieldErrors[key] && (
        <p className="mt-1.5 text-[10px]" style={{ color: '#FF3D71' }}>
          {fieldErrors[key]}
        </p>
      )}
    </div>
  );

  const sending = submitStage === 'sending';
  const sent = submitStage === 'sent';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#12161C', border: '1px solid #404753' }}>
      {/* Header */}
      <div className="p-5 sm:p-6 flex items-start justify-between gap-4" style={{ borderBottom: '1px solid #404753' }}>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded flex items-center justify-center shrink-0"
            style={{ background: accentSoft, border: `1px solid ${accentBorder}`, color: accent }}
          >
            <FaUniversity size={16} />
          </div>
          <div>
            <h4 className="text-base font-semibold" style={{ color: '#F0F2F5' }}>
              Wire transfer {isDeposit ? 'deposit' : 'payout'}
            </h4>
            <p className="text-xs mt-0.5" style={{ color: '#8F9BB3' }}>
              {isDeposit
                ? 'Send funds from your bank account to Kandella — support supplies the wire details.'
                : 'Enter your bank details and we will process the payout by wire.'}
            </p>
          </div>
        </div>
        <span
          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shrink-0"
          style={{ background: accentSoft, border: `1px solid ${accentBorder}`, color: accent }}
        >
          {amountText ? amountText : 'Amount not set'}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* ══════════════ DEPOSIT ══════════════ */}
        {isDeposit && stage === 'idle' && (
          <div className="text-center py-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: accentSoft, border: `1px solid ${accentBorder}`, color: accent }}
            >
              <FaUniversity size={20} />
            </div>
            <h5 className="text-sm font-bold mb-1" style={{ color: '#F0F2F5' }}>
              Continue with wire transfer
            </h5>
            <p className="text-xs max-w-md mx-auto leading-relaxed mb-5" style={{ color: '#8F9BB3' }}>
              We&apos;ll reserve a wire reference for this deposit and hand you over to the
              desk, who will send the exact account details to use.
            </p>
            <button
              type="button"
              onClick={generate}
              className="px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98]"
              style={{ background: accent, color: '#04121f' }}
            >
              Generate account number
            </button>
          </div>
        )}

        {isDeposit && stage === 'generating' && (
          <div className="text-center py-10">
            <AiOutlineLoading3Quarters className="animate-spin mx-auto mb-4" size={26} style={{ color: accent }} />
            <p className="text-sm font-semibold mb-1" style={{ color: '#F0F2F5' }}>
              Generating your wire reference…
            </p>
            <p className="text-xs" style={{ color: '#8F9BB3' }}>
              Reserving a reference and checking desk availability.
            </p>
            <div className="mt-5 h-1 w-56 max-w-full mx-auto rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '70%', background: accent, animation: 'wirePulse 1.4s ease-in-out infinite' }}
              />
            </div>
            <style>{`@keyframes wirePulse { 0%,100% { opacity: .45 } 50% { opacity: 1 } }`}</style>
          </div>
        )}

        {isDeposit && stage === 'ready' && (
          <div className="p-6 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${accentBorder}` }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaHeadset size={13} style={{ color: accent }} />
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#dfe2eb' }}>
                Contact support for wire details
              </p>
            </div>
            <p className="text-[12px] leading-relaxed max-w-md mx-auto mb-5" style={{ color: '#8F9BB3' }}>
              Wire deposits are arranged by our desk. Contact support and they will provide the
              account details, the collection window and confirm your deposit once it lands.
            </p>
            <button
              type="button"
              onClick={contactSupport}
              disabled={sending || sent}
              className="px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
              style={{ background: accent, color: '#04121f' }}
            >
              {sending && <AiOutlineLoading3Quarters className="animate-spin" size={11} />}
              {sent && <FaCheckCircle size={11} />}
              {sending ? 'Opening ticket…' : sent ? 'Ticket opened' : 'Contact Support'}
            </button>

            {message && (
              <p
                className="mt-3 text-[11px] font-medium flex items-center justify-center gap-1.5"
                style={{ color: submitStage === 'error' ? '#FF3D71' : '#00C853' }}
              >
                {submitStage === 'error' && <FaExclamationTriangle size={10} />}
                {message}
              </p>
            )}

            <p className="mt-3 text-[10px] flex items-center justify-center gap-1.5" style={{ color: '#5A6578' }}>
              <FaShieldAlt size={9} />
              Never send funds to an unverified account. Always confirm details with support first.
            </p>
          </div>
        )}

        {/* ══════════════ WITHDRAWAL ══════════════ */}
        {!isDeposit && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {renderField('accountName', 'Account name', 'Name on the bank account', true, false)}
              {renderField('accountNumber', 'Account number', 'e.g. 0969432989', true)}
              {renderField('routing', 'Routing (ABA)', 'e.g. 723056343')}
              {renderField('swift', 'SWIFT / BIC', 'e.g. KDLAB4TL')}
              {renderField('iban', 'IBAN', 'e.g. GB14KDLA92383076721854')}
              {renderField('bank', 'Bank', 'Bank name', true, false)}
            </div>
            <div className="space-y-3.5">
              {renderField('bankAddress', 'Bank address', 'Street, city, postcode, country', false, false)}
              {renderField('reference', 'Reference', 'Optional payment reference')}
            </div>

            <div className="p-4 rounded-xl" style={{ background: accentSoft, border: `1px solid ${accentBorder}` }}>
              <p className="text-[11px] leading-relaxed" style={{ color: '#8F9BB3' }}>
                Check every detail before processing — wire payouts are final once the desk releases
                them. Support confirms the payout schedule with you.
              </p>
            </div>

            <button
              type="button"
              onClick={processWireWithdrawal}
              disabled={sending || sent}
              className="w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: accent, color: '#04121f' }}
            >
              {sending && <AiOutlineLoading3Quarters className="animate-spin" size={11} />}
              {sent && <FaCheckCircle size={11} />}
              {sending ? 'Processing…' : sent ? 'Wire withdrawal submitted' : 'Process wire withdrawal'}
            </button>

            {message && (
              <p
                className="text-[11px] font-medium flex items-center justify-center gap-1.5"
                style={{ color: submitStage === 'error' ? '#FF3D71' : '#00C853' }}
              >
                {submitStage === 'error' && <FaExclamationTriangle size={10} />}
                {message}
              </p>
            )}

            <p className="text-[10px] flex items-center justify-center gap-1.5 text-center" style={{ color: '#5A6578' }}>
              <FaShieldAlt size={9} />
              Wire payouts are verified by support before release.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
