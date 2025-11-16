const CareersSection = () => {
  return (
    <section id="careers" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="bg-white py-10 text-center">
        <h2 className="text-3xl font-medium text-[#121212] md:text-[3.75rem]">
          Careers at MaktabOS — Now <br /> Hiring!
        </h2>
      </div>

      <div className="bg-[#0B4B31] px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg font-medium leading-9 text-white md:text-[1.5rem]">
            We’re currently hiring a motivated Sales Account Executive to help expand the reach of MaktabOS.
          </p>
          <p className="mt-2 text-lg font-medium leading-9 text-white md:text-[1.5rem]">
            Join us in building the digital backbone for Islamic education worldwide.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl bg-[#D9D9D9] px-10 py-12 text-left text-[#0B4B31] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)]">
          <h3 className="text-lg font-medium text-[#000000]">Fill Out The Form</h3>

          <form className="mt-8 grid gap-6 text-sm font-normal text-[#000000] md:grid-cols-2 md:gap-8">
            <div className="space-y-2">
              <label htmlFor="career-name" className="block mb-3">Name</label>
              <input
                id="career-name"
                type="text"
                placeholder="Name"
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="career-phone" className="block mb-3">Phone</label>
              <input
                id="career-phone"
                type="tel"
                placeholder="Phone"
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="career-email" className="block mb-3">Email</label>
              <input
                id="career-email"
                type="email"
                placeholder="Email"
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="career-availability" className="block mb-3">Availability / Interest</label>
              <input
                id="career-availability"
                type="text"
                placeholder="Write"
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="career-address" className="block mb-3">Address</label>
              <input
                id="career-address"
                type="text"
                // placeholder="Address"
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="career-experience" className="block mb-3">Background Experience</label>
              <textarea
                id="career-experience"
                // placeholder="Share a brief summary"
                rows={3}
                className="w-full rounded-3xl bg-[#0B4B3199] px-6 py-4 text-white placeholder:text-[#000000] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-start">
              <button
                type="submit"
                className="rounded-full bg-black px-8 py-3 text-sm font-semibold  text-white transition hover:bg-black/85"
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


