"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone,
  Calendar,
  Users2,
  Receipt,
  CreditCard,
  MessageSquareText,
  UserRound,
} from "lucide-react";

const tabsConfig = [
  { key: "about", label: "About" },
  { key: "children", label: "Childrens" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments Methods" },
  { key: "comments", label: "Comments" },
];

const ParentProfile = ({
  parent = {},
  tabs = tabsConfig,
  defaultTab = "about",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const profile = useMemo(
    () => ({
      name: "Abdifatah Soyal",
      role: "Parent",
      phone: "612-636-1149",
      email: "user@gmail.com",
      location: "1920 Portland Ave S Minneapolis MN",
      memberSince: "2025-01-01",
      spouse: {
        name: "Sadiya Hassan",
        phone: "612-636-1149",
        email: "user@gmail.com",
        location: "1920 Portland Ave S Minneapolis MN",
      },
      children: [
        {
          id: "21057",
          name: "Abdikadir Abdulkadir",
          classes: "2021 Mohamed Krie Class",
          birthDate: "September 18, 2018",
        },
      ],
      stats: {
        status: "Active",
        waitingList: "No",
        optedOut: "No",
      },
      quickActions: [
        { label: "Edit Profile", icon: UserRound },
        { label: "Send Message", icon: MessageSquareText },
        { label: "Edit Profile", icon: UserRound },
      ],
      ...parent,
    }),
    [parent]
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="rounded-[30px] border border-[#D2E2DB] bg-[#CEDBD6] p-6">
            <SectionTitle>Primary Information</SectionTitle>
            <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-4">
              <InfoItem icon={Phone} label="Phone" value={profile.phone} />
              <InfoItem iconSrc="/Email.svg" label="Email" value={profile.email} />
              <InfoItem iconSrc="/Location.svg" label="Location" value={profile.location} />
              <InfoItem
                icon={Calendar}
                label="Member Since"
                value={profile.memberSince}
              />
            </div>

            <div className="my-6 h-px w-full bg-[#CAD9D2]" />

            <SectionTitle>Spouse Information</SectionTitle>
            <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-4">
              <InfoItem
                icon={Users2}
                label="Spouse Name"
                value={profile.spouse.name}
              />
              <InfoItem
                icon={Phone}
                label="Phone"
                value={profile.spouse.phone}
              />
              <InfoItem
                iconSrc="/Email.svg"
                label="Email"
                value={profile.spouse.email}
              />
              <InfoItem
                iconSrc="/Location.svg"
                label="Location"
                value={profile.spouse.location}
              />
            </div>
          </div>
        );
      case "children":
        return (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {profile.children.map((child) => (
              <div
                key={child.id}
                className="flex flex-col gap-5 rounded-[26px] border-[#00000030] bg-[#CEDBD6] px-6 py-10 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur text-3xl text-white">
                    👤
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {child.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                      ID: {child.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <ChildInfoRow label="Classes" value={child.classes} />
                  <ChildInfoRow label="Date Of Birth" value={child.birthDate} />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-white/25 backdrop-blur">
                    View Profile
                  </button>
                  <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-white/90">
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "invoices":
        return (
          <PlaceholderCard
            icon={Receipt}
            title="Invoices"
            description="Invoice history and outstanding balances will appear here."
          />
        );
      case "payments":
        return (
          <PlaceholderCard
            icon={CreditCard}
            title="Payment Methods"
            description="Stored payment methods will appear here."
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
          alt="Parent profile background"
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
              alt="Parent profile avatar"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-10 pb-8 pt-2 sm:px-12">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[1.75rem] font-medium text-[#0B4B31]">
              {profile.name}
            </h2>
            <p className="text-sm uppercase  text-[#0B4B31]">
              {profile.role}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-0 sm:grid-cols-2 sm:gap-6">
            <StatusCard stats={profile.stats} />
            <QuickActionCard actions={profile.quickActions} />
          </div>
        </div>

        <nav className="mt-8 flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-[18px] px-6 py-3 text-xs font-medium transition ${isActive
                  ? "bg-[#96E2D6FA] text-black"
                  : "bg-[#E0ECE6] text-[#0B4B31]/70 hover:bg-[#D4E6DE]"
                  }`}
              >
                <span className="text-[1.25rem]">📁</span>
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

const InfoItem = ({ icon: Icon, iconSrc, label, value }) => (
  <div className="flex items-center gap-3 rounded-[18px] px-4 py-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full">
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={label}
          width={20}
          height={20}
          className="object-contain"
        />
      ) : Icon ? (
        <Icon size={20} className="text-[#0B4B31] fill-[#0B4B31]" />
      ) : null}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-[#0B4B31]">
        {label}
      </span>
      <span className="text-xs font-medium text-black">{value}</span>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[18px] bg-[#F3F6F5] px-4 py-3">
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7D8D87]">
      {label}
    </span>
    <span className="text-sm font-semibold text-[#123629]">{value}</span>
  </div>
);

const ChildInfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[18px] bg-gradient-to-r from-[#85A598] to-[#0B4B31] px-4 py-3">
    <span className="text-sm font-medium text-[#000000]">
      {label}
    </span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);

const StatusCard = ({ stats }) => (
  <div className="rounded-[26px] p-5 bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74]">
    <h3 className="text-base text-white text-center font-extrabold">Account Status</h3>
    <div div className="mt-4 space-y-3 text-sm" >
      <StatusRow label="Status" value={stats?.status ?? "Active"} />
      <StatusRow label="Waiting List" value={stats?.waitingList ?? "No"} />
      <StatusRow label="Opted Out of Text" value={stats?.optedOut ?? "No"} />
    </div >
  </div >
);

const StatusRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[14px] bg-[#F8F8F8] px-3 py-2">
    <span className="text-[0.6875rem] font-normal text-black">{label}</span>
    <span className="text-[0.6875rem] font-semibold text-black">{value}</span>
  </div>
);

const QuickActionCard = ({ actions = [] }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74] py-5 px-10 text-white shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
    <h3 className="text-base font-extrabold text-center text-white">
      Quick Action
    </h3>
    <div className="mt-4 space-y-3">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="flex w-full items-center justify-between rounded-[16px] bg-[#F8F8F8] px-4 py-3 text-[0.6875rem] font-normal text-black transition"
        >
          <span className="flex items-center gap-2">
            {Icon ? <Icon size={14} /> : null}
            {label}
          </span>
          <span>↗</span>
        </button>
      ))}
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

export default ParentProfile;
