"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClassesAction } from "@/redux/slices/classSlices/classSlice";
import { getCookie, deleteCookie } from "cookies-next";

export default function ClassPage() {

  const [searchValue, setSearchValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const dropdownRefs = useRef({});
  const router = useRouter();
  const dispatch = useDispatch();

  const { classes, loading, error } = useSelector((state) => state.getAllClasses);
  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);

  const actionMenuItems = [
    { label: "View Detail", icon: Eye, action: "view" },
    { label: "Edit", icon: Edit, action: "edit" },
    { label: "Remove", icon: Trash2, action: "remove" },
  ];

  useEffect(() => {
    let requestData = {};

    if (user?.role === "Student" && user?.id) {
      requestData = { studentId: user.id };
    } else if (user?.role === "Teacher" && user?.id) {
      requestData = { teacherId: user.id };
    }

    dispatch(getAllClassesAction(requestData));
  }, [dispatch, user]);

  useEffect(() => {
    if (classes && classes.length > 0) {
      const filtered = classes.filter((classItem) => {
        const searchLower = searchValue.toLowerCase();
        return (
          classItem.name?.toLowerCase().includes(searchLower) ||
          classItem.subject?.toLowerCase().includes(searchLower) ||
          classItem.code?.toLowerCase().includes(searchLower));
      });
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses([]);
    }
  }, [searchValue, classes]);

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
      router.push(`/dashboard/class/${id}`);
    } else if (action === "edit") {
      router.push(`/dashboard/class/${id}/edit`);
    } else if (action === "remove") {
      if (confirm("Are you sure you want to remove this class?")) {
        console.log(`Remove class ${id}`);
      }
    }
    setOpenDropdownId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000]  text-[1.75rem]">
              MaktabOS
            </h1>
          </div>
          {user?.role === "Admin" || user?.role === "Super Admin" && (
            <Link
              href="/dashboard/class/createClass"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
            >
              <span className="text-lg">+</span>
              Add New Class
            </Link>
          )}
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-[#0B4B31]">Loading classes...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000]  text-[1.75rem]">
              MaktabOS
            </h1>
          </div>
          {user?.role === "Admin" || user?.role === "Super Admin" && (
            <Link
              href="/dashboard/class/createClass"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
            >
              <span className="text-lg">+</span>
              Add New Class
            </Link>
          )}
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600">Error loading classes: {error}</p>
              <button
                onClick={() => dispatch(getAllClassesAction())}
                className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0B4B31] text-[2.5rem]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000]  text-[1.75rem]">
            MaktabOS
          </h1>
        </div>
        {user?.role === "Admin" || user?.role === "Super Admin" && (
          <Link
            href="/dashboard/class/createClass"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition"
          >
            <span className="text-lg">+</span>
            Add New Class
          </Link>
        )}
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#104D2E]">Manage Classes</h2>

          <div className="flex flex-wrap items-center gap-3">
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
              placeholder="Search by class name, subject, or code..."
              className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
            <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
              <tr>
                <th className="px-4 font-normal text-[#0000008C]">Class Name</th>
                <th className="px-4 font-normal text-[#0000008C]">Subject</th>
                <th className="px-4 font-normal text-[#0000008C]">Class Code</th>
                <th className="px-4 font-normal text-[#0000008C]">Duration</th>
                <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length > 0 ? (
                filteredClasses.map((classItem) => (
                  <tr
                    key={classItem._id}
                    className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                      {classItem.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                      {classItem.subject || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                      {classItem.code || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                      {formatDate(classItem.startDate)} - {formatDate(classItem.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#1E1E1E]">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => toggleDropdown(classItem._id, e)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
                        >
                          Take Action
                          <span>▾</span>
                        </button>

                        {openDropdownId === classItem._id && (
                          <div
                            ref={(el) => (dropdownRefs.current[classItem._id] = el)}
                            className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                          >
                            {actionMenuItems.map((item, idx) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.action}
                                  type="button"
                                  onClick={(e) => handleActionClick(item.action, classItem._id, e)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#8A928F]">
                    {classes.length === 0 ? "No classes found." : "No classes match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredClasses.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {filteredClasses.length} of {classes.length} entries
            </div>
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
        )}
      </section>
    </div>
  );
}