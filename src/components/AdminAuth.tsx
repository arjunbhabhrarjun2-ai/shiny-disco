"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/clientAuth";

interface AdminAuthProps {
  children: React.ReactNode;
}

function AdminAuthInner({ children }: AdminAuthProps): React.ReactElement {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Server-side admin verification via Bearer token.
    let cancelled = false;

    (async () => {
      try {
        const res = await authFetch("/api/admin/verify", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data?.isAdmin) {
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          }
        }
        // Not an admin (or not logged in) — bounce home.
        router.push("/");
      } catch {
        if (!cancelled) {
          setError("Unable to verify admin access. Please sign in as an admin.");
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070B14' }}>
        <div className="text-white">Verifying access...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070B14' }}>
        <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm">
            Sign in with an admin account to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <></>;
  }

  return <>{children}</>;
}

export default function AdminAuth({ children }: AdminAuthProps): React.ReactElement {
  return (
    <Suspense fallback={<div style={{ background: '#070B14', minHeight: '100vh' }} />}>
      <AdminAuthInner>{children}</AdminAuthInner>
    </Suspense>
  );
}
