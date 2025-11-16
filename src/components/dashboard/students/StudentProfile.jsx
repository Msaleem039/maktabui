"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users2,
  School,
  User,
  FileText,
  ClipboardList,
  MessageSquareText,
  UserRound,
} from "lucide-react";

const tabsConfig = [
  { key: "about", label: "About" },
  { key: "attendance", label: "Attendance" },
  { key: "assignments", label: "Assignments" },
  { key: "files", label: "Student files" },
  { key: "comments", label: "Comments" },
];

const StudentProfile = ({
  student = {},
  tabs = tabsConfig,
  defaultTab = "about",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const profile = useMemo(
    () => ({
      name: "Abdiqadir Abdikadir",
      role: "Student",
      class: "202 Mohamed Karie Class",
      gender: "male",
      dob: "Not specified",
      parents: [
        {
          name: "Safiya Ali",
          phone: "612-636-1149",
        },
        {
          name: "Abukar Ali Bolay",
          phone: "612-636-1149",
        },
      ],
      stats: {
        status: "Active",
        attendance: "95%",
        assignments: "8/10",
      },
      quickActions: [
        { label: "Edit Profile", icon: UserRound },
        { label: "Send Message", icon: MessageSquareText },
        { label: "View Attendance", icon: Calendar },
      ],
      ...student,
    }),
    [student]
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
              <SectionTitle>Basic Information</SectionTitle>
              <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-3">
                <InfoItem
                  icon={School}
                  label="Class"
                  value={profile.class}
                />
                <InfoItem icon={User} label="Gender" value={profile.gender} />
                <InfoItem icon={Calendar} label="DOB" value={profile.dob} />
              </div>
            </div>

            <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
              <SectionTitle>Parent/Guardian Info</SectionTitle>
              <div className="mt-5 space-y-4">
                {profile.parents.map((parent, index) => (
                  <div
                    key={index}
                    className="rounded-[18px] bg-white p-4 shadow-sm"
                  >
                    <div className="grid gap-4 text-sm text-[#123629] sm:grid-cols-2">
                      <InfoItem
                        icon={User}
                        label="Name"
                        value={parent.name}
                      />
                      <InfoItem
                        icon={Phone}
                        label="Phone"
                        value={parent.phone}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "attendance":
        return (
          <PlaceholderCard
            icon={Calendar}
            title="Attendance"
            description="Attendance records and statistics will appear here."
          />
        );
      case "assignments":
        return (
          <PlaceholderCard
            icon={ClipboardList}
            title="Assignments"
            description="Student assignments and submissions will appear here."
          />
        );
      case "files":
        return (
          <PlaceholderCard
            icon={FileText}
            title="Student Files"
            description="Uploaded files and documents will appear here."
          />
        );
      case "comments":
        return (
          <PlaceholderCard
            icon={MessageSquareText}
            title="Comments"
            description="Internal comments and notes will appear here."
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative mx-auto max-w-4xl rounded-[28px] border border-[#E2E7E4] bg-white pb-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
      <div className="relative h-[240px] rounded-t-[28px] overflow-hidden">
        <Image
          src="/parentprofile.svg"
          alt="Student profile background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0" />
      </div>

      {/* Profile Image - positioned outside overflow-hidden container */}
      <div className="absolute left-10 top-[152px] z-30">
        <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-45px_rgba(0,0,0,0.7)] ring-8 ring-[#D5E2DB]">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-[#C7D7D0] bg-white text-5xl text-[#0B4B31]">
            <Image
              src="/user-icon.svg"
              alt="Student profile avatar"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-10 pb-8 pt-24 sm:px-12">
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-3xl font-semibold text-[#0B4B31]">
              {profile.name}
            </h2>
            <p className="text-sm uppercase tracking-[0.35em] text-[#627169]">
              {profile.role}
            </p>
          </div>
        </div>

        <nav className="mt-8 flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            const getTabStyles = () => {
              if (isActive) {
                // Active tab styling aligned with ParentProfile
                return "bg-[#96E2D6FA] text-black font-medium";
              }

              switch (tab.key) {
                case "about":
                case "attendance":
                case "assignments":
                case "files":
                  return "bg-[#0B4B3185] text-white font-medium";
                case "comments":
                  return "bg-[#39DE5433] text-black font-medium";
                default:
                  return "bg-[#0B4B31] text-white font-medium";
              }
            };

            const tabIcons = {
              about: "📄",
              attendance: "📅",
              assignments: "📋",
              files: "📁",
              comments: "💬",
            };

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-[18px] px-6 py-3 text-sm font-medium transition ${getTabStyles()}`}
              >
                <span className="text-lg">{tabIcons[tab.key] || "📁"}</span>
                {tab.label}
                <span className="ml-1 text-xs">▸</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 space-y-6">{renderTabContent()}</div>
      </div>
    </section>
  );
};

const SectionTitle = ({ children }) => (
  <h3 className="text-[0.9375rem] font-medium text-[#0B4B31]">{children}</h3>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-[18px] px-4 py-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full">
      <Icon size={16} className="text-[#0B4B31]" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-[#0B4B31]">
        {label}
      </span>
      <span className="text-xs font-medium text-black">{value}</span>
    </div>
  </div>
);

// Status and quick action cards removed as per updated design

const PlaceholderCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-start gap-4 rounded-[26px] border border-[#D2E2DB] bg-white/85 p-6 shadow-sm">
    <div className="flex items-center gap-3 text-[#0B4B31]">
      {Icon ? (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F4EC]">
          <Icon size={20} />
        </span>
      ) : null}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="max-w-xl text-sm text-[#5E6C64]">{description}</p>
    <button className="rounded-full bg-[#0B4B31] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
      Add {title}
    </button>
  </div>
);

export default StudentProfile;

