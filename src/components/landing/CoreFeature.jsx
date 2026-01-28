

const features = [
  {
    title: "School Login & Authentication",
    description:
      "Secure multi-role access for admins, teachers, parents, and students.",
    image: "/1.png",
    background: "#94E9B8",
    textColor: "#262626",
  },
  {
    title: "DashboardOS",
    description:
      "Intuitive dashboards with widgets and insights per user type.",
    image: "/2.png",
    background: "#3E715C",
    textColor: "#FFFFFF",
  },
  {
    title: "Attendance Management",
    description: "Assign teachers, manage subjects, and set schedules.",
    image: "/3.png",
    background: "#F0F9FF",
    textColor: "#262626",
  },
  {
    title: "Class & Teacher Management",
    description: "Assign teachers, manage subjects, and set schedules.",
    image: "/4.png",
    background: "#EBFFEE",
    textColor: "#063522",
  },
  {
    title: " Payments & Billing",
    description: "Collect tuition and fees online, generate invoices, and track balances.",
    image: "/5.png",
    background: "#FFFBEB",
    textColor: "#063522",
  },
  {
    title: "Parent Portal",
    description: "Parents can view attendance, grades, announcements, and payments",
    image: "/6.png",
    background: "#FEF2F2",
    textColor: "#063522",
  },
  {
    title: "Messaging Center",
    description: "Send announcements, reminders, and SMS/email notifications",
    image: "/7.png",
    background: "#F0F9FF",
    textColor: "#063522",
  },
  {
    title: "Analytics",
    description: "Monitor enrollment, finances, and attendance trends in one place",
    image: "/8.png",
    background: "#0B4B31F2",
    textColor: "#FFFFFF",
  },
];

const CoreFeature = () => {
  return (
    <section
      id="features"
      className="bg-white py-12"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto mb-14 max-w-6xl text-center">
          <h2 className="text-2xl leading-[1.2] font-bold text-[#262626] md:text-4xl md:leading-normal lg:text-5xl">
            Core Features
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-4 overflow-hidden rounded-[20px] p-10 text-center shadow-[0_30px_60px_-45px_rgba(11,75,49,0.45)]"
              style={{ background: feature.background, color: feature.textColor }}
            >
              <div className="w-full max-w-[380px] rounded-[10px] p-3">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="space-y-3">
                <h3
                  className={`text-xl leading-[1.3] md:text-2xl md:leading-normal font-semibold ${feature.textColor === "#FFFFFF" ? "text-white" : ""
                    }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm leading-6 md:text-base md:leading-7 ${feature.textColor === "#FFFFFF"
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