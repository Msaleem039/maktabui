import Link from "next/link";

const FooterSection = () => {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-white pt-20 pb-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="absolute right-[-18%] top-[-28%] hidden h-[320px] w-[320px] rounded-full border-[36px] border-[#0B4B31] lg:block" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#0B4B31]" />
              <p className="text-xl font-semibold text-[#0B4B31]">MaktabOS</p>
            </div>
            <p className="text-sm text-[#0B4B31]/70 md:max-w-xs">
              Empowering Islamic schools with a modern operating system for administration, communication, and growth.
            </p>
          </div>

          <div className="grid flex-1 gap-10 text-sm text-[#0B4B31]/80 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B4B31]">
                Links
              </p>
              <nav className="flex flex-col gap-2">
                <Link href="#home" className="transition hover:text-[#0B4B31]">
                  Home
                </Link>
                <Link href="#about" className="transition hover:text-[#0B4B31]">
                  About
                </Link>
                <Link
                  href="#contact"
                  className="transition hover:text-[#0B4B31]"
                >
                  Contact Us
                </Link>
                <Link
                  href="#dashboard"
                  className="transition hover:text-[#0B4B31]"
                >
                  Dashboard
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B4B31]">
                Legal
              </p>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="transition hover:text-[#0B4B31]">
                  Condiciones generales
                </Link>
                <Link href="#" className="transition hover:text-[#0B4B31]">
                  Privacy Policy
                </Link>
                <Link href="#" className="transition hover:text-[#0B4B31]">
                  Terms and Condition
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B4B31]">
                Contact
              </p>
              <div className="flex flex-col gap-2 text-sm text-[#0B4B31]/80">
                <a href="tel:+123456789" className="transition hover:text-[#0B4B31]">
                  📞 123 456 789
                </a>
                <a href="https://wa.me/123456789" className="transition hover:text-[#0B4B31]">
                  💬 Whatsapp
                </a>
                <a href="mailto:user@9.com" className="transition hover:text-[#0B4B31]">
                  ✉️ user@9.com
                </a>
                <p className="text-[#0B4B31]/70">
                  🕒 Lunes a Viernes <br /> 09:00 a 20:00 horas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#0B4B31]/20" />

        <div className="flex items-center justify-center gap-6 text-[#0B4B31]/80">
          <a href="#" className="transition hover:text-[#0B4B31]">
            🐦
          </a>
          <a href="#" className="transition hover:text-[#0B4B31]">
            in
          </a>
          <a href="#" className="transition hover:text-[#0B4B31]">
            f
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

