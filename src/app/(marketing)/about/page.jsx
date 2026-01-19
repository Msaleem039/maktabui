"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with #about anchor
    router.replace("/");
    // Scroll to about section after navigation
    setTimeout(() => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [router]);

  return null;
}
