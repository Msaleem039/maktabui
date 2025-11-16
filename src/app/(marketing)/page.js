"use client";

import "../globals.css";

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

export default function Home() {
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
          <div className="mx-auto w-full max-w-6xl gap-8 px-6 py-16 md:py-28 ">
            <div className="flex flex-col justify-center gap-6 text-left">
              <h1 className="text-3xl leading-tight tracking-tight font-medium  text-white md:text-5xl lg:text-[3.75rem]">
                <span className="text-black">MaktabOS</span> – The Complete Operating System for Islamic Schools
              </h1>

              <p className="max-w-240 text-base font-bold text-white sm:text-lg md:text-xl lg:text-[1.875rem]">
                <span>One platform. Endless possibilities. Manage attendance, communication, billing, and analytics — all <br /> from your own branded dashboard.</span>
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#get-started"
                  className="rounded-full bg-white px-6 py-3 text-[1.0625rem] font-semibold text-[#0B4B31] shadow-lg shadow-black/10 transition hover:bg-[#F3F6F5] "
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="rounded-full bg-[#0B4B31] px-6 py-3 text-[1.0625rem] font-semibold text-white transition hover:border-white hover:bg-[#0B4B31]/60"
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        </main >
      </div >

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


