import Image from "next/image";

const PricingSection = () => {
  return (
    <section
      id="plan"
      className="relative isolate min-h-screen overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Image
        src="/Section1.png"
        alt="Students studying Quran"
        fill
        priority
        className="absolute inset-0 object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-l from-[#0B4B31B8] to-[#00000000]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-start px-6 py-24">
        <div className="w-full max-w-md rounded-[36px] bg-white px-10 py-14 text-center shadow-[0_50px_120px_-60px_rgba(0,0,0,0.75)]">
          <h2 className="text-3xl font-bold text-[#121212] md:text-4xl">
            Our Pricing
          </h2>

          <div className="mt-10 space-y-1">
            <p className="text-5xl font-black text-[#121212]">$2.99</p>
            <span className="text-base font-semibold uppercase tracking-[0.2em] text-[#8C8C8C]">
              /month
            </span>
          </div>

          <p className="mt-8 text-sm font-medium leading-relaxed text-[#4A4A4A] md:text-base">
            Simple, transparent pricing with all core features included.
          </p>

          <a
            href="#get-started"
            className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/80"
          >
            Choose Your Plan Now and Start Learning With Us!
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
