'use client';

/**
 * Kandella — Admin Dashboard.
 *
 * Tabs: Overview (analytics) · Users (manage/suspend/edit) · Transactions
 * (audit + approve pending) · Support (inbox + reply) · Audit (admin log).
 * All data comes from /api/admin/* which require an authenticated admin
 * (role=admin). Wrapped by AdminAuth (server-verified).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '@/lib/clientAuth';

const C = {
  bg: '#06090F', panel: '#0E141F', border: 'rgba(255,255,255,0.08)',
  gold: '#D4AF7F', text: '#F5F1EA', sub: '#8F9BB3', green: '#00C853', red: '#FF3D71', cyan: '#06B6D4',
};

// Never throws — always resolves to an object. On a non-OK / non-JSON response
// it returns { success:false, message } so callers can surface the real error
// instead of silently hanging on "Loading…".
async function safeJson(res: Response) {
  const text = await res.text().catch(() => '');
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { success: false, message: text.slice(0, 200) || 'Non-JSON response' }; }
  if (!res.ok) {
    json.success = false;
    json.message = json.message || `HTTP ${res.status}`;
  }
  return json;
}
const api = {
  get: async (p: string) => {
    try {
      return await safeJson(await fetch(p, { headers: authHeaders(), cache: 'no-store' }));
    } catch (e) {
      return { success: false, message: e instanceof Error ? e.message : 'Network error' };
    }
  },
  patch: async (p: string, body: unknown) => {
    try {
      return await safeJson(await fetch(p, { method: 'PATCH', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }));
    } catch (e) {
      return { success: false, message: e instanceof Error ? e.message : 'Network error' };
    }
  },
  post: async (p: string, body: unknown) => {
    try {
      return await safeJson(await fetch(p, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }));
    } catch (e) {
      return { success: false, message: e instanceof Error ? e.message : 'Network error' };
    }
  },
};

const money = (n: number) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (n: number) => Number(n || 0).toLocaleString('en-US');
const when = (s: string) => new Date(s).toLocaleString();

type Tab = 'overview' | 'approvals' | 'users' | 'transactions' | 'support' | 'audit';

interface StatsPayload {
  stats: Record<string, number>;
  series: { day: string; signups: number; deposits: number; withdrawals: number }[];
}

export default function Dashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.replace('/aK3m9Xq/pZ2vR7nL4wQ1fB');
      return;
    }
    setAuthed(true);
  }, [router]);

  if (!authed) return <div className="min-h-screen bg-black" />;

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<StatsPayload | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    const r = await api.get('/api/admin/stats');
    if (r.success) { setData({ stats: r.stats, series: r.series }); setStatsErr(null); }
    else setStatsErr(r.message || 'Failed to load stats');
  }, []);
  useEffect(() => {
    loadStats();
    const t = setInterval(loadStats, 20000);
    return () => clearInterval(t);
  }, [loadStats]);

  // Phones only: keep the selected tab visible inside the horizontally
  // scrolling tab strip. Guarded to <768px so desktop scrolling is unchanged.
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});
  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    tabRefs.current[tab]?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [tab]);

  const s = data?.stats || {};
  const badges: Partial<Record<Tab, number>> = {
    approvals: (s.pendingDeposits || 0) + (s.pendingWithdrawals || 0),
    transactions: s.pendingTransactions || 0,
    support: s.openTickets || 0,
    users: s.newUsers7d || 0,
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text, fontFamily: 'var(--font-geist-stack)' }}>
      <header className="sticky top-0 z-20 px-4 md:px-6 h-16 flex items-center justify-between gap-3 border-b" style={{ background: 'rgba(6,9,15,0.85)', backdropFilter: 'blur(12px)', borderColor: C.border }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg font-black tracking-tight">Admin</span>
          {/* Badge is dropped only on very narrow phones; sm+ is unchanged. */}
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.25em] px-2 py-1 rounded" style={{ background: 'rgba(212,175,127,0.12)', color: C.gold }}>Control Center</span>
        </div>
        <a href="/dashboard" className="text-[11px] font-bold uppercase tracking-widest inline-flex items-center min-h-[44px] px-2 -mr-2 md:min-h-0 md:px-0 md:mr-0" style={{ color: C.sub }}>← Exit</a>
      </header>

      <nav className="px-4 md:px-6 flex gap-1 border-b overflow-x-auto" style={{ borderColor: C.border }}>
        {(['overview', 'approvals', 'users', 'transactions', 'support', 'audit'] as Tab[]).map((t) => {
          const n = badges[t] || 0;
          return (
            <button key={t} ref={(el) => { tabRefs.current[t] = el; }} onClick={() => setTab(t)}
              className="min-h-[44px] md:min-h-0 px-3 md:px-4 py-3 text-[12px] font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-2"
              style={tab === t ? { color: C.gold, borderBottom: `2px solid ${C.gold}` } : { color: C.sub }}>
              {t}
              {n > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none" style={{ background: C.gold, color: C.bg }}>{n}</span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {tab === 'overview' && <Overview data={data} error={statsErr} onJump={setTab} />}
        {tab === 'approvals' && <Approvals />}
        {tab === 'users' && <Users />}
        {tab === 'transactions' && <Transactions />}
        {tab === 'support' && <Support />}
        {tab === 'audit' && <Audit />}
      </main>
    </div>
  );
}

interface PendingItem {
  id: number;
  amount: number;
  currency: string | null;
  address: string | null;
  createdAt: string;
  user: { email: string; username: string } | null;
}

function Approvals() {
  const [deposits, setDeposits] = useState<PendingItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await api.get('/api/admin/pending');
    setDeposits(r.pendingDeposits || []);
    setWithdrawals(r.pendingWithdrawals || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const act = async (kind: 'deposit' | 'withdrawal', id: number, action: 'approve' | 'reject') => {
    setBusy(`${kind}-${id}`);
    setMsg(null);
    const url =
      kind === 'deposit'
        ? `/api/addFunds/approve?depositId=${id}&action=${action}`
        : `/api/withdrawal/approve?withdrawalId=${id}&action=${action}`;
    const r = await api.get(url);
    setBusy(null);
    setMsg(r.success ? `${kind} #${id} ${action}d.` : (r.message || 'Action failed.'));
    load();
  };

  const Table = ({ kind, rows }: { kind: 'deposit' | 'withdrawal'; rows: PendingItem[] }) => (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      {/* Phones scroll the 6-column table sideways instead of squashing it;
          md+ keeps the original full-width table. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] md:min-w-0 text-left text-sm">
          <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
            <tr>{['User', 'Amount', 'Asset', 'Address', 'Date', 'Actions'].map((h) => (
              <th key={h} className="p-3 text-[10px] uppercase font-bold tracking-widest" style={{ color: C.gold }}>{h}</th>))}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center" style={{ color: C.sub }}>No pending {kind}s.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t" style={{ borderColor: C.border }}>
                <td className="p-3 text-[11px]" style={{ color: C.sub }}>{r.user?.email || '—'}</td>
                <td className="p-3 font-mono whitespace-nowrap md:whitespace-normal">{money(r.amount)}</td>
                <td className="p-3 font-bold uppercase text-[11px]">{r.currency || 'USDT'}</td>
                <td className="p-3 text-[11px] font-mono max-w-[180px] truncate" style={{ color: C.sub }} title={r.address || ''}>{r.address || '—'}</td>
                <td className="p-3 text-[11px] font-mono whitespace-nowrap md:whitespace-normal" style={{ color: C.sub }}>{when(r.createdAt)}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button disabled={busy === `${kind}-${r.id}`} onClick={() => act(kind, r.id, 'approve')}
                      className="min-h-[44px] md:min-h-0 px-3 md:px-2.5 py-2 md:py-1 text-[11px] md:text-[10px] font-bold uppercase rounded disabled:opacity-50 whitespace-nowrap"
                      style={{ background: 'rgba(0,200,83,0.14)', color: C.green }}>
                      {busy === `${kind}-${r.id}` ? '…' : 'Approve'}
                    </button>
                    <button disabled={busy === `${kind}-${r.id}`} onClick={() => act(kind, r.id, 'reject')}
                      className="min-h-[44px] md:min-h-0 px-3 md:px-2.5 py-2 md:py-1 text-[11px] md:text-[10px] font-bold uppercase rounded disabled:opacity-50 whitespace-nowrap"
                      style={{ background: 'rgba(255,61,113,0.14)', color: C.red }}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <p style={{ color: C.sub }}>Loading…</p>;

  return (
    <div className="space-y-8">
      {msg && <p className="text-[12px]" style={{ color: C.cyan }}>{msg}</p>}
      <section>
        <h3 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: C.gold }}>
          Pending Deposits ({deposits.length})
        </h3>
        <Table kind="deposit" rows={deposits} />
      </section>
      <section>
        <h3 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: C.gold }}>
          Pending Withdrawals ({withdrawals.length})
        </h3>
        <Table kind="withdrawal" rows={withdrawals} />
      </section>
    </div>
  );
}

type SeriesPt = { day: string; signups: number; deposits: number; withdrawals: number };

/** Dependency-free area/line chart: deposits vs withdrawals. Hover a point for the value. */
function TrendChart({ series }: { series: SeriesPt[] }) {
  const W = 560, H = 220, PL = 46, PR = 12, PT = 12, PB = 26;
  const n = series.length || 1;
  const max = Math.max(1, ...series.map((d) => Math.max(d.deposits, d.withdrawals)));
  const xs = (i: number) => PL + (n <= 1 ? 0 : (i / (n - 1)) * (W - PL - PR));
  const ys = (v: number) => (H - PB) - (v / max) * (H - PT - PB);
  const line = (key: 'deposits' | 'withdrawals') =>
    series.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs(i).toFixed(1)},${ys(d[key]).toFixed(1)}`).join(' ');
  const area = (key: 'deposits' | 'withdrawals') =>
    `${line(key)} L${xs(n - 1).toFixed(1)},${H - PB} L${xs(0).toFixed(1)},${H - PB} Z`;
  const ticks = [0, 0.5, 1].map((f) => ({ v: max * f, y: ys(max * f) }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="w-full h-auto" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="adDep" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00C853" stopOpacity="0.35" /><stop offset="100%" stopColor="#00C853" stopOpacity="0" /></linearGradient>
        <linearGradient id="adWd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF3D71" stopOpacity="0.3" /><stop offset="100%" stopColor="#FF3D71" stopOpacity="0" /></linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PL} y1={t.y} x2={W - PR} y2={t.y} stroke="rgba(255,255,255,0.06)" />
          <text x={PL - 6} y={t.y + 3} textAnchor="end" fontSize="9" fill={C.sub}>{Math.round(t.v).toLocaleString()}</text>
        </g>
      ))}
      {series.length > 1 && <path d={area('deposits')} fill="url(#adDep)" />}
      {series.length > 1 && <path d={area('withdrawals')} fill="url(#adWd)" />}
      <path d={line('deposits')} fill="none" stroke="#00C853" strokeWidth="2" />
      <path d={line('withdrawals')} fill="none" stroke="#FF3D71" strokeWidth="2" />
      {series.map((d, i) => (
        <g key={i}>
          <circle cx={xs(i)} cy={ys(d.deposits)} r="2.6" fill="#00C853"><title>{d.day} · Deposits {money(d.deposits)}</title></circle>
          <circle cx={xs(i)} cy={ys(d.withdrawals)} r="2.6" fill="#FF3D71"><title>{d.day} · Withdrawals {money(d.withdrawals)}</title></circle>
        </g>
      ))}
      {series.map((d, i) => (i % 3 === 0 || i === n - 1) ? (
        <text key={`x${i}`} x={xs(i)} y={H - 8} textAnchor="middle" fontSize="9" fill={C.sub}>{d.day}</text>
      ) : null)}
    </svg>
  );
}

/** Dependency-free bar chart: daily signups. Hover a bar for the count. */
function SignupChart({ series }: { series: SeriesPt[] }) {
  const W = 560, H = 220, PL = 30, PR = 12, PT = 12, PB = 26;
  const n = series.length || 1;
  const max = Math.max(1, ...series.map((d) => d.signups));
  const step = (W - PL - PR) / n;
  const bw = step * 0.6;
  const ys = (v: number) => (H - PB) - (v / max) * (H - PT - PB);
  const ticks = [0, 0.5, 1].map((f) => ({ v: Math.round(max * f), y: ys(max * f) }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="w-full h-auto" style={{ display: 'block' }}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PL} y1={t.y} x2={W - PR} y2={t.y} stroke="rgba(255,255,255,0.06)" />
          <text x={PL - 6} y={t.y + 3} textAnchor="end" fontSize="9" fill={C.sub}>{t.v}</text>
        </g>
      ))}
      {series.map((d, i) => {
        const x = PL + step * i + (step - bw) / 2;
        const yTop = ys(d.signups);
        return <rect key={i} x={x} y={yTop} width={bw} height={Math.max(0, (H - PB) - yTop)} rx="3" fill="#06B6D4"><title>{d.day} · {d.signups} signups</title></rect>;
      })}
      {series.map((d, i) => (i % 3 === 0 || i === n - 1) ? (
        <text key={`x${i}`} x={PL + step * i + step / 2} y={H - 8} textAnchor="middle" fontSize="9" fill={C.sub}>{d.day}</text>
      ) : null)}
    </svg>
  );
}

function Overview({ data, error, onJump }: { data: StatsPayload | null; error?: string | null; onJump: (t: Tab) => void }) {
  if (!data) {
    return error
      ? <p style={{ color: C.red }}>Couldn&apos;t load overview: {error}</p>
      : <p style={{ color: C.sub }}>Loading…</p>;
  }
  const s = data.stats;
  const series = data.series || [];

  const kpis: { label: string; value: string; accent: string }[] = [
    { label: 'Total Users', value: num(s.totalUsers), accent: C.gold },
    { label: 'New (7d)', value: num(s.newUsers7d), accent: C.cyan },
    { label: 'Suspended', value: num(s.suspendedUsers), accent: C.red },
    { label: 'Total Deposited', value: money(s.totalDeposited), accent: C.green },
    { label: 'Total Withdrawn', value: money(s.totalWithdrawn), accent: C.red },
    { label: 'Active Investments', value: `${num(s.activeInvestments)} · ${money(s.totalInvested)}`, accent: C.gold },
  ];

  const pending = [
    { label: 'Pending Deposits', value: s.pendingDeposits || 0, tab: 'approvals' as Tab, color: C.gold },
    { label: 'Pending Withdrawals', value: s.pendingWithdrawals || 0, tab: 'approvals' as Tab, color: C.cyan },
    { label: 'Open Tickets', value: s.openTickets || 0, tab: 'support' as Tab, color: C.red },
  ];

  return (
    <div className="space-y-6">
      {/* Pending action cards (clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pending.map((p) => (
          <button
            key={p.label}
            onClick={() => onJump(p.tab)}
            className="text-left rounded-xl p-4 sm:p-5 transition-all hover:-translate-y-0.5"
            style={{ background: p.value > 0 ? `${p.color}14` : C.panel, border: `1px solid ${p.value > 0 ? p.color : C.border}` }}
          >
            <p className="text-[10px] uppercase font-bold tracking-[0.18em]" style={{ color: C.sub }}>{p.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-black" style={{ color: p.value > 0 ? p.color : C.text }}>{num(p.value)}</p>
              <span className="text-[10px] font-bold uppercase" style={{ color: p.color }}>Review →</span>
            </div>
          </button>
        ))}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <p className="text-[9px] uppercase font-bold tracking-[0.16em]" style={{ color: C.sub }}>{k.label}</p>
            <p className="text-lg font-black mt-1.5" style={{ color: k.accent }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 sm:p-5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
            <p className="text-[11px] uppercase font-black tracking-widest" style={{ color: C.gold }}>Deposits vs Withdrawals · 14d</p>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
              <span className="flex items-center gap-1.5" style={{ color: C.green }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: C.green }} />Deposits</span>
              <span className="flex items-center gap-1.5" style={{ color: C.red }}><span className="w-2.5 h-2.5 rounded-full" style={{ background: C.red }} />Withdrawals</span>
            </div>
          </div>
          <TrendChart series={series} />
        </div>

        <div className="rounded-xl p-4 sm:p-5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <p className="text-[11px] uppercase font-black tracking-widest mb-4" style={{ color: C.gold }}>New Signups · 14d</p>
          <SignupChart series={series} />
        </div>
      </div>
    </div>
  );
}

interface AdminUser {
  id: number; firstName: string; lastName: string; username: string; email: string;
  phone: string | null; role: string; status: string; mainBalance: number;
  interestBalance: number; totalDeposit: number; totalWithdrawals: number; totalReferrals: number; createdAt: string;
}

function Users() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async (query: string) => {
    setLoading(true);
    const r = await api.get(`/api/admin/users?q=${encodeURIComponent(query)}`);
    if (Array.isArray(r.users)) { setUsers(r.users); setTotal(r.total ?? r.users.length); setErr(null); }
    else { setUsers([]); setTotal(0); setErr(r.message || 'Failed to load users'); }
    setLoading(false);
  }, []);

  useEffect(() => { const t = setTimeout(() => load(q), 300); return () => clearTimeout(t); }, [q, load]);

  const toggleStatus = async (u: AdminUser) => {
    const next = u.status === 'suspended' ? 'active' : 'suspended';
    const r = await api.patch(`/api/admin/users/${u.id}`, { status: next });
    if (r.success) { setMsg(`${u.email} → ${next}`); load(q); } else setMsg(r.message || 'Failed');
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / email / username…"
          className="bg-black/40 border rounded-lg px-3 py-2 min-h-[44px] sm:min-h-0 text-sm w-full max-w-md" style={{ borderColor: C.border, color: C.text }} />
        <div className="flex items-center gap-3 flex-shrink-0">
          {msg && <span className="text-[11px]" style={{ color: C.cyan }}>{msg}</span>}
          <span className="text-[11px] whitespace-nowrap" style={{ color: C.sub }}>{num(total)} registered</span>
        </div>
      </div>
      {/* ── Phones (< md): one card per user ───────────────────────────────
          The 9-column table below pushes its Actions column (and therefore the
          Edit button) off-screen on a phone, so mobile gets a stacked card with
          a full-width 48px "Edit user" button that opens the same EditUser
          modal through the same setEditing state. ── */}
      <div className="md:hidden space-y-3">
        {loading && (
          <p className="rounded-xl p-6 text-center text-sm" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.sub }}>Loading…</p>
        )}
        {!loading && err && (
          <p className="rounded-xl p-6 text-center text-sm" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.red }}>Couldn&apos;t load users: {err}</p>
        )}
        {!loading && !err && users.length === 0 && (
          <p className="rounded-xl p-6 text-center text-sm" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.sub }}>No users found.</p>
        )}
        {users.map((u) => (
          <div key={u.id} className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <p className="font-bold truncate">{u.firstName} {u.lastName}</p>
            <p className="text-[11px] truncate" style={{ color: C.sub }}>{u.email}</p>
            <p className="text-[11px] truncate" style={{ color: C.sub }}>@{u.username} · ID #{u.id}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ color: u.role === 'admin' ? C.gold : C.sub, background: 'rgba(255,255,255,0.06)' }}>{u.role}</span>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ color: u.status === 'suspended' ? C.red : C.green, background: u.status === 'suspended' ? 'rgba(255,61,113,0.12)' : 'rgba(0,200,83,0.12)' }}>{u.status}</span>
            </div>
            <dl className="mt-3 space-y-1.5">
              {([
                ['Main balance', money(u.mainBalance)],
                ['Total deposit', money(u.totalDeposit)],
                ['Withdrawals', money(u.totalWithdrawals)],
                ['Referrals', num(u.totalReferrals)],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-[12px]">
                  <dt style={{ color: C.sub }}>{label}</dt>
                  <dd className="font-mono whitespace-nowrap">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[11px] font-mono mt-3" style={{ color: C.sub }}>Joined {when(u.createdAt)}</p>
            <button onClick={() => setEditing(u)}
              className="mt-3 w-full min-h-[48px] rounded-lg text-[12px] font-bold uppercase"
              style={{ background: 'rgba(212,175,127,0.14)', color: C.gold, border: `1px solid ${C.border}` }}>
              Edit user
            </button>
          </div>
        ))}
      </div>

      {/* ── md and up: the original 9-column table, unchanged ── */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
              <tr>{['User', 'Balance', 'Deposited', 'Withdrawn', 'Refs', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="p-3 text-[10px] uppercase font-bold tracking-widest" style={{ color: C.gold }}>{h}</th>))}</tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} className="p-6 text-center" style={{ color: C.sub }}>Loading…</td></tr>}
              {!loading && err && <tr><td colSpan={9} className="p-6 text-center" style={{ color: C.red }}>Couldn&apos;t load users: {err}</td></tr>}
              {!loading && !err && users.length === 0 && <tr><td colSpan={9} className="p-6 text-center" style={{ color: C.sub }}>No users found.</td></tr>}
              {users.map((u) => (
                <tr key={u.id} className="border-t" style={{ borderColor: C.border }}>
                  <td className="p-3">
                    <div className="font-bold">{u.firstName} {u.lastName}</div>
                    <div className="text-[11px]" style={{ color: C.sub }}>{u.email} · @{u.username}</div>
                  </td>
                  <td className="p-3 font-mono">{money(u.mainBalance)}</td>
                  <td className="p-3 font-mono">{money(u.totalDeposit)}</td>
                  <td className="p-3 font-mono">{money(u.totalWithdrawals)}</td>
                  <td className="p-3 font-mono">{u.totalReferrals}</td>
                  <td className="p-3"><span className="text-[10px] font-bold uppercase" style={{ color: u.role === 'admin' ? C.gold : C.sub }}>{u.role}</span></td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ color: u.status === 'suspended' ? C.red : C.green, background: u.status === 'suspended' ? 'rgba(255,61,113,0.12)' : 'rgba(0,200,83,0.12)' }}>{u.status}</span>
                  </td>
                  <td className="p-3 text-[11px] font-mono" style={{ color: C.sub }}>{when(u.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(u)} className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: C.text }}>Edit</button>
                      <button onClick={() => toggleStatus(u)} className="text-[10px] font-bold uppercase px-2 py-1 rounded"
                        style={u.status === 'suspended' ? { background: 'rgba(0,200,83,0.14)', color: C.green } : { background: 'rgba(255,61,113,0.14)', color: C.red }}>
                        {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editing && <EditUser user={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(q); }} />}
    </div>
  );
}

function EditUser({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, phone: user.phone || '', mainBalance: String(user.mainBalance), role: user.role });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setErr(null);
    const r = await api.patch(`/api/admin/users/${user.id}`, { ...form, mainBalance: Number(form.mainBalance) });
    setSaving(false);
    if (r.success) onSaved(); else setErr(r.message || 'Update failed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[88vh] overflow-y-auto" style={{ background: C.panel, border: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: C.gold }}>Edit User #{user.id}</h3>
        <div className="space-y-3">
          {([['firstName', 'First name'], ['lastName', 'Last name'], ['username', 'Username'], ['email', 'Email'], ['phone', 'Phone'], ['mainBalance', 'Main balance (USDT)']] as const).map(([k, label]) => (
            <div key={k}>
              <label className="text-[10px] uppercase font-bold tracking-widest" style={{ color: C.sub }}>{label}</label>
              <input value={(form as Record<string, string>)[k]} onChange={(e) => set(k, e.target.value)} className="w-full bg-black/40 border rounded-lg px-3 py-2 min-h-[44px] sm:min-h-0 text-sm mt-1" style={{ borderColor: C.border, color: C.text }} />
            </div>
          ))}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest" style={{ color: C.sub }}>Role</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)} className="w-full bg-black/40 border rounded-lg px-3 py-2 min-h-[44px] sm:min-h-0 text-sm mt-1" style={{ borderColor: C.border, color: C.text }}>
              <option value="user" style={{ background: C.panel }}>user</option>
              <option value="admin" style={{ background: C.panel }}>admin</option>
            </select>
          </div>
        </div>
        {err && <p className="text-[11px] mt-3" style={{ color: C.red }}>{err}</p>}
        {/* Phones stack the actions full-width; md+ keeps the original row. */}
        <div className="flex flex-col md:flex-row gap-2 mt-5">
          <button onClick={onClose} className="w-full md:w-auto md:flex-1 min-h-[48px] md:min-h-0 py-3 md:py-2.5 rounded-lg text-[11px] font-bold uppercase" style={{ background: 'rgba(255,255,255,0.06)', color: C.sub }}>Cancel</button>
          <button onClick={save} disabled={saving} className="w-full md:w-auto md:flex-1 min-h-[48px] md:min-h-0 py-3 md:py-2.5 rounded-lg text-[11px] font-black uppercase" style={{ background: C.gold, color: C.bg }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

interface AdminTx {
  id: number; type: string | null; amount: number; status: string; description: string | null;
  createdAt: string; user: { email: string; username: string } | null;
}

function Transactions() {
  const [type, setType] = useState('');
  const [rows, setRows] = useState<AdminTx[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get(`/api/admin/transactions?${type ? `type=${type}` : ''}`).then((r) => { setRows(r.transactions || []); setLoading(false); });
  }, [type]);
  const types = ['', 'Deposit', 'withdraw', 'trade', 'swap'];
  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {types.map((t) => (
          <button key={t || 'all'} onClick={() => setType(t)} className="min-h-[44px] md:min-h-0 text-[11px] font-bold uppercase px-3 py-1.5 rounded"
            style={type === t ? { background: C.gold, color: C.bg } : { background: 'rgba(255,255,255,0.05)', color: C.sub }}>{t || 'All'}</button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] md:min-w-0 text-left text-sm">
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
              <tr>{['User', 'Type', 'Amount', 'Status', 'Description', 'Date'].map((h) => (
                <th key={h} className="p-3 text-[10px] uppercase font-bold tracking-widest" style={{ color: C.gold }}>{h}</th>))}</tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-6 text-center" style={{ color: C.sub }}>Loading…</td></tr>}
              {!loading && rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center" style={{ color: C.sub }}>No transactions.</td></tr>}
              {rows.map((t) => (
                <tr key={t.id} className="border-t" style={{ borderColor: C.border }}>
                  <td className="p-3 text-[11px]" style={{ color: C.sub }}>{t.user?.email || '—'}</td>
                  <td className="p-3 font-bold uppercase text-[11px]">{t.type}</td>
                  <td className="p-3 font-mono whitespace-nowrap md:whitespace-normal">{money(t.amount)}</td>
                  <td className="p-3"><span className="text-[10px] font-bold uppercase whitespace-nowrap md:whitespace-normal" style={{ color: t.status === 'Success' ? C.green : t.status === 'Pending' ? C.gold : C.red }}>{t.status}</span></td>
                  <td className="p-3 text-[11px]" style={{ color: C.sub }}>{t.description}</td>
                  <td className="p-3 text-[11px] font-mono whitespace-nowrap md:whitespace-normal" style={{ color: C.sub }}>{when(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface AdminTicket {
  id: number; subject: string; status: string; createdAt: string;
  user: { email: string; username: string } | null;
  messages: { id: number; content: string; fromUser: boolean; createdAt: string }[];
}

function parseMsg(raw: string): { text: string; imgs: string[] } {
  const imgs: string[] = [];
  const text = (raw || '').replace(/\[\[img:([^\]]+)\]\]/g, (_m, u) => { imgs.push(u); return ''; }).trim();
  return { text, imgs };
}

function Support() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'open' | 'resolved'>('open');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const r = await api.get('/api/admin/support');
    if (Array.isArray(r.tickets)) setTickets(r.tickets);
    if (!silent) setLoading(false);
  }, []);
  // Poll so new user messages/tickets appear without a manual page refresh.
  useEffect(() => {
    load();
    const t = setInterval(() => load(true), 5000);
    return () => clearInterval(t);
  }, [load]);

  const replyTo = async (id: number) => {
    if (!reply.trim()) return;
    const r = await api.post(`/api/admin/support/${id}/reply`, { content: reply, status: 'pending' });
    if (r.success) { setReply(''); load(true); }
  };
  const resolve = async (id: number) => {
    const r = await api.post(`/api/admin/support/${id}/reply`, {
      content: reply.trim() || 'This ticket has been marked as resolved.',
      status: 'resolved',
    });
    if (r.success) { setReply(''); load(true); }
  };

  if (loading) return <p style={{ color: C.sub }}>Loading…</p>;

  const openCount = tickets.filter((t) => t.status !== 'resolved').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const shown = tickets.filter((t) => (tab === 'resolved' ? t.status === 'resolved' : t.status !== 'resolved'));

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(['open', 'resolved'] as const).map((k) => (
          <button key={k} onClick={() => { setTab(k); setOpenId(null); }} className="min-h-[44px] md:min-h-0 text-[11px] font-bold uppercase px-3 py-1.5 rounded"
            style={tab === k ? { background: C.gold, color: C.bg } : { background: 'rgba(255,255,255,0.05)', color: C.sub }}>
            {k === 'open' ? `Open (${openCount})` : `Resolved (${resolvedCount})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p style={{ color: C.sub }}>No {tab} tickets.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((t) => (
            <div key={t.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.panel }}>
              <button onClick={() => setOpenId(openId === t.id ? null : t.id)} className="w-full flex items-center justify-between p-4 text-left">
                <div>
                  <div className="font-bold">{t.subject}</div>
                  <div className="text-[11px]" style={{ color: C.sub }}>{t.user?.email} · {t.messages.length} msg · {when(t.createdAt)}</div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ color: t.status === 'resolved' ? C.green : C.gold, background: 'rgba(255,255,255,0.05)' }}>{t.status}</span>
              </button>
              {openId === t.id && (
                <div className="p-4 border-t" style={{ borderColor: C.border }}>
                  <div className="space-y-2.5 mb-3 max-h-72 overflow-y-auto">
                    {t.messages.map((m) => {
                      const { text, imgs } = parseMsg(m.content);
                      const own = !m.fromUser; // admin/support message
                      return (
                        <div key={m.id} className="flex" style={{ justifyContent: own ? 'flex-end' : 'flex-start' }}>
                          <div className="px-3 py-2 rounded-2xl text-[12px] max-w-[75%]"
                            style={own
                              ? { background: 'linear-gradient(135deg,#6366F1,#A855F7)', color: '#fff', borderBottomRightRadius: 6 }
                              : { background: 'rgba(255,255,255,0.06)', color: C.text, border: `1px solid ${C.border}`, borderBottomLeftRadius: 6 }}>
                            {text && <p className="whitespace-pre-wrap break-words">{text}</p>}
                            {imgs.map((u) => (
                              <a key={u} href={u} target="_blank" rel="noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={u} alt="attachment" className="mt-2 rounded-lg max-h-52" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                              </a>
                            ))}
                            <p className="text-[9px] mt-1" style={{ color: own ? 'rgba(255,255,255,0.7)' : C.sub }}>{own ? 'Support' : 'User'} · {when(m.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {t.status === 'resolved' ? (
                    <p className="text-[11px] font-bold" style={{ color: C.green }}>✓ Resolved — hidden from the user.</p>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply…" className="flex-1 bg-black/40 border rounded-lg px-3 py-2 min-h-[44px] sm:min-h-0 text-sm" style={{ borderColor: C.border, color: C.text }} />
                      <button onClick={() => replyTo(t.id)} className="min-h-[44px] md:min-h-0 px-3 py-2 rounded-lg text-[11px] font-bold uppercase" style={{ background: C.cyan, color: '#06090F' }}>Reply</button>
                      <button onClick={() => resolve(t.id)} className="min-h-[44px] md:min-h-0 px-3 py-2 rounded-lg text-[11px] font-bold uppercase" style={{ background: C.green, color: '#06090F' }}>Resolve</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AdminLog { id: number; adminEmail: string; action: string; targetType: string | null; targetId: string | null; details: string | null; createdAt: string; }

function Audit() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/api/admin/audit').then((r) => { setLogs(r.logs || []); setLoading(false); }); }, []);
  if (loading) return <p style={{ color: C.sub }}>Loading…</p>;
  if (logs.length === 0) return <p style={{ color: C.sub }}>No admin activity recorded yet.</p>;
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] md:min-w-0 text-left text-sm">
          <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
            <tr>{['Admin', 'Action', 'Target', 'Details', 'Date'].map((h) => (
              <th key={h} className="p-3 text-[10px] uppercase font-bold tracking-widest" style={{ color: C.gold }}>{h}</th>))}</tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t" style={{ borderColor: C.border }}>
                <td className="p-3 text-[11px]" style={{ color: C.sub }}>{l.adminEmail}</td>
                <td className="p-3 font-bold uppercase text-[11px]" style={{ color: C.gold }}>{l.action}</td>
                <td className="p-3 text-[11px] whitespace-nowrap md:whitespace-normal">{l.targetType ? `${l.targetType} #${l.targetId}` : '—'}</td>
                <td className="p-3 text-[11px]" style={{ color: C.sub }}>{l.details}</td>
                <td className="p-3 text-[11px] font-mono whitespace-nowrap md:whitespace-normal" style={{ color: C.sub }}>{when(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
