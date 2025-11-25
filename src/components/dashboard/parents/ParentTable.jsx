"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Download, Eye, Pencil, Trash2, CheckCircle, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllParents, resetAllParentsState } from "@/redux/slices/parentSlices/parentSlice";

const ParentTable = ({
  title = "Parents",
  onSearchChange,
  searchValue = "",
  parents = [],
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { parents: reduxParents, pagination, status, error } = useSelector((state) => state.getAllParents);

  const [selectedId, setSelectedId] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [actionMenu, setActionMenu] = useState({ id: null, openUp: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, parent: null });
  const [commitModal, setCommitModal] = useState({ open: false, parent: null });
  const dropdownRefs = useRef({});

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
    event.preventDefault();

    // Calculate if menu should open upwards (if near bottom of viewport)
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const menuHeight = 200; // Approximate menu height

    setActionMenu(prev => ({
      id: prev.id === parentId ? null : parentId,
      openUp: spaceBelow < menuHeight
    }));
  };

  const handleView = (event, parentId) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    router.push(`/dashboard/parent/${parentId}`);
  };

  const handleEdit = (event, parentId) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    router.push(`/dashboard/parent/${parentId}/edit`);
  };

  const handleDelete = (event, parent) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    setDeleteModal({ open: true, parent });
  };

  const handleCommit = (event, parent) => {
    event.stopPropagation();
    setActionMenu({ id: null, openUp: false });
    setCommitModal({ open: true, parent });
  };

  const confirmDelete = () => {
    if (deleteModal.parent) {
      console.log("Delete parent:", deleteModal.parent.id);
      // TODO: Implement delete parent logic
      // dispatch(deleteParentAction(deleteModal.parent.id));
      setDeleteModal({ open: false, parent: null });
    }
  };

  const confirmCommit = () => {
    if (commitModal.parent) {
      console.log("Commit parent:", commitModal.parent.id);
      // TODO: Implement commit/save parent logic
      setCommitModal({ open: false, parent: null });
    }
  };

  useEffect(() => {
    if (!actionMenu.id) return;

    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown container (which includes the button)
      const dropdownRef = dropdownRefs.current[actionMenu.id];
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setActionMenu({ id: null, openUp: false });
      }
    };

    // Add event listener after a small delay to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenu.id]);

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
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div 
                      ref={(el) => (dropdownRefs.current[parent.id] = el)}
                      className="relative inline-block text-left"
                    >
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
                          className={`absolute right-0 ${actionMenu.openUp ? "bottom-full mb-3" : "top-full mt-2"} z-50 min-w-[180px] rounded-xl border border-[#00000040] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden`}
                        >
                          <button
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 bg-[#0B4B3138] hover:bg-[#E5EFEB]"
                            onClick={(event) => handleView(event, parent.id)}
                          >
                            <Eye size={16} className="text-[#0B4B31]" />
                            View
                          </button>
                          <button
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                            onClick={(event) => handleEdit(event, parent.id)}
                          >
                            <Pencil size={16} className="text-[#0B4B31]" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                            onClick={(event) => handleDelete(event, parent)}
                          >
                            <Trash2 size={16} className="text-[#C43B30]" />
                            Delete
                          </button>
                          <button
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] border-t border-[#00000040] transition-all duration-150 hover:bg-[#E5EFEB]"
                            onClick={(event) => handleCommit(event, parent)}
                          >
                            <CheckCircle size={16} className="text-[#0B4B31]" />
                            Commit
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteModal({ open: false, parent: null });
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-[#0B4B31]">
                  Delete Parent
                </h2>
              </div>
              <button
                onClick={() => setDeleteModal({ open: false, parent: null })}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to delete <span className="font-semibold text-[#0B4B31]">{deleteModal.parent?.name}</span>?
              </p>
              <p className="text-xs text-red-600">
                This action cannot be undone. All associated data will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setDeleteModal({ open: false, parent: null })}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commit Confirmation Modal */}
      {commitModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCommitModal({ open: false, parent: null });
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B4B31]/10">
                  <CheckCircle size={24} className="text-[#0B4B31]" />
                </div>
                <h2 className="text-lg font-semibold text-[#0B4B31]">
                  Commit Changes
                </h2>
              </div>
              <button
                onClick={() => setCommitModal({ open: false, parent: null })}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to commit changes for <span className="font-semibold text-[#0B4B31]">{commitModal.parent?.name}</span>?
              </p>
              <p className="text-xs text-gray-500">
                All pending changes will be saved and applied.
              </p>
            </div>

            <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setCommitModal({ open: false, parent: null })}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmCommit}
                className="flex-1 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
              >
                Commit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ParentTable;