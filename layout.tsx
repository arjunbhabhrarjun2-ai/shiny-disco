import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flare | The Blockchain for Data",
  description:
    "Crypto Trade Prime is a full-stack layer 3 solution designed for data intensive use cases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[family-name:var(--font-body)] antialiased grain-overlay">
        {children}
      </body>
    </html>
  );
}
