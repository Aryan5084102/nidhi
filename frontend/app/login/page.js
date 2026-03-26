"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "@/context/AuthContext";
import { getPathFromNavId } from "@/hooks/useNavigation";

export default function Login() {
  const { user, isLoading, defaultNav } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to callbackUrl (set by middleware) or default dashboard
      const callbackUrl = searchParams.get("callbackUrl");
      const path = callbackUrl || getPathFromNavId(defaultNav) || "/dashboard";
      router.replace(path);
    }
  }, [user, isLoading, defaultNav, router, searchParams]);

  if (isLoading || user) return null;

  return <LoginPage />;
}
