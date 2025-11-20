"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Download, Eye, Pencil, MessageSquare, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllParents, resetAllParentsState } from "@/redux/slices/parentSlices/parentSlice";

const ParentTable = ({
  title = "Parents",
  onSearchChange,
  searchValue = "",
  parents = [],
}) => {
  const dispatch = useDispatch();
  const { parents: reduxParents, pagination, status, error } = useSelector((state) => state.getAllParents);

  const [selectedId, setSelectedId] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [actionMenu, setActionMenu] = useState({ id: null, openUp: false });

  useEffect(() => {
    dispatch(getAllParents({
      page: 1,
      limit: 10,
      search: localSearch,
      sortBy: "createdAt",
      sortOrder: "desc"
    }));

    return () => {
      dispatch(resetAllParentsState());
    };
  }, [dispatch, localSearch]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  const handleRowSelect = (parentId) => {
    setSelectedId(parentId);
  };

  const toggleActionMenu = (event, parentId) => {
    event.stopPropagation();

    // Calculate if menu should open upwards (if near bottom of viewport)
    const buttonRect = event.target.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const menuHeight = 200; // Approximate menu height

    setActionMenu(prev => ({
      id: prev.id === parentId ? null : parentId,
      openUp: spaceBelow < menuHeight
    }));
  };

  const handleViewProfile = (event, parentId) => {
    event.stopPropagation();
    // Implement view profile logic
    console.log("View profile:", parentId);
    setActionMenu({ id: null, openUp: false });
  };

  const handleEdit = (event, parentId) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
  };

  const handleComment = (event, parent) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
  };

  const handleRemove = (event, parent) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActionMenu({ id: null, openUp: false });
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const tableData = useMemo(() => {
    if (reduxParents && reduxParents.length > 0) {
      return reduxParents.map(parent => ({
        id: parent._id,
        name: parent.fullName,
        address: parent.address,
        phone: parent.phone,
        spouse: parent.spouse || "-",
        children: parent.students ? parent.students.length : 0,
        email: parent.email,
        identityNumber: parent.identityNumber,
        originalData: parent
      }));
    }

    if (parents.length > 0) return parents;

    return [];
  }, [reduxParents, parents]);

  const getInvoiceStatus = (parent) => {
    if (parent.fee && parent.fee > 0) {
      return { label: `$${parent.fee}`, tone: "overdue" };
    }
    return { label: "Paid", tone: "paid" };
  };

  return (
    <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#0B4B31]">{title}</h2>

        <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex w-full max-w-xl items-center">
          <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
          <input
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>

        {/* Loading State */}
        {status === "loading" && (
          <div className="text-sm text-[#0B4B31]">Loading parents...</div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <div className="text-sm text-red-600">Error: {error}</div>
        )}

        {/* Results Count */}
        {status === "succeeded" && reduxParents && (
          <div className="text-sm text-[#0B4B31]">
            Showing {reduxParents.length} of {pagination?.totalItems || 0} parents
          </div>
        )}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-normal uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-4 font-normal text-[#0000008C]">Primary Parent</th>
              <th className="px-4 font-normal text-[#0000008C]">Address</th>
              <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
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
                        {parent.email && (
                          <span className="text-xs text-[#8A928F]">
                            {parent.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">{parent.address}</td>
                  <td className="px-4 py-3 font-normal text-black">{parent.phone}</td>
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

        {/* Empty State */}
        {status === "succeeded" && (!tableData || tableData.length === 0) && (
          <div className="text-center py-8 text-[#0B4B31]">
            No parents found {localSearch && `for "${localSearch}"`}
          </div>
        )}
      </div>
    </section>
  );
};

export default ParentTable;