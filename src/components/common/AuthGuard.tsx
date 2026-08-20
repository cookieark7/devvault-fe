"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import Spinner from "@/components/common/ui/Spinner";

/**
 * Wraps dashboard routes to enforce authentication.
 * Redirects to /login if no user is found after auth state loads.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-main">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Will redirect momentarily
    return null;
  }

  return <>{children}</>;
}
