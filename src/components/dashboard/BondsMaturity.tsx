'use client';

interface BondRow {
  id: string | number;
  tier: string;
  principal: number;
  startDate?: string;
  maturityDate?: string;
  daysTotal: number;
  daysElapsed: number;
  expectedPayout: number;
}

interface BondsMaturityProps {
  bonds: BondRow[];
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const tierGradient = (tier: string): string => {
  const t = tier.toLowerCase();
  if (t.includes('elite') || t.includes('03') || t.includes('tier 3')) {
    return 'linear-gradient(90deg, #FFD700, #FFA500)';
  }
  if (t.includes('popular') || t.includes('02') || t.includes('tier 2')) {
    return 'linear-gradient(90deg, #A855F7, #EC4899)';
  }
  return 'linear-gradient(90deg, #06B6D4, #3B82F6)';
};

export default function BondsMaturity({ bonds }: BondsMaturityProps) {
  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span
            className="text-[10px] uppercase font-medium block mb-0.5"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Bonds Maturity
          </span>
          <h3 className="font-serif-display text-lg" style={{ color: '#F8FAFC' }}>
            Fixed <span className="font-serif-italic" style={{ color: '#FFD700' }}>income</span>
          </h3>
        </div>
        <span
          className="text-[10px] uppercase px-2 py-1 rounded"
          style={{
            background: 'rgba(255, 215, 0, 0.08)',
            color: '#FFD700',
            letterSpacing: '0.16em',
          }}
        >
          {bonds.length} active
        </span>
      </div>

      {bonds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs" style={{ color: '#64748B' }}>
            No active bonds yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bonds.slice(0, 4).map((b) => {
            const pct = Math.min(100, Math.max(0, (b.daysElapsed / Math.max(b.daysTotal, 1)) * 100));
            const daysLeft = Math.max(0, b.daysTotal - b.daysElapsed);
            return (
              <div key={b.id}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[12px] font-medium" style={{ color: '#F8FAFC' }}>
                    {b.tier}
                  </span>
                  <span
                    className="text-[11px] tabular-nums"
                    style={{
                      color: '#F8FAFC',
                      fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    }}
                  >
                    ${fmt(b.principal)}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: tierGradient(b.tier),
                    }}
                  />
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[10px]" style={{ color: '#64748B' }}>
                    {pct.toFixed(0)}% complete
                  </span>
                  <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                    {daysLeft}d left · payout ${fmt(b.expectedPayout)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
