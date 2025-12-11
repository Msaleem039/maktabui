import Image from "next/image";
import Landing1 from "@/utils/icons/Landing1";
import Mosque from "@/utils/icons/Mosque";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="bg-[#0B4B31] pt-20 pb-6 text-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative mx-auto mb-4 flex w-full max-w-7xl items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0 flex -translate-y-6 items-center justify-center opacity-60">
          <Landing1 />
        </div>
        <h2 className="relative z-10 top-0 text-center text-3xl leading-[1.2] md:text-[3rem] md:leading-normal font-bold">
          About MaktabOS
        </h2>
      </div>

      <div className="relative mx-auto w-full max-w-7xl overflow-hidden pb-0 pt-10 text-center md:px-16">
        <Mosque className="pointer-events-none absolute top-10 right-[-5%] h-[100%] w-[45%] max-w-none text-white opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B4B31]/70 via-[#0B4B31]/55 to-transparent" />

        <Image
          src="/group.png"
          alt="MaktabOS logomark"
          width={220}
          height={160}
          priority
          className="pointer-events-none relative z-10 mx-auto mb-2 w-32 select-none md:w-60"
        />

        <div className="pb-8 relative z-10 mx-auto flex max-w-7xl font-medium flex-col gap-6 text-lg leading-[1.3] text-white md:text-xl md:leading-[1.4] lg:text-[2.4375rem] lg:leading-normal">
          <p className="text-2xl semibold">
            MaktabOS is a modern, modular “Operating System” built exclusively for Islamic schools and academies. We provide
            your school with its own branded, secure online portal — powered by our central system — so you can manage students,
            teachers, parents, and operations with ease.
          </p>
          <p className="text-2xl semibold">
            Each school has its own dashboard, logo, and theme, unique login URL, and secure multi-role access. We handle hosting,
            updates, and support — you focus on teaching and growth.
          </p>
          <p className="text-2xl semibold">
            From attendance and analytics to payments and messaging, every workflow lives in one unified platform that reflects your
            school’s identity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

