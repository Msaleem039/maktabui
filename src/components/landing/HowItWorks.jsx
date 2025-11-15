const steps = [
  {
    number: "01",
    title: "We Set Up Your Account",
    description: "Your logo, colors, and dashboard are fully customized.",
    background: "#0C4B34",
    href: "#get-started",
  },
  {
    number: "02",
    title: "You Go Live",
    description: "Launch with a secure school login for every role.",
    background: "#245E46",
    href: "#get-started",
  },
  {
    number: "03",
    title: "Your Team Gets Training",
    description: "We help your staff use every feature effectively.",
    background: "#2D6E52",
    href: "#get-started",
  },
  {
    number: "04",
    title: "We Maintain Everything",
    description: "We keep your school login and systems running smoothly.",
    background: "#2F6D50",
    href: "#get-started",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-white py-24"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 text-center">
        <a
          href="#get-started"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/80"
        >
          Get Started Now
        </a>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-[#1F1F1F] md:text-5xl">
            How It Works
          </h2>
          <p className="text-base text-[#1F1F1F]/70 md:text-lg">
            Launch your school on MaktabOS in four simple steps.
          </p>
        </div>

        <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <a
              key={step.number}
              href={step.href}
              className="group flex h-full flex-col justify-between rounded-3xl bg-[var(--card-bg)] px-8 pb-10 pt-12 text-left text-white shadow-[0_40px_80px_-60px_rgba(11,75,49,0.5)] transition-transform transition-colors hover:-translate-y-2 hover:bg-[#09432C] hover:shadow-[0_45px_90px_-60px_rgba(9,67,44,0.6)] focus-visible:-translate-y-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B4B31]/30 active:bg-[#063522]"
              style={{
                "--card-bg": step.background,
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                {step.number}
              </div>

              <div className="mt-8 space-y-3">
                <h3 className="text-xl font-semibold text-white transition group-hover:text-white group-focus-visible:text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-white/80 group-hover:text-white group-focus-visible:text-white">
                  {step.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        <a
          href="#get-started"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/80"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;

