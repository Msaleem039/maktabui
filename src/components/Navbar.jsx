"use client";

import { useState } from "react";
import { Grid3x3, LayoutGrid, Menu, X } from "lucide-react";

const Navbar = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[98%] sm:max-w-[95%] md:max-w-[92%] lg:max-w-6xl xl:max-w-7xl items-center justify-between rounded-[18px] bg-gradient-to-r from-[#0B4B31] via-[#0B4B31]/90 to-[#0B4B31]/80 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 shadow-lg shadow-black/10 backdrop-blur-md">
        <a
          href="/"
          className="flex shrink-0 items-center text-lg font-bold tracking-tight text-white md:text-xl lg:text-xl xl:text-2xl"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={closeMenu}
        >
          <LayoutGrid size={24} className="text-white fill-white shrink-0 md:mr-2 md:size-6 lg:size-6" />
          <span className="hidden md:inline whitespace-nowrap">MaktabOS</span>
        </a>

        <nav
          className="hidden items-center gap-4 lg:flex lg:gap-3 xl:gap-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-bold text-white transition-colors hover:text-white/85 after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-white after:opacity-0 after:content-[''] after:transition-all after:duration-200 group-hover:after:w-3/5 group-hover:after:opacity-100 lg:text-sm xl:text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-2 xl:gap-4">
          <a
            href="#get-started"
            className="whitespace-nowrap rounded-full bg-[#0B4B31] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 lg:px-3 lg:py-2 lg:text-sm xl:px-4 xl:text-base"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Get Started →
          </a>
          <a
            href="#book-demo"
            className="whitespace-nowrap rounded-tr-xl rounded-bl-xl rounded-tl-none rounded-br-none bg-white px-3 py-1.5 text-xs font-bold text-[#0B4B31] transition hover:bg-[#F3F6F5] lg:px-3 lg:py-2 lg:text-sm xl:px-4 xl:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Book a Demo
          </a>

        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 lg:hidden shrink-0"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <nav
          className="mx-auto mt-2 sm:mt-3 flex w-full max-w-[98%] sm:max-w-[95%] md:max-w-[92%] lg:max-w-6xl xl:max-w-7xl flex-col gap-3 rounded-[18px] bg-white px-4 py-4 sm:px-6 sm:py-6 text-[#0B4B31] shadow-lg lg:hidden"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="rounded-full bg-[#0B4B31]/5 px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition hover:bg-[#0B4B31] hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <a
              href="#get-started"
              onClick={closeMenu}
              className="rounded-full bg-[#0B4B31] px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              Get Started →
            </a>
            <a
              href="#book-demo"
              onClick={closeMenu}
              className="rounded-full bg-[#0B4B31]/10 px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold text-[#0B4B31] transition hover:bg-[#0B4B31]/15"
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