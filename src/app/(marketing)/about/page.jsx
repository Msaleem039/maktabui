"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/about" },
  { label: "Features", href: "/#features" },
  { label: "Plan", href: "/#plan" },
  { label: "Careers", href: "/#careers" },
  { label: "Contact Us", href: "/#contact" },
];

export default function AboutPage() {
  return (
    <>
      {/* Top Hero Section */}
      <div
        className="relative min-h-screen text-white"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="relative min-h-screen overflow-hidden">
          <Image
            src="/Hero Section.svg"
            alt="MaktabOS Hero Background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 " />

          {/* <Navbar items={navItems} /> */}

          <main className="relative z-10 flex min-h-screen items-center pt-24">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
              <div className="max-w-6xl space-y-6 text-left">
                <h1 className="text-3xl leading-tight tracking-tight font-medium  text-white md:text-5xl lg:text-[3.75rem]">
                  <span className="text-black">MaktabOS</span> – The Complete Operating System for Islamic Schools
                </h1>

                <p className="max-w-240 text-base font-medium text-black  sm:text-lg md:text-xl lg:text-[1.875rem]">
                  <span>One platform. Endless possibilities. Manage attendance, communication, billing, and analytics — all <br /> from your own branded dashboard.</span>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Bottom About Section */}
      <section
        className="relative min-h-screen bg-[#55937E]  py-24 text-white"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          {/* Left Side - hero-section2.svg */}
          <div className="flex-1">
            <div className="relative aspect-[3/2] w-full overflow-hidden ">
              <Image
                src="/hero-section2.svg"
                alt="MaktabOS About Background"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="flex-1 space-y-6">
            <p className="text-xl font-bold  text-[#0B4B31]">
              About Us
            </p>

            <h2 className="text-4xl font-bold text-[#1E1E1E] md:text-5xl lg:text-[3rem]">
              About MaktabOS
            </h2>

            <div className="space-y-4 text-base font-medium leading-relaxed text-[#1E1E1EC7] md:text-xl">
              <p>
                MaktabOS is a modern, modular "Operating System" built
                exclusively for Islamic schools and academies. We provide your
                school with its own branded, secure online portal — powered by
                our central system — so you can manage students, teachers,
                parents, and operations with ease.
              </p>

              <p>
                Each school has its own dashboard, logo, and theme, unique login
                URL, and secure multi-role access. We handle hosting, updates,
                and support — you focus on teaching and growth
              </p>
            </div>

            <a
              href="#learn-more"
              className="inline-block rounded-lg bg-[#0B4B31] px-8 py-3 text-base font-bold text-white transition hover:bg-[#0A492F]"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </>
  );
}


