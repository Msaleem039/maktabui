"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSettingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings page
    router.replace("/dashboard/settings");
  }, [router]);

  return null;
}

