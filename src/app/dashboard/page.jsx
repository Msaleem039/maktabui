"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const userCookie = getCookie("user");

    if (!userCookie) {
      router.push("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userCookie);
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      router.push("/login");
      return;
    }

    if (!user?.role) {
      router.push("/login");
      return;
    }

    switch (user.role) {
      case "Super Admin":
      case "Admin":
      case "Teacher":
        router.push("/dashboard/dashboard");
        break;
      case "Student":
        router.push("/dashboard/student/dashboard");
        break;
      case "Parent":
        router.push("/dashboard/parent/dashboard");
        break;
      default:
        router.push("/login");
    }
  }, [router]);

  return <div>Redirecting...</div>;
}
