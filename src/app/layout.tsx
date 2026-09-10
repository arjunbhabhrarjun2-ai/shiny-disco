import { Geist } from 'next/font/google';
import { AuthProvider } from "@/components/context/AuthContext";
import { CurrencyProvider } from "@/components/context/CurrencyContext";
import "./globals.css";
import "./mobile-shell.css";
import { Metadata } from "next";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import SpaceBackground from "@/components/SpaceBackground";
import AppBootMarker from "@/components/AppBootMarker";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kandella",
  description: "Kandella Investment Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Boot failsafe: framer-motion ships SSR content hidden at opacity:0.
            If client JS never hydrates (old Safari, hung/corrupt JS chunk,
            cache), force-reveal everything so the page is never blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  try {
    var done = false;
    function cancel() { if (done) return; done = true; clearTimeout(window.__bootTimer); }
    window.__cancelBootFailsafe = cancel;
    window.__bootTimer = setTimeout(function () {
      if (done) return;
      var h = document.documentElement;
      if (!h.classList.contains('app-hydrated')) h.classList.add('anim-dead');
    }, 4500);
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <noscript>
          {/* Zero-JS fallback: force-reveal SSR content that framer-motion
              would otherwise leave hidden until hydration. */}
          <style>{`
            * { opacity: 1 !important; transform: none !important;
                translate: none !important; visibility: visible !important;
                filter: none !important; clip-path: none !important; }
            [aria-label="Loading Kandella"] { display: none !important; }
            body { overflow: auto !important; }
          `}</style>
        </noscript>
        {/* Fullscreen ambient space-globe video background + dark legibility overlay */}
        <SpaceBackground />
        <AppBootMarker />
        <PageTransition>
          <AuthProvider>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </AuthProvider>
        </PageTransition>
        {/* Preloader is rendered LAST so it stacks above EVERYTHING — video,
            overlay, navbar, page content — until window.load fires. */}
        <Preloader />
      </body>
    </html>
  );
}
