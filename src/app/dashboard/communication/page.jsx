"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown, Users, ShieldCheck, GraduationCap } from "lucide-react";
import CommunicationPanel from "@/components/dashboard/CommunicationPanel";

const roleOptions = [
  {
    id: "admin",
    title: "Admin Team",
    description: "Coordinate with leadership and support teams.",
    icon: ShieldCheck,
  },
  {
    id: "teacher",
    title: "Teachers",
    description: "Discuss classes, assignments, and academic updates.",
    icon: GraduationCap,
  },
  {
    id: "parent",
    title: "Parents",
    description: "Stay connected with guardians for student progress.",
    icon: Users,
  },
];

const roleCopy = {
  admin: {
    title: "Admin Communication Hub",
    subtitle: "Collaborate with school leadership and operations staff.",
  },
  teacher: {
    title: "Teacher Communication Hub",
    subtitle: "Share resources and coordinate lesson plans in real time.",
  },
  parent: {
    title: "Parent Communication Hub",
    subtitle: "Engage with families and share important student updates.",
  },
};

const CommunicationPage = () => {
  const [roleChoice, setRoleChoice] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const activeRoleCopy = useMemo(() => {
    if (!selectedRole) return null;
    return roleCopy[selectedRole];
  }, [selectedRole]);

  const handleStartChat = () => {
    if (roleChoice) {
      setSelectedRole(roleChoice);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 py-2 sm:py-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 sm:flex-none min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Grid size={18} className="text-[#0B4B31]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Moon size={18} className="text-[#0B4B31]" />
            </button>
            <div className="flex items-center gap-2 bg-white border border-[#0B4B31] rounded-full px-2 py-1.5 pr-3 cursor-pointer hover:bg-emerald-50 shadow-sm">
              <div className="relative w-8 h-8 rounded-full border border-gray-200 overflow-hidden">
                <Image
                  src="/main-dashboard.jpg"
                  alt="user"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-gray-800 font-medium text-sm truncate max-w-[80px] sm:max-w-[120px]">
                Ahmed J.
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <p className="text-[2.5rem] font-semibold text-[#0B4B31] leading-tight">
          Communication Center
        </p>
        <p className="text-[1.25rem] text-[#5E6C64]">
          Seamless conversations between administrators, teachers, parents, and students
        </p>
      </div>

      {!selectedRole ? (
        <section className="rounded-[32px] border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-[#0B4B31]">Choose who you’d like to chat with</h2>
            <p className="text-sm text-[#5E6C64]">
              Select a role to filter conversations and keep your communication focused.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setRoleChoice(role.id);
                  setSelectedRole(role.id);
                }}
                className={`rounded-3xl border px-5 py-6 text-left transition shadow-sm ${
                  roleChoice === role.id ? "border-[#0B4B31] bg-[#F2F7F5]" : "border-[#E2E7E4] bg-white hover:border-[#0B4B31]/40"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0B4B31]/10 flex items-center justify-center text-[#0B4B31] mb-4">
                  <role.icon size={24} />
                </div>
                <p className="text-lg font-semibold text-[#0B4B31]">{role.title}</p>
                <p className="text-sm text-[#5E6C64] mt-2">{role.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#0B4B31] mb-2">
                Select Role
              </label>
              <select
                value={roleChoice}
                onChange={(e) => setRoleChoice(e.target.value)}
                className="w-full rounded-full border border-[#0B4B31] bg-white px-4 py-3 text-sm text-[#0B4B31] focus:outline-none focus:ring-2 focus:ring-[#0B4B31]/40"
              >
                <option value="">Choose...</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartChat}
              disabled={!roleChoice}
              className={`rounded-full px-8 py-3 text-sm font-semibold text-white transition ${
                roleChoice ? "bg-[#0B4B31] hover:bg-[#0a3f27]" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Start Chat
            </button>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => {
              setSelectedRole(null);
              setRoleChoice("");
            }}
            className="inline-flex items-center text-sm text-[#0B4B31] font-semibold hover:underline"
          >
            ← Choose another role
          </button>
          <CommunicationPanel
            panelTitle={activeRoleCopy?.title || "Live Conversations"}
            subtitle={activeRoleCopy?.subtitle || "Monitor, reply, and collaborate across roles"}
          />
        </div>
      )}
    </div>
  );
};

export default CommunicationPage;

