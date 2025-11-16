

import Image from "next/image";

const features = [
  {
    title: "School Login & Authentication",
    description:
      "Secure multi-role access for admins, teachers, parents, and students.",
    image: "/core1.svg",
    background: "#94E9B8",
    textColor: "#262626",
  },
  {
    title: "DashboardOS",
    description:
      "Intuitive dashboards with widgets and insights per user type.",
    image: "/core2.svg",
    background: "#3E715C",
    textColor: "#FFFFFF",
  },
  {
    title: "Attendance Management",
    description: "Assign teachers, manage subjects, and set schedules.",
    image: "/core3.svg",
    background: "#F0F9FF",
    textColor: "#262626",
  },
  {
    title: "Class & Teacher Management",
    description: "Assign teachers, manage subjects, and set schedules.",
    image: "/core4.svg",
    background: "#EBFFEE",
    textColor: "#063522",
  },
  {
    title: " Payments & Billing",
    description: "Collect tuition and fees online, generate invoices, and track balances.",
    image: "/core5.svg",
    background: "#FFFBEB",
    textColor: "#063522",
  },
  {
    title: "Parent Portal",
    description: "Parents can view attendance, grades, announcements, and payments",
    image: "/core7.svg",
    background: "#FEF2F2",
    textColor: "#063522",
  },
  {
    title: "Messaging Center",
    description: "Send announcements, reminders, and SMS/email notifications",
    image: "/core8.svg",
    background: "#F0F9FF",
    textColor: "#063522",
  },
  {
    title: "Analytics",
    description: "Monitor enrollment, finances, and attendance trends in one place",
    image: "/core9.svg",
    background: "#0B4B31F2",
    textColor: "#FFFFFF",
  },
];

const CoreFeature = () => {
  return (
    <section
      id="features"
      className="bg-white py-24"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-[#0B4B31] md:text-4xl lg:text-5xl">
            Core Features
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-6 overflow-hidden rounded-[32px] p-10 text-center shadow-[0_30px_60px_-45px_rgba(11,75,49,0.45)]"
              style={{ background: feature.background, color: feature.textColor }}
            >
              <div className="w-full max-w-[420px] rounded-[28px] bg-white/60 p-6 backdrop-blur-sm">
                <div className="relative mx-auto aspect-[16/10] w-full">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    priority
                    className="object-contain"
                    sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 88vw"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-2xl font-semibold ${feature.textColor === "#FFFFFF" ? "text-white" : ""
                    }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-base leading-7 ${feature.textColor === "#FFFFFF"
                    ? "text-white"
                    : "text-[#737373]"
                    }`}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeature;