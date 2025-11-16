import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Mail, Twitter, Linkedin, Facebook } from "lucide-react";

const FooterSection = () => {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-white pt-0 pb-10"
      style={{ fontFamily: "Barlow, sans-serif" }}
    >
      {/* Top border line - light green */}
      {/* <div className="h-px w-full bg-emerald-400" /> */}

      {/* Dark green quarter-circle in top-right */}
      <div className="absolute right-[-18%] top-[-28%] hidden h-[320px] w-[320px] rounded-full lg:block" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pt-20">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start">
          {/* Logo section */}
          <div className="flex flex-col items-center gap-4 mr-20 text-center md:items-start md:text-left">
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-8 w-8 text-black fill-black" />
              <p className="text-2xl font-bold text-black">MaktabOS</p>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid flex-1 gap-10 text-base font-medium text-[#0A142F] md:grid-cols-3">
            {/* Links column */}
            <div className="space-y-4">
              <p className="text-base font-medium text-[#0A142F]">
                links
              </p>
              <nav className="flex flex-col gap-4 opacity-70">
                <Link href="#home" className="transition hover:opacity-100">
                  Home
                </Link>
                <Link href="#about" className="transition hover:opacity-100">
                  About
                </Link>
                <Link
                  href="#contact"
                  className="transition hover:opacity-100"
                >
                  Contact us
                </Link>
                <Link
                  href="#dashboard"
                  className="transition hover:opacity-100"
                >
                  Dashboard
                </Link>
              </nav>
            </div>

            {/* Legal column */}
            <div className="space-y-4">
              <p className="text-base font-medium text-[#0A142F]">
                LEGAL
              </p>
              <nav className="flex flex-col gap-4 opacity-70">
                <Link href="#" className="transition hover:opacity-100">
                  Condiciones generales
                </Link>
                <Link href="#" className="transition hover:opacity-100">
                  Privacy Policy
                </Link>
                <Link href="#" className="transition hover:opacity-100">
                  Terms and Condition
                </Link>
              </nav>
            </div>

            {/* Contact column */}
            <div className="space-y-4">
              <p className="text-base font-medium text-[#0A142F]">
                CONTACT
              </p>
              <div className="flex flex-col gap-4 text-base font-medium text-[#0A142F] opacity-70">
                <div className="flex items-center gap-3">
                  <Image
                    src="/Phone.svg"
                    alt="Phone"
                    width={28}
                    height={27}
                    className="h-5 w-5"
                  />
                  <a href="tel:+123456789" className="transition hover:opacity-100">
                    123 456 789
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={28}
                    height={27}
                    className="h-5 w-5"
                  />
                  <a href="https://wa.me/123456789" className="transition hover:opacity-100">
                    Whatsapp
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-900" />
                  <a href="mailto:user@.com" className="transition hover:opacity-100">
                    user@.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/time.svg"
                    alt="Clock"
                    width={25}
                    height={24}
                    className="h-5 w-5"
                  />
                  <p className="transition hover:opacity-100">
                    Lunes a Viernes<br />08:00 a 20:00 horas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator line - light gray */}
        <div className="h-px w-full bg-[#0B4B31]" />

        {/* Social media icons */}
        <div className="flex items-center justify-center gap-6 text-slate-900">
          <a href="#" className="transition hover:opacity-70">
            <Twitter className="h-5 w-5 fill-[#0A142F]" strokeWidth={0} />
          </a>
          <a href="#" className="transition hover:opacity-70">
            <Linkedin className="h-5 w-5 fill-[#0A142F]" strokeWidth={0} />
          </a>
          <a href="#" className="transition hover:opacity-70">
            <Facebook className="h-5 w-5 fill-[#0A142F]" strokeWidth={0} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

