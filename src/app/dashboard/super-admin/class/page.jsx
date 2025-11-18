"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2 } from "lucide-react";

export default function ClassPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const router = useRouter();

  const tableData = Array.from({ length: 10 }, (_, index) => ({
    id: `class-${index + 1}`,
    teacherName: "202 Mohamed Karie Class",
    students: index === 0 ? "54" : "30",
    className: "203 Abdirahman Jama Class",
  }));

  const actionMenuItems = [
    { label: "View Detail", icon: Eye, action: "view" },
    { label: "Edit", icon: Edit, action: "edit" },
    { label: "Remove", icon: Trash2, action: "remove" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, id, event) => {
    event.stopPropagation();
    if (action === "view") {
      router.push(`/dashboard/super-admin/class/${id}`);
    } else {
      console.log(`${action} clicked for class ${id}`);
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
            Welcome to
          </p>
          <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
            MaktabOS
          </h1>
        </div>
        <Link
          href="/dashboard/super-admin/class/createClass"
          className="inline-flex items-center gap-2 rounded-full border border-[#0B4B31] bg-white px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
        >
          <span className="text-lg">+</span>
          Add New Class
        </Link>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Manage Classes</h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
            >
              <Download size={16} className="text-white" />
              Export Data
            </button>
            <button
              type="button"
              className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
            >
              See All ↗
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex w-full max-w-xl items-center">
            <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#C5D2CD] bg-[#F7FAF8] py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4">Teacher Name</th>
                <th className="px-4">Students</th>
                <th className="px-4">Class</th>
                <th className="px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((classItem) => (
                <tr
                  key={classItem.id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">{classItem.teacherName}</td>
                  <td className="px-4 py-3 text-[#555]">{classItem.students}</td>
                  <td className="px-4 py-3 text-[#555]">{classItem.className}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={(e) => toggleDropdown(classItem.id, e)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0B4B31]/90"
                      >
                        Take Action
                        <span>▾</span>
                      </button>

                      {openDropdownId === classItem.id && (
                        <div
                          ref={(el) => (dropdownRefs.current[classItem.id] = el)}
                          className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                        >
                          {actionMenuItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.action}
                                type="button"
                                onClick={(e) => handleActionClick(item.action, classItem.id, e)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0B4B31] transition-all duration-150 ${idx === 0 ? "" : "border-t border-[#E2E7E4]"
                                  } hover:bg-[#E5EFEB]`}
                              >
                                <Icon size={16} className="text-[#0B4B31]" />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[#8A928F]">Showing 1 to 10 of 50 entries</div>
          <div className="flex items-center gap-3">
            <select className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]">
              <option>Display 10</option>
              <option>Display 20</option>
              <option>Display 50</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                ‹
              </button>
              <button className="rounded-full border border-[#C5D2CD] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                1
              </button>
              <button className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white">
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
