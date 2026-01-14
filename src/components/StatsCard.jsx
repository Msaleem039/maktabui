"use client";
import { useState } from "react";
import { GraduationCap, Users, UserCog, BookOpen, Shield } from "lucide-react";
import { getUserRole } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

export default function StatsCards({ stats }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const userRole = getUserRole();
  console.log("userRole", userRole);
  const { themeColor } = useTheme();

  const statCards = [
    {
      title: "Students",
      value: stats?.totalStudents || 0,
      icon: GraduationCap,
    },
    { title: "Parents", value: stats?.totalParents || 0, icon: Users },
    { title: "Teachers", value: stats?.totalTeachers || 0, icon: UserCog },
    { title: "Invoices", value: stats?.totalInvoices || 0, icon: BookOpen },
    { title: "Admin", value: stats?.totalAdmins || 0, icon: Shield },
  ];

  const filteredStatCards = () => {
    if (userRole === "Super Admin") {
      return statCards.filter(
        (item) => item.title === "Admin" || item.title === "Invoices"
      );
    } else if (userRole === "Admin") {
      return statCards.filter((item) => item.title !== "Admin");
    }
    return statCards;
  };

  const cardsToDisplay = filteredStatCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [@media(min-width:1366px)]:grid-cols-4 gap-5 w-full max-w-[1280px] mx-auto mb-6">
      {cardsToDisplay.map((item, index) => {
        const isActive = activeIndex === index;
        const borderClass = isActive
          ? "border-[#0B4B31]"
          : "border-transparent";

        return (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              borderColor: isActive ? themeColor : "transparent",
            }}
            className="p-6 rounded-2xl border bg-white flex flex-col items-start text-left cursor-pointer transition-all duration-200"
          >
            <item.icon className="text-emerald-900 mb-3" size={26} />
            <h3
              className="text-sm font-normal mb-1"
              style={{ color: themeColor }}
            >
              {item.title}
            </h3>
            <h2
              className="text-3xl font-semibold mb-1"
              style={{ color: themeColor }}
            >
              {item.value}
            </h2>
            <p className="text-[0.625rem] text-black mt-1">
              Compared to Last Month
            </p>
          </div>
        );
      })}
    </div>
  );
}