'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { authFetch } from '@/lib/clientAuth';
import {
  FaHeadset,
  FaPaperPlane,
  FaPaperclip,
  FaPlus,
  FaTimes,
  FaInbox,
  FaUser,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const C = {
  bg: '#06090F',
  border: 'rgba(255,255,255,0.08)',
  gold: '#D4AF7F',
  text: '#F5F1EA',
  sub: '#8F9BB3',
  cyan: '#06B6D4',
  green: '#00C853',
};
const GRAD = 'linear-gradient(135deg, #6366F1 0%, #A855F7 55%, #EC4899 100%)';
const CATEGORIES = ['Financial Strategist', 'Deposit', 'Withdrawal', 'Trade', 'Airdrop'];

/** Pull [[img:URL]] markers out of a stored message body. */
function parseContent(raw: string): { text: string; imgs: string[] } {
  const imgs: string[] = [];
  const text = (raw || '')
    .replace(/\[\[img:([^\]]+)\]\]/g, (_m, u) => {
      imgs.push(u);
      return '';
    })
    .trim();
  return { text, imgs };
}

/** Web3 support hero — glowing hex chat-token wired to a small support network. */
function SupportHero({ size = 240 }: { size?: number }) {
  const node = (x: number, y: number, ring: string) => (
    <g key={`${x}-${y}`}>
      <circle cx={x} cy={y} r="17" fill="url(#shNode)" stroke={ring} strokeWidth="1.4" />
      <circle cx={x} cy={y - 4} r="4.2" fill="rgba(255,255,255,0.92)" />
      <path d={`M${x - 7} ${y + 9} a 7 6 0 0 1 14 0 Z`} fill="rgba(255,255,255,0.92)" />
    </g>
  );
  return (
    <svg viewBox="0 0 280 200" width={size} role="img" aria-label="Support network">
      <defs>
        <radialGradient id="shGlow" cx="50%" cy="44%" r="60%">
          <stop offset="0%" stopColor="rgba(168,85,247,0.5)" /><stop offset="100%" stopColor="rgba(168,85,247,0)" />
        </radialGradient>
        <radialGradient id="shGlow2" cx="76%" cy="72%" r="55%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.4)" /><stop offset="100%" stopColor="rgba(6,182,212,0)" />
        </radialGradient>
        <linearGradient id="shHex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" /><stop offset="55%" stopColor="#A855F7" /><stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <radialGradient id="shNode" cx="34%" cy="28%" r="85%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" /><stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="92" rx="125" ry="82" fill="url(#shGlow)" />
      <ellipse cx="206" cy="134" rx="92" ry="60" fill="url(#shGlow2)" />
      <g stroke="rgba(168,85,247,0.4)" strokeWidth="1.4" strokeDasharray="2 6" fill="none" strokeLinecap="round">
        <path d="M140 104 L58 58" /><path d="M140 104 L224 60" /><path d="M140 104 L214 140" />
      </g>
      <ellipse cx="140" cy="152" rx="40" ry="8" fill="rgba(0,0,0,0.30)" />
      <path d="M140 66 L176 87 L176 129 L140 150 L104 129 L104 87 Z" fill="url(#shHex)" opacity="0.16" />
      <path d="M140 66 L176 87 L176 129 L140 150 L104 129 L104 87 Z" fill="none" stroke="url(#shHex)" strokeWidth="2" />
      <g>
        <rect x="118" y="95" width="44" height="27" rx="8" fill="#fff" opacity="0.95" />
        <path d="M130 122 l0 9 9 -9 Z" fill="#fff" opacity="0.95" />
        <circle cx="129" cy="108" r="3" fill="#A855F7" />
        <circle cx="140" cy="108" r="3" fill="#A855F7" />
        <circle cx="151" cy="108" r="3" fill="#A855F7" />
      </g>
      {node(58, 58, '#A855F7')}
      {node(224, 60, '#06B6D4')}
      {node(214, 140, '#D4AF7F')}
    </svg>
  );
}

