"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Pencil, MessageSquare, Trash2 } from "lucide-react";

const ParentTable = ({
  title = "Parents",
  onSearchChange,
  searchValue = "",
  parents = [],
}) => {
  const tableData = useMemo(() => {
    if (parents.length > 0) return parents;

    // Fallback demo data used in UI testing mode
    return Array.from({ length: 9 }, (_, index) => ({
      id: `parent-${index + 1}`,
      name: "Abdifatah Soyal",
      address: "1920 Portland Ave S Minneapolis MN",
      phone: "123456789",
      invoiceStatus:
        index === 3 || index === 8
          ? { label: "$650.00", tone: "overdue" }
          : { label: "Paid", tone: "paid" },
      spouse: "Sadiya Hassan",
      children: [1, 3, 3, 1, 1, 1, 5, 3, 2][index],
    }));
  }, [parents]);

  const [selectedId, setSelectedId] = useState(null);
  const [actionMenu, setActionMenu] = useState({ id: null, openUp: false });
  const [commentParent, setCommentParent] = useState(null);
  const [commentText, setCommentText] = useState("");
  const router = useRouter();

  const handleSearchChange = (event) => {
    onSearchChange?.(event.target.value);
  };

  const handleRowSelect = (parentId) => {
    setSelectedId(parentId);
  };

  useEffect(() => {
    const handleClickOutside = () => setActionMenu({ id: null, openUp: false });
    if (actionMenu.id) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [actionMenu.id]);

  const toggleActionMenu = (event, parentId) => {
    event.stopPropagation();
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 220;
    const openUp = buttonRect.bottom + menuHeight > window.innerHeight;
    setActionMenu((prev) =>
      prev.id === parentId ? { id: null, openUp: false } : { id: parentId, openUp }
    );
  };

  const handleViewProfile = (event, parentId) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    router.push(`/dashboard/parent/${parentId}`);
  };

  const handleEdit = (event, parentId) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    router.push(`/dashboard/parent/${parentId}/edit`);
  };

  const handleComment = (event, parent) => {
    event.stopPropagation();
    setCommentParent(parent);
    setCommentText("");
    setActionMenu({ id: null, openUp: false });
  };

  const handleRemove = (event, parent) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    if (window.confirm(`Remove ${parent.name} from list?`)) {
      console.log("Removing parent from list:", parent);
    }
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    console.log("Comment submitted for parent:", commentParent?.name, commentText);
    setCommentParent(null);
    setCommentText("");
  };

  return (
    <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#0B4B31]">{title}</h2>

        {/* <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90"
          >
            <Download size={15} />
            Export Data
          </button>

          <button
            type="button"
            className="rounded-full  px-4 py-2 text-sm font-normal bg-[#0B4B3138] text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
        </div> */}
      </div>

      {/* <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex w-full max-w-xl items-center">
          <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
          <input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>
      </div> */}
      {/* TOP CONTROLS — Export on top & See All bottom */}
      <div className="w-full flex flex-col gap-4">

        {/* Export Data (TOP) */}
        <div className="flex justify-start">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90"
          >
            <Download size={15} />
            Export Data
          </button>
        </div>

        {/* Search Bar (CENTER) */}
        <label className="relative flex w-full max-w-xl items-center mx-0">
          <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
          <input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>

        {/* See All (BOTTOM) */}
        <div className="flex justify-start">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-normal bg-[#0B4B3138] text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
        </div>
      </div>


      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-normal uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-4 font-normal text-[#0000008C]">Primary Parent</th>
              <th className="px-4 font-normal text-[#0000008C]">Address</th>
              <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
              <th className="px-4 font-normal text-[#0000008C]">Invoices</th>
              <th className="px-4 font-normal text-[#0000008C]">Spouse</th>
              <th className="px-4 font-normal text-[#0000008C]">Children</th>
              <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((parent) => {
              const isSelected = parent.id === selectedId;
              return (
                <tr
                  key={parent.id}
                  onClick={() => handleRowSelect(parent.id)}
                  className={`group cursor-pointer rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm transition hover:shadow-md ${isSelected ? "bg-[#C9DCD4] border-[#AECDBF]" : ""
                    }`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">
                    <div className="relative flex items-center gap-3 pl-3">
                      <span
                        className={`absolute left-0 inline-flex h-2 w-2 rounded-full transition ${isSelected ? "bg-[#0B4B31]" : "bg-transparent group-hover:bg-[#0B4B31]/50"
                          }`}
                      ></span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF] text-sm">
                        👤
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/parent/${parent.id}`}
                          className="font-medium text-[#1E1E1E] transition hover:text-[#0B4B31]/70"
                        >
                          {parent.name}
                        </Link>
                        {/* <span className="text-xs text-[#8A928F]">
                          Primary Parent
                        </span> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.address}</td>
                  <td className="px-4 py-3 font-normal text-black">{parent.phone}</td>
                  <td className="px-4 py-3">
                    {parent.invoiceStatus ? (
                      <span
                        className={`inline-flex rounded-full px-4 py-1 text-sm font-normal ${parent.invoiceStatus.tone === "overdue"
                          ? "bg-[#C43B30E0] text-white"
                          : "bg-[#0B4B31] text-[#71DD8C]"
                          }`}
                      >
                        {parent.invoiceStatus.label}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-black">{parent.spouse}</td>
                  <td className="px-4 py-3 text-black">{parent.children}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={(event) => toggleActionMenu(event, parent.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                      >
                        Take Action
                        <span>▾</span>
                      </button>
                      {actionMenu.id === parent.id && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className={`absolute right-0 ${actionMenu.openUp ? "bottom-full mb-3" : "mt-3"} w-48 rounded-2xl border border-[#DDE5E0] bg-white shadow-xl z-20 overflow-hidden`}
                        >
                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#0B4B31] hover:bg-[#F3F6F5]"
                            onClick={(event) => handleViewProfile(event, parent.id)}
                          >
                            <Eye size={16} />
                            View Profile
                          </button>
                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#0B4B31] hover:bg-[#F3F6F5]"
                            onClick={(event) => handleEdit(event, parent.id)}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#0B4B31] hover:bg-[#F3F6F5]"
                            onClick={(event) => handleComment(event, parent)}
                          >
                            <MessageSquare size={16} />
                            Comment
                          </button>
                          <button
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#C43B30] hover:bg-[#FCEDEA]"
                            onClick={(event) => handleRemove(event, parent)}
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {commentParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-[#0B4B31]">Add Comment</h3>
              <p className="text-sm text-[#5E6C64]">Parent: {commentParent.name}</p>
            </div>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                rows={4}
                placeholder="Write your comment..."
                className="w-full rounded-2xl border border-[#D5E2DB] px-4 py-3 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31]"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCommentParent(null);
                    setCommentText("");
                  }}
                  className="flex-1 rounded-full border border-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                >
                  Save Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ParentTable;

