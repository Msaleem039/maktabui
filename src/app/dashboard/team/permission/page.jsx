"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function PermissionPage() {
  const [searchValue, setSearchValue] = useState("");
  const { mainText } = useTheme();

  const permissions = [
    {
      id: "1",
      name: "Homeroom Teacher",
      permissions: [
        "Manage Students",
        "Manage Academics",
        "Manage Assignments",
        "Manage Assignment Types",
        "Manage Incidents",
        "Manage Behaviors",
        "Manage Behavior Types",
        "Manage Attendances",
        "Manage Gradebook",
      ],
      users: 2,
    },
    {
      id: "2",
      name: "Teachers",
      permissions: [
        "Manage Students",
        "Manage Academics",
        "Manage Assignments",
        "Manage Assignment Types",
        "Manage Incidents",
        "Manage Behaviors",
        "Manage Behavior Types",
        "Manage Attendances",
        "Manage Gradebook",
      ],
      users: 4,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">
            Welcome to
          </h1>
          <p className="text-[1.75rem] font-medium text-[#000000] mb-4">
            {mainText || "MaktabOS"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
        >
          <span className="text-lg">+</span>
          Add New Role
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Manage Permissions</h2>

        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>

          {/* See All Button */}
          <div>
            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            >
              See All ↗
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4">Name</th>
                <th className="px-4">Permissions</th>
                <th className="px-4">No. of Users</th>
                <th className="px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr
                  key={permission.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">{permission.name}</td>
                  <td className="px-4 py-3 text-[#555]">
                    <ul className="list-disc list-inside space-y-1">
                      {permission.permissions.map((perm, index) => (
                        <li key={index} className="text-sm">
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-[#555]">{permission.users}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90">
                      Take Action
                      <span>▾</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">Showing 2 out of 2 entries</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8A928F]">Display</span>
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white">
                1
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                2
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                3
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                4
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

