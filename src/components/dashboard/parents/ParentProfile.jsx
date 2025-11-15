"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
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
          <div className="rounded-[30px] border border-[#D2E2DB] bg-[#E5EFEB] p-6 shadow-sm">
            <SectionTitle>Primary Information</SectionTitle>
            <div className="mt-5 grid gap-4 text-sm text-[#123629] sm:grid-cols-2 xl:grid-cols-4">
              <InfoItem icon={Phone} label="Phone" value={profile.phone} />
              <InfoItem icon={Mail} label="Email" value={profile.email} />
              <InfoItem icon={MapPin} label="Location" value={profile.location} />
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
                icon={Mail}
                label="Email"
                value={profile.spouse.email}
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value={profile.spouse.location}
              />
            </div>
          </div>
        );
      case "children":
        return (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {profile.children.map((child) => (
              <div
                key={child.id}
                className="flex flex-col gap-5 rounded-[26px] border border-[#D2E2DB] bg-white/85 p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E1F4EC] text-3xl text-[#0B4B31]">
                    👤
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#0B4B31]">
                      {child.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6A7A72]">
                      ID: {child.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-[#123629]">
                  <InfoRow label="Classes" value={child.classes} />
                  <InfoRow label="Date Of Birth" value={child.birthDate} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-full border border-[#0B4B31]/25 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                    View Profile
                  </button>
                  <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90">
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

      <div className="px-10 pb-8 pt-8 sm:px-12">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#0B4B31]">
              {profile.name}
            </h2>
            <p className="text-sm uppercase tracking-[0.35em] text-[#627169]">
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
                className={`flex items-center gap-2 rounded-[18px] px-6 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#B9F2E3] text-[#0B4B31]"
                    : "bg-[#E0ECE6] text-[#0B4B31]/70 hover:bg-[#D4E6DE]"
                }`}
              >
                <span className="text-lg">📁</span>
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
  <h3 className="text-lg font-semibold text-[#0B4B31]">{children}</h3>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.45)]">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4B31]/10 text-[#0B4B31]">
      <Icon size={16} />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7D8D87]">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#123629]">{value}</span>
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

const StatusCard = ({ stats }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-white/95 via-white/85 to-[#C7E7DD]/60 p-5 text-[#0B4B31] shadow-[0_24px_60px_-50px_rgba(0,0,0,0.65)] backdrop-blur">
    <h3 className="text-sm font-semibold">Account Status</h3>
    <div className="mt-4 space-y-3 text-sm">
      <StatusRow label="Status" value={stats?.status ?? "Active"} />
      <StatusRow label="Waiting List" value={stats?.waitingList ?? "No"} />
      <StatusRow label="Opted Out of Text" value={stats?.optedOut ?? "No"} />
    </div>
  </div>
);

const StatusRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-[14px] bg-[#EDF3F0] px-3 py-2">
    <span className="text-xs font-semibold text-[#6F8279]">{label}</span>
    <span className="text-sm font-semibold text-[#0B4B31]">{value}</span>
  </div>
);

const QuickActionCard = ({ actions = [] }) => (
  <div className="rounded-[26px] bg-gradient-to-br from-[#114F36] via-[#1C6A45] to-[#3E9A74] p-5 text-white shadow-[0_24px_60px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
      Quick Action
    </h3>
    <div className="mt-4 space-y-3">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="flex w-full items-center justify-between rounded-[16px] bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
        >
          <span className="flex items-center gap-2">
            {Icon ? <Icon size={16} /> : null}
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
