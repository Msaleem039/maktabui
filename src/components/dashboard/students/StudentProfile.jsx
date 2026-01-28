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
  { key: "assignments", label: "Assignments" }
];

const StudentProfile = ({
  student = {},
  attendanceStats,
  assignmentStats,
  tabs = tabsConfig,
  defaultTab = "about",
}) => {

  const [activeTab, setActiveTab] = useState(defaultTab);

  const profile = useMemo(() => {
    const parentData = student.parent ? [
      {
        name: student.parent.name || "Not specified",
        phone: student.parent.phone || "Not specified",
        email: student.parent.email || "Not specified"
      }
    ] : [];

    return {
      name: student.name || "Not specified",
      role: "Student",
      class: student.class || "Not specified",
      gender: student.gender || "Not specified",
      dob: student.dob || "Not specified",
      email: student.email || "Not specified",
      phone: student.phone || "Not specified",
      parents: parentData,
      stats: {
        status: student.status || "Active",
        attendance: `${attendanceStats?.percentage || 0}%`,
        assignments: `${assignmentStats?.completed || 0}/${assignmentStats?.total || 0}`,
      },
      quickActions: [
        { label: "Edit Profile", icon: UserRound },
        { label: "Send Message", icon: MessageSquareText },
        { label: "View Attendance", icon: Calendar },
      ],
      ...student,
    };
  }, [student, attendanceStats, assignmentStats]);

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
                {profile.email && (
                  <InfoItem icon={Mail} label="Email" value={profile.email} />
                )}
                {profile.phone && (
                  <InfoItem icon={Phone} label="Phone" value={profile.phone} />
                )}
              </div>
            </div>

            {profile.parents && profile.parents.length > 0 && (
              <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
                <SectionTitle>Parent/Guardian Info</SectionTitle>
                <div className="mt-5 space-y-4">
                  {profile.parents.map((parent, index) => (
                    <div
                      key={index}
                      className="rounded-[18px] bg-white p-4 shadow-sm"
                    >
                      <div className="grid gap-4 text-sm text-[#123629] sm:grid-cols-2 lg:grid-cols-3">
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
                        {parent.email && (
                          <InfoItem
                            icon={Mail}
                            label="Email"
                            value={parent.email}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "attendance":
        return (
          <div className="space-y-6">
            {/* Attendance Statistics */}
            <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
              <SectionTitle>Attendance Overview</SectionTitle>
              <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Total Days"
                  value={attendanceStats?.total || 0}
                  color="bg-blue-100 text-blue-800"
                />
                <StatCard
                  label="Present"
                  value={attendanceStats?.present || 0}
                  color="bg-green-100 text-green-800"
                />
                <StatCard
                  label="Absent"
                  value={attendanceStats?.absent || 0}
                  color="bg-red-100 text-red-800"
                />
                <StatCard
                  label="Late"
                  value={attendanceStats?.late || 0}
                  color="bg-yellow-100 text-yellow-800"
                />
              </div>
              {attendanceStats?.percentage !== undefined && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#123629]">Overall Attendance Rate</span>
                    <span className="font-bold text-[#0B4B31]">{attendanceStats.percentage}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-[#0B4B31] transition-all duration-300"
                      style={{ width: `${attendanceStats.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Attendance Details Placeholder */}
            {/* <PlaceholderCard
              icon={Calendar}
              title="Attendance Details"
              description="Detailed attendance records and history will appear here."
            /> */}
          </div>
        );
      case "assignments":
        return (
          <div className="space-y-6">
            {/* Assignment Statistics */}
            <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
              <SectionTitle>Assignment Overview</SectionTitle>
              <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  label="Total Assignments"
                  value={assignmentStats?.total || 0}
                  color="bg-purple-100 text-purple-800"
                />
                <StatCard
                  label="Pending"
                  value={assignmentStats?.pending || 0}
                  color="bg-yellow-100 text-yellow-800"
                />
                <StatCard
                  label="Overdue"
                  value={assignmentStats?.overdue || 0}
                  color="bg-red-100 text-red-800"
                />
              </div>
              {assignmentStats?.total > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#123629]">Completion Rate</span>
                    <span className="font-bold text-[#0B4B31]">
                      {Math.round(((assignmentStats.total - assignmentStats.pending - assignmentStats.overdue) / assignmentStats.total) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-[#0B4B31] transition-all duration-300"
                      style={{
                        width: `${Math.round(((assignmentStats.total - assignmentStats.pending - assignmentStats.overdue) / assignmentStats.total) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Assignment Details Placeholder */}
            {/* <PlaceholderCard
              icon={ClipboardList}
              title="Assignment Details"
              description="Detailed assignment submissions and grades will appear here."
            /> */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white pb-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
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

      {/* Profile Image */}
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

          {/* Quick Stats */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-[18px] bg-[#E1F4EC] px-4 py-2">
              <span className="text-sm font-medium text-[#0B4B31]">
                Status: {profile.stats.status}
              </span>
            </div>
            <div className="rounded-[18px] bg-[#E1F4EC] px-4 py-2">
              <span className="text-sm font-medium text-[#0B4B31]">
                Attendance: {profile.stats.attendance}
              </span>
            </div>
            <div className="rounded-[18px] bg-[#E1F4EC] px-4 py-2">
              <span className="text-sm font-medium text-[#0B4B31]">
                Assignments: {profile.stats.assignments}
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            const getTabStyles = () => {
              if (isActive) {
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

const StatCard = ({ label, value, color }) => (
  <div className="rounded-[18px] bg-white p-4 shadow-sm">
    <div className="text-center">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${color}`}>
        {value}
      </div>
      <p className="mt-2 text-sm font-medium text-[#123629]">{label}</p>
    </div>
  </div>
);

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