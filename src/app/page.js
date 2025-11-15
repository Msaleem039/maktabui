"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/landing/AboutSection";
import CoreFeature from "@/components/landing/CoreFeature";
import HowItWorks from "@/components/landing/HowItWorks";
import OnlineQuranSection from "@/components/landing/OnlineQuranSection";
import PricingSection from "@/components/landing/PricingSection";
import CareersSection from "@/components/landing/CareersSection";
import FooterSection from "@/components/landing/FooterSection";

const primaryNavItems = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "/about" },
  { label: "Features", href: "#features" },
  { label: "Plan", href: "#plan" },
  { label: "Careers", href: "#careers" },
  { label: "Contact Us", href: "#contact" },
];

const getRedirectPath = (role) => {
  switch (role) {
    case "Super Admin":
      return "/dashboard/super-admin/dashboard";
    case "Admin":
      return "/dashboard/admin";
    case "Teacher":
      return "/dashboard/teacher";
    case "Student":
      return "/dashboard/student";
    case "Parent":
      return "/dashboard/parent";
    default:
      return null;
  }
};

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldShowLanding, setShouldShowLanding] = useState(false);

  useEffect(() => {
    const userCookie = getCookie("user");

    if (!userCookie) {
      setShouldShowLanding(true);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const user = JSON.parse(userCookie);
      const redirectPath = getRedirectPath(user?.role);

      if (redirectPath) {
        router.replace(redirectPath);
        return;
      }
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
    }

    setShouldShowLanding(true);
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth && !shouldShowLanding) {
    return null;
  }

  if (!shouldShowLanding) {
    return null;
  }

  return (
    <>
      <div
        id="home"
        className="relative min-h-screen bg-[#0B4B31] text-white"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/landing.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #0B4B31B8 0%, #00000000 100%)",
          }}
        />

        <Navbar items={primaryNavItems} />

        <main className="relative z-10 flex min-h-screen items-center py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:py-0">
            <div className="flex flex-col justify-center gap-6 text-left">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-[2.75rem] md:text-5xl lg:text-[3.5rem]">
                <span className="text-black">MaktabOS</span> – The Complete Operating System for Islamic Schools
              </h1>

              <p className="max-w-xl text-base font-medium text-white/90 sm:text-lg md:text-xl lg:text-[1.375rem]">
                One platform. Endless possibilities. Manage attendance, communication, billing, and analytics — all from your own branded dashboard.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#get-started"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B4B31] shadow-lg shadow-black/10 transition hover:bg-[#F3F6F5] sm:text-base"
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-[#0B4B31]/60 sm:text-base"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
  
      <AboutSection />
      <CoreFeature />
      <HowItWorks />
      <PricingSection />
      <OnlineQuranSection />
      <CareersSection />
      <FooterSection />
    </>
  );
}
