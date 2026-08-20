import { Geist } from 'next/font/google';
import { AuthProvider } from "@/components/context/AuthContext";
import { CurrencyProvider } from "@/components/context/CurrencyContext";
import "./globals.css";
import { Metadata } from "next";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import SpaceBackground from "@/components/SpaceBackground";

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
      </head>
      <body className="antialiased">
        {/* Fullscreen ambient space-globe video background + dark legibility overlay */}
        <SpaceBackground />
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
