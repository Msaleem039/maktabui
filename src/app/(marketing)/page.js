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
import Link from "next/link";
import Buttonstart from "@/components/landing/Buttonstart";

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
          style={{ backgroundImage: "url('/landing3.jpg')" }}
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
              <h1 className="text-3xl leading-[1.2] md:text-[3.5rem] md:leading-[80.52px] tracking-[0] semi-bold text-white mb-2">
                <span className="text-white font-bold">MaktabOS</span> – The Complete <br /> Operating System for Islamic Schools
              </h1>

              <p className="max-w-240 text-xl leading-[1.3] md:text-[2.5rem] md:leading-[60.66px] tracking-[0] semi-bold text-white">
                <span>One platform. Endless possibilities. Manage attendance, communication, billing, and analytics — all from your own branded dashboard.</span>
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="rounded-full bg-white px-6 py-3 text-[1.0625rem] font-semibold text-[#0B4B31] shadow-lg shadow-black/10 transition hover:bg-[#F3F6F5]"
                >
                  Get Started
                </Link>

                <Link href="/login"
                  className="rounded-full bg-[#0B4B31] px-6 py-3 text-[1.0625rem] font-semibold text-white transition hover:border-white hover:bg-[#0B4B31]/60"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </main >
      </div >

      <AboutSection />
      <CoreFeature />
      <HowItWorks />
      <PricingSection />
{/* <Buttonstart /> */}
      <OnlineQuranSection />
      <CareersSection />
      <FooterSection />
    </>
  );
}