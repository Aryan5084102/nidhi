"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "@/context/AuthContext";
import { getPathFromNavId } from "@/hooks/useNavigation";

export default function Login() {
  const { user, isLoading, defaultNav } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const path = getPathFromNavId(defaultNav) || "/dashboard";
      router.replace(path);
    }
  }, [user, isLoading, defaultNav, router]);

  if (isLoading || user) return null;

  return <LoginPage />;
}