interface TicketRow {
  id: number;
  subject: string;
  status: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: { sender: string; content: string; timestamp: string } | null;
}
interface Msg {
  id: number;
  sender: 'user' | 'support';
  message: string;
  createdAt: string;
}

export default function SupportClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<number | null>(user?.id ?? null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activeSubject, setActiveSubject] = useState('');
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [composing, setComposing] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [draft, setDraft] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [reply, setReply] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* Resolve a numeric userId for send-message. */
  useEffect(() => {
    if (user?.id) { setUserId(user.id); return; }
    try {
      const s = localStorage.getItem('currentUser');
      if (s) { const u = JSON.parse(s); if (u?.id) { setUserId(u.id); return; } }
    } catch { /* ignore */ }
    if (user?.email) {
      fetch(`/api/user/simple?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { if (d?.id) setUserId(d.id); })
        .catch(() => {});
    }
  }, [user]);

  const loadTickets = useCallback(async () => {
    try {
      const r = await authFetch('/api/support/get-tickets');
      const d = await r.json();
      if (d?.tickets) setTickets(d.tickets);
    } catch { /* ignore */ } finally {
      setLoadingTickets(false);
    }
  }, []);
  useEffect(() => {
    loadTickets();
    const t = setInterval(loadTickets, 10000);
    return () => clearInterval(t);
  }, [loadTickets]);

  useEffect(() => {
    const p = searchParams.get('ticketId');
    if (p && !isNaN(Number(p))) setActiveId(Number(p));
  }, [searchParams]);

  const loadMessages = useCallback(async (id: number) => {
    try {
      const r = await fetch(`/api/support/get-messages?ticketId=${id}`);
      const d = await r.json();
      // If support resolved it, drop the user out of the thread.
      if (d?.ticket?.status === 'resolved') {
        setActiveId(null);
        setMessages([]);
        loadTickets();
        return;
      }
      if (d?.messages) setMessages(d.messages);
      if (d?.ticket?.subject) setActiveSubject(d.ticket.subject);
    } catch { /* ignore */ }
  }, [loadTickets]);
  useEffect(() => {
    if (activeId == null) { setMessages([]); return; }
    loadMessages(activeId);
    const t = setInterval(() => loadMessages(activeId), 8000);
    return () => clearInterval(t);
  }, [activeId, loadMessages]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const uploadImage = async (f: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', f);
    const r = await authFetch('/api/support/upload', { method: 'POST', body: fd });
    const d = await r.json();
    if (r.ok && d?.url) return d.url as string;
    throw new Error(d?.message || 'Image upload failed');
  };

  const createTicket = async () => {
    setError(null);
    if (!draft.trim() && !file) { setError('Add a message or attach an image.'); return; }
    setSending(true);
    try {
      let content = draft.trim();
      if (file) { const url = await uploadImage(file); content = (content ? content + '\n' : '') + `[[img:${url}]]`; }
      const r = await authFetch('/api/support/create-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: category, message: content }),
      });
      const d = await r.json();
      if (r.ok && d?.ticket) {
        setComposing(false); setDraft(''); setFile(null); setCategory(CATEGORIES[0]);
        await loadTickets();
        setActiveId(d.ticket.id);
      } else setError(d?.error || d?.message || 'Could not create ticket.');
    } catch (e: any) {
      setError(e?.message || 'Could not create ticket.');
    } finally { setSending(false); }
  };

  const sendReply = async () => {
    if (activeId == null) return;
    if (!reply.trim() && !replyFile) return;
    if (userId == null) { setError('Session not ready — please refresh.'); return; }
    setSending(true); setError(null);
    try {
      let content = reply.trim();
      if (replyFile) { const url = await uploadImage(replyFile); content = (content ? content + '\n' : '') + `[[img:${url}]]`; }
      const r = await fetch('/api/support/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: activeId, senderId: userId, message: content }),
      });
      const d = await r.json();
      if (r.ok) { setReply(''); setReplyFile(null); loadMessages(activeId); }
      else setError(d?.error || 'Could not send message.');
    } catch (e: any) {
      setError(e?.message || 'Could not send message.');
    } finally { setSending(false); }
  };

  const Bubble = ({ m }: { m: Msg }) => {
    // Messages YOU send sit on the right; messages received from support/admin
    // sit on the left — with distinct avatars and bubble colors.
    const own = m.sender === 'user';
    const { text, imgs } = parseContent(m.message);
    return (
      <div className="flex items-end gap-2" style={{ flexDirection: own ? 'row-reverse' : 'row' }}>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={own
            ? { background: GRAD, color: '#fff' }
            : { background: 'rgba(6,182,212,0.14)', color: C.cyan, border: `1px solid ${C.border}` }}
        >
          {own ? <FaUser size={11} /> : <FaHeadset size={11} />}
        </div>
        <div
          className="max-w-[74%] px-4 py-2.5 rounded-2xl"
          style={
            own
              ? { background: GRAD, color: '#fff', borderBottomRightRadius: 6, boxShadow: '0 6px 18px -8px rgba(168,85,247,0.6)' }
              : { background: 'rgba(255,255,255,0.05)', color: C.text, border: `1px solid ${C.border}`, borderBottomLeftRadius: 6 }
          }
        >
          {text && <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{text}</p>}
          {imgs.map((u) => (
            <a key={u} href={u} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="attachment" className="mt-2 rounded-lg max-h-56 object-cover" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
            </a>
          ))}
          <p className="text-[9px] mt-1.5" style={{ color: own ? 'rgba(255,255,255,0.7)' : C.sub }}>
            {own ? 'You' : 'Support'} · {new Date(m.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]" style={{ background: C.bg }}>
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
        <div className="luxe-ambient-orb" style={{ background: '#A855F7', top: -180, right: -120 }} />
        <div className="luxe-ambient-orb" style={{ background: '#06B6D4', bottom: -180, left: -140 }} />
        <header
          className="sticky top-0 z-30 h-16 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)', borderColor: C.border }}
        >
          <div className="flex items-center gap-3">
            <FaHeadset style={{ color: C.gold }} />
            <h1 className="text-lg font-black uppercase tracking-widest">Support</h1>
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded" style={{ background: 'rgba(168,85,247,0.12)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.3)' }}>Desk</span>
          </div>
          <button
            onClick={() => { setComposing(true); setActiveId(null); setError(null); }}
            className="luxe-grad-purple-pink luxe-neumorphic text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <FaPlus size={10} /> New Ticket
          </button>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[320px_1fr] relative z-10">
          {/* ── Ticket list ─────────────────────────────────── */}
          <aside className="border-r overflow-y-auto" style={{ borderColor: C.border }}>
            {loadingTickets ? (
              <div className="p-8 flex justify-center"><AiOutlineLoading3Quarters className="animate-spin" style={{ color: C.gold }} /></div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-sm flex flex-col items-center gap-3" style={{ color: C.sub }}>
                <FaInbox size={26} style={{ color: C.gold, opacity: 0.6 }} />
                No open tickets yet.
              </div>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveId(t.id); setComposing(false); }}
                  className="w-full text-left p-4 border-b transition-colors hover:bg-white/5"
                  style={{ borderColor: C.border, background: activeId === t.id ? 'rgba(168,85,247,0.10)' : undefined }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm truncate">{t.subject}</span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: C.cyan, background: 'rgba(6,182,212,0.12)' }}>{t.status}</span>
                  </div>
                  {t.lastMessage && (
                    <p className="text-[11px] mt-1 truncate" style={{ color: C.sub }}>
                      {t.lastMessage.sender === 'user' ? 'You: ' : 'Support: '}
                      {parseContent(t.lastMessage.content).text || '📎 Image'}
                    </p>
                  )}
                </button>
              ))
            )}
          </aside>

          {/* ── Right pane ──────────────────────────────────── */}
          <main className="flex flex-col min-h-0">
            {composing ? (
              <div className="p-5 sm:p-8 max-w-2xl w-full mx-auto overflow-y-auto">
                <h2 className="text-xl font-black mb-1">Open a support ticket</h2>
                <p className="text-sm mb-6" style={{ color: C.sub }}>Pick a topic and describe your issue. You can attach a screenshot.</p>

                <label className="text-[10px] uppercase font-bold tracking-widest block mb-2" style={{ color: C.gold }}>Subject</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mb-5 px-3 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: '#0B0E11', border: `1px solid ${C.border}`, color: C.text }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: '#0B0E11' }}>{c}</option>)}
                </select>

                <label className="text-[10px] uppercase font-bold tracking-widest block mb-2" style={{ color: C.gold }}>Message</label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={6}
                  placeholder="Describe your issue…"
                  className="w-full px-3 py-3 rounded-lg text-sm resize-none"
                  style={{ background: '#0B0E11', border: `1px solid ${C.border}`, color: C.text }}
                />

                <div className="flex items-center gap-3 mt-3">
                  <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest cursor-pointer px-3 py-2 rounded-lg" style={{ color: C.gold, border: `1px solid ${C.border}` }}>
                    <FaPaperclip size={11} /> {file ? 'Change image' : 'Attach image'}
                    <input type="file" accept="image/jpeg,image/png" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  {file && (
                    <span className="text-[11px] flex items-center gap-2" style={{ color: C.sub }}>
                      {file.name}
                      <button onClick={() => setFile(null)} style={{ color: '#FF3D71' }}><FaTimes size={10} /></button>
                    </span>
                  )}
                </div>

                {error && <p className="text-[12px] mt-3" style={{ color: '#FF3D71' }}>{error}</p>}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setComposing(false); setError(null); }} className="px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase" style={{ border: `1px solid ${C.border}`, color: C.sub }}>Cancel</button>
                  <button onClick={createTicket} disabled={sending} className="luxe-grad-purple-pink luxe-neumorphic text-white px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                    {sending && <AiOutlineLoading3Quarters className="animate-spin" size={12} />} Submit Ticket
                  </button>
                </div>
              </div>
            ) : activeId == null ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center p-8">
                <SupportHero size={240} />
                <div>
                  <h3 className="text-lg font-black" style={{ color: C.text }}>How can we help?</h3>
                  <p className="text-sm mt-1" style={{ color: C.sub }}>Pick a conversation on the left, or open a new ticket.</p>
                </div>
                <button onClick={() => { setComposing(true); setActiveId(null); setError(null); }} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                  <FaPlus size={10} /> New Ticket
                </button>
              </div>
            ) : (
              <>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border, background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em]" style={{ color: C.gold }}>Ticket #{activeId}</p>
                    <h3 className="text-sm font-black">{activeSubject}</h3>
                  </div>
                </div>

                <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
                  {messages.length === 0 && <p className="text-center text-sm" style={{ color: C.sub }}>No messages yet.</p>}
                  {messages.map((m) => <Bubble key={m.id} m={m} />)}
                </div>

                {error && <p className="px-5 text-[12px]" style={{ color: '#FF3D71' }}>{error}</p>}

                <div className="p-4 border-t flex items-end gap-3" style={{ borderColor: C.border, background: 'rgba(255,255,255,0.03)' }}>
                  <label className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer" style={{ color: C.gold, border: `1px solid ${C.border}` }} title="Attach image">
                    <FaPaperclip size={14} />
                    <input type="file" accept="image/jpeg,image/png" hidden onChange={(e) => setReplyFile(e.target.files?.[0] || null)} />
                  </label>
                  <div className="flex-1">
                    {replyFile && (
                      <div className="text-[11px] mb-1 flex items-center gap-2" style={{ color: C.sub }}>
                        {replyFile.name}
                        <button onClick={() => setReplyFile(null)} style={{ color: '#FF3D71' }}><FaTimes size={10} /></button>
                      </div>
                    )}
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                      rows={1}
                      placeholder="Type a message…"
                      className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                      style={{ background: '#0B0E11', border: `1px solid ${C.border}`, color: C.text }}
                    />
                  </div>
                  <button onClick={sendReply} disabled={sending} className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white disabled:opacity-50" style={{ background: GRAD }} title="Send">
                    {sending ? <AiOutlineLoading3Quarters className="animate-spin" size={14} /> : <FaPaperPlane size={13} />}
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
