import Image from "next/image";

const OnlineQuranSection = () => {
  return (
    <section
      id="online-quran"
      className="relative overflow-hidden bg-[#0B4B31] py-24 px-6 text-white md:px-10 lg:px-16"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Image
        src="/Rectangle 6.svg"
        alt="Online Quran background"
        fill
        priority
        className="absolute inset-0 object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0B4B31]/90 via-[#0B4B31]/70 to-[#0B4B31]/55 px-10" />

      <div className="relative z-10 mx-auto flex max-w-325 flex-col gap-16 px-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8 text-left">
          {/* <p className="text-xs uppercase tracking-[0.4em] text-white/75">
            Online Quran
          </p> */}
          <h2 className="text-[2.5rem] font-bold leading-tight">
            Bring Your School Online —
            <br /> The Smart Way
          </h2>
          <p className="max-w-sm text-lg  font-light leading-10 text[#FAFAFA] md:text-xl">
            Get your custom MaktabOS portal and manage everything in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#get-started"
              className="rounded-full bg-black px-7 py-3 text-base font-semibold tracking-[0.18em] text-white transition hover:bg-black/80"
            >
              Get Started Now
            </a>
            {/* <a
              href="#demo"
              className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-white hover:text-white"
            >
              Learn More
            </a> */}
          </div>
        </div>

        <div className="flex-1">
          <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[52px] border-[18px] border-black bg-[#0D4C34] shadow-[0_50px_110px_-60px_rgba(0,0,0,0.85)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[34px] bg-gradient-to-r from-[#0F5F43] via-[#0D4E33] to-[#0B4B31]">
              <Image
                src="/LOGIN.svg"
                alt="MaktabOS portal preview"
                fill
                priority
                className="object-cover cursor-pointer"
                sizes="(min-width: 1024px) 620px, (min-width: 768px) 70vw, 90vw"
              />
            </div>

            {/* <button
              type="button"
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 rounded-full bg-black px-8 py-4 text-lg font-semibold text-white shadow-[0_38px_80px_-45px_rgba(0,0,0,0.9)] transition hover:bg-black/80"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#33D0A2] text-[#063522] shadow-[0_14px_28px_-18px_rgba(0,0,0,0.7)]">
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.781 8.02618C15.5105 8.46933 15.5105 9.53067 14.781 9.97382L1.93321 17.6483C1.20369 18.0915 0.291934 17.5608 0.291934 16.6745L0.291934 1.3255C0.291934 0.43921 1.20369 -0.0914885 1.93321 0.351662L14.781 8.02618Z"
                    fill="#063522"
                  />
                </svg>
              </span>
              Watch Demo
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineQuranSection;

