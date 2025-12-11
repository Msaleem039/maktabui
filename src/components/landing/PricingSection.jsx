import Image from "next/image";

const PricingSection = () => {
  return (
    <section
      id="plan"
      className="relative isolate min-h-screen w-full overflow-hidden"
      style={{ 
        fontFamily: "Inter, sans-serif",
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      <div className="absolute inset-0 w-full h-full" style={{ width: '100vw', minWidth: '100%' }}>
        <Image
          src="/Section1.png"
          alt="Students studying Quran"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-l from-[#0B4B31B8] to-[#00000000]" />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-4 py-20 2xl:max-w-7xl">
        <h2 className="mb-6 text-center text-2xl leading-[1.2] font-bold text-[#FAFAFA] sm:text-3xl md:text-[2.5rem] md:leading-normal md:text-left md:ml-24 md:max-w-xs">
          Our Pricing
        </h2>

        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center justify-start">
            <div className="w-full max-w-120 rounded-4xl bg-white px-10 py-14 text-center shadow-[0_50px_120px_-60px_rgba(0,0,0,0.75)]">
              <div className="mt-10 space-y-1">
                <p className="text-3xl font-bold text-[#121212]">$ <span className="text-5xl mr-4 font-bold text-[#121212]">2.99</span></p>
                <span className="text-base font-semibold uppercase tracking-[0.2em] text-[#AEAEAE]">
                  /month
                </span>
              </div>

              <p className="mt-8 text-xs font-bold leading-relaxed text-[#565353] md:text-base">
                Simple, transparent pricing with all core features included.
              </p>

              <a
                href="#get-started"
                className="mt-10 inline-flex w-full text-[0.75rem] items-center justify-center rounded-full bg-black px-8 py-3  font-semibold tracking-[0.18em] text-white transition hover:bg-black/80"
              >
                Choose Your Plan Now and Start Learning With Us!
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative w-full h-[500px]">
              {/* <Image
                src="/Section1.png"
                alt="Students studying Quran"
                fill
                className="object-contain rounded-lg"
                sizes="50vw"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
