"use client";

import { useState } from "react";
import { Grid3x3, LayoutGrid, Menu, X } from "lucide-react";

const Navbar = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-[18px] bg-gradient-to-r from-[#0B4B31] via-[#0B4B31]/90 to-[#0B4B31]/80 px-5 py-4 shadow-lg shadow-black/10 backdrop-blur-md md:px-8 md:py-5">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-white md:text-2xl flex items-center"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={closeMenu}
        >
         <LayoutGrid size={28} className="text-white mr-2" /> MaktabOS
        </a>

        <nav
          className="hidden items-center gap-8 lg:flex"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative inline-flex items-center gap-1 text-base font-semibold text-white/85 transition-colors hover:text-white after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white after:opacity-0 after:content-[''] after:transition-all after:duration-200 group-hover:after:w-3/5 group-hover:after:opacity-100 xl:text-lg"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="#get-started"
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Get Started →
          </a>
          <a
            href="#book-demo"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book a Demo
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 lg:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <nav
          className="mx-auto mt-3 flex w-full max-w-6xl flex-col gap-3 rounded-[18px] bg-white px-6 py-6 text-[#0B4B31] shadow-lg lg:hidden"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="rounded-full bg-[#0B4B31]/5 px-4 py-3 text-base font-semibold transition hover:bg-[#0B4B31] hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <a
              href="#get-started"
              onClick={closeMenu}
              className="rounded-full bg-[#0B4B31] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              Get Started →
            </a>
            <a
              href="#book-demo"
              onClick={closeMenu}
              className="rounded-full bg-[#0B4B31]/10 px-4 py-3 text-center text-sm font-semibold text-[#0B4B31] transition hover:bg-[#0B4B31]/15"
            >
              Book a Demo
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;