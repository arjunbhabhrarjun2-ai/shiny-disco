// ⚠️ Note: Next.js does NOT export a `NextConfig` type — keep this untyped for compatibility.

const nextConfig = {
  serverExternalPackages: ["@prisma/client", "bcrypt"],

  typescript: {
    ignoreBuildErrors: false,
  },


  // Hosts permitted to reach Next.js dev resources (HMR, /_next/*) over a tunnel.
  // Add additional preview domains here as needed.
  allowedDevOrigins: [
    "172.20.10.2",
    "brochure-first-impressed-tale.trycloudflare.com",
    "*.trycloudflare.com",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
