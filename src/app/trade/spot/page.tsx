import TradeTerminal from '@/components/trade/TradeTerminal';
import Sidebar from '@/components/Sidebar';
import MobileTrade from '@/components/trade/MobileTrade';

export const metadata = {
  title: 'Spot Trading — Kandella',
};

/**
 * /trade/spot
 * ─ Desktop (md+): the production <TradeTerminal /> unchanged. It owns its whole
 *   shell (ambient orbs + desktop Sidebar), so the wrapper only switches its
 *   display to `contents` at md+ (pixel-identical to rendering it bare) and
 *   hides it entirely below md.
 * ─ Mobile (< md): the app Sidebar is re-rendered (it supplies the fixed bottom
 *   nav on small screens, mirroring the dashboard page) and MobileTrade renders
 *   the k-shell trade composition against the same live data/actions.
 */
export default function SpotTradePage() {
  return (
    <>
      {/* Desktop terminal (md+), untouched */}
      <div className="hidden md:contents">
        <TradeTerminal product="spot" maxLeverage={1} />
      </div>

      {/* Mobile composition (< md) */}
      <div
        className="md:hidden flex-1 min-w-0 flex flex-col relative"
        style={{
          background:
            'radial-gradient(920px 640px at 88% -14%, rgba(168,85,247,0.13), transparent 62%), radial-gradient(780px 560px at -12% 112%, rgba(6,182,212,0.10), transparent 60%), #06090F',
          minHeight: '100dvh',
        }}
      >
        <Sidebar />
        <MobileTrade />
      </div>
    </>
  );
}
