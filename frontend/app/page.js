"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPathFromNavId } from "@/hooks/useNavigation";

export default function Home() {
  const { user, isLoading, defaultNav } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      const path = getPathFromNavId(defaultNav) || "/dashboard";
      router.replace(path);
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, defaultNav, router]);

  return null;
}
