const CareersSection = () => {
  return (
    <section id="careers" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="bg-white py-10 text-center">
        <h2 className="text-3xl font-bold text-[#121212] md:text-4xl">
          Careers at MaktabOS — Now Hiring!
        </h2>
      </div>

      <div className="bg-[#0B4B31] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg font-medium leading-7 text-white md:text-xl">
            We’re currently hiring a motivated Sales Account Executive to help expand the reach of MaktabOS.
          </p>
          <p className="mt-4 text-lg font-medium leading-7 text-white md:text-xl">
            Join us in building the digital backbone for Islamic education worldwide.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-[28px] bg-[#E7E7E7] px-10 py-12 text-left text-[#0B4B31] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)]">
          <h3 className="text-lg font-semibold text-[#0B4B31]">Fill Out The Form</h3>

          <form className="mt-8 grid gap-6 text-sm font-medium text-[#0B4B31]/80 md:grid-cols-2 md:gap-8">
            <div className="space-y-2">
              <label htmlFor="career-name">Name</label>
              <input
                id="career-name"
                type="text"
                placeholder="Name"
                className="w-full rounded-full bg-[#4F7F68] px-6 py-3 text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="career-phone">Phone</label>
              <input
                id="career-phone"
                type="tel"
                placeholder="Phone"
                className="w-full rounded-full bg-[#4F7F68] px-6 py-3 text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="career-email">Email</label>
              <input
                id="career-email"
                type="email"
                placeholder="Email"
                className="w-full rounded-full bg-[#4F7F68] px-6 py-3 text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="career-availability">Availability / Interest</label>
              <input
                id="career-availability"
                type="text"
                placeholder="Write"
                className="w-full rounded-full bg-[#4F7F68] px-6 py-3 text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="career-address">Address</label>
              <input
                id="career-address"
                type="text"
                placeholder="Address"
                className="w-full rounded-full bg-[#4F7F68] px-6 py-3 text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="career-experience">Background Experience</label>
              <textarea
                id="career-experience"
                placeholder="Share a brief summary"
                rows={3}
                className="w-full rounded-3xl bg-[#4F7F68] px-6 py-4 text-white placeholder:text-white/80 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-start">
              <button
                type="submit"
                className="rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black/85"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;


