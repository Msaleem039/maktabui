

import Image from "next/image";

const features = [
  {
    title: "School Login & Authentication",
    description:
      "Secure multi-role access for admins, teachers, parents, and students.",
    image: "/core1.svg",
    background: "#BFEFD8",
    textColor: "#063522",
  },
  {
    title: "DashboardOS",
    description:
      "Intuitive dashboards with widgets and insights tailored to each user.",
    image: "/core2.svg",
    background: "#194F38",
    textColor: "#FFFFFF",
  },
  {
    title: "Attendance Management",
    description: "Assign teachers, manage subjects, and set schedules easily.",
    image: "/core3.svg",
    background: "#E4F3FF",
    textColor: "#0A3D2B",
  },
  {
    title: "Class & Teacher Management",
    description: "Organize classes, subjects, and teaching assignments.",
    image: "/core4.svg",
    background: "#ECFCE8",
    textColor: "#063522",
  },
  {
    title: "Student Progress",
    description: "Track academics, behavior, and Quran memorization progress.",
    image: "/core5.svg",
    background: "#FDF2E0",
    textColor: "#063522",
  },
  {
    title: "Parent Communication",
    description: "Send announcements, reminders, and secure messages.",
    image: "/core7.svg",
    background: "#DCD5FF",
    textColor: "#063522",
  },
  {
    title: "Finance & Fees",
    description: "Manage payments, invoices, and receipts with ease.",
    image: "/core8.svg",
    background: "#FFECE6",
    textColor: "#063522",
  },
  {
    title: "Operations & Logistics",
    description: "Oversee inventory, facility requests, and daily workflows.",
    image: "/core9.svg",
    background: "#DFF1F9",
    textColor: "#063522",
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
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-[#0B4B31] md:text-5xl">
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
                  className={`text-2xl font-semibold ${
                    feature.textColor === "#FFFFFF" ? "text-white" : ""
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-base leading-7 ${
                    feature.textColor === "#FFFFFF"
                      ? "text-white/80"
                      : "text-[#063522]/80"
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