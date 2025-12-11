"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllParents,
  resetAllParentsState,
  setParentsPage,
  setParentsSearch,
  deleteParent
} from "@/redux/slices/parentSlices/parentSlice";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ActionMenu from "../ActionMenu";

const ParentTable = ({
  title = "Parents",
  onSearchChange,
  searchValue = "",
  parents = [],
  pagination = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  onPageChange,
  onLimitChange,
  loading = false
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    parents: reduxParents,
    pagination: reduxPagination,
    status,
    error,
    search: storeSearch
  } = useSelector((state) => state.getAllParents);

  const deleteState = useSelector((state) => state.deleteParent);

  const [selectedId, setSelectedId] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, parent: null });
  const [actionMenu, setActionMenu] = useState({ id: null, openUp: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  useEffect(() => {
    if (storeSearch) {
      setLocalSearch(storeSearch);
    }
  }, [storeSearch]);

  useEffect(() => {
    dispatch(getAllParents({
      page: reduxPagination.currentPage,
      limit: reduxPagination.itemsPerPage,
      search: debouncedSearch,
      sortBy: "createdAt",
      sortOrder: "desc"
    }));
  }, [dispatch, debouncedSearch, reduxPagination.currentPage, reduxPagination.itemsPerPage]);

  useEffect(() => {
    if (deleteState.success) {
      setDeleteModal({ open: false, parent: null });

      dispatch(getAllParents({
        page: reduxPagination.currentPage,
        limit: reduxPagination.itemsPerPage,
        search: debouncedSearch,
        sortBy: "createdAt",
        sortOrder: "desc"
      }));

      setTimeout(() => {
        dispatch(resetDeleteParent());
      }, 2000);
    }
  }, [deleteState.success, dispatch, debouncedSearch, reduxPagination.currentPage, reduxPagination.itemsPerPage]);

  useEffect(() => {
    return () => {
      dispatch(resetAllParentsState());
    };
  }, [dispatch]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearch(value);
    dispatch(setParentsSearch(value));
    onSearchChange?.(value);

    if (value !== debouncedSearch) {
      dispatch(setParentsPage(1));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= reduxPagination.totalPages) {
      dispatch(setParentsPage(newPage));
      onPageChange?.(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    onLimitChange?.(newLimit);
  };

  const handleRowSelect = (parentId) => {
    setSelectedId(parentId);
  };

  const toggleActionMenu = (event, parentId) => {
    event.stopPropagation();
    event.preventDefault();

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const menuHeight = 200;

    setActionMenu(prev => ({
      id: prev.id === parentId ? null : parentId,
      openUp: spaceBelow < menuHeight
    }));
  };

  const handleView = (parentId) => {
    setActionMenu({ id: null, openUp: false });
    // Navigate to parent detail page
    router.push(`/dashboard/parent/${parentId}`);
  };

  const handleEdit = (parentId) => {
    router.push(`/dashboard/parent/${parentId}/edit`);
  };

  const handleDelete = (parent) => {
    setDeleteModal({ open: true, parent });
  };

  const confirmDelete = () => {
    if (deleteModal.parent) {
      dispatch(deleteParent(deleteModal.parent.id));
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, parent: null });
    // Clear any delete errors when closing modal
    if (deleteState.error) {
      dispatch(clearDeleteParentError());
    }
  };

  useEffect(() => {
    if (!actionMenu.id) return;

    const handleClickOutside = (event) => {
      const dropdownRef = dropdownRefs.current[actionMenu.id];
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setActionMenu({ id: null, openUp: false });
      }
    };

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

  const getPageNumbers = () => {
    const pages = [];
    const current = reduxPagination.currentPage;
    const total = reduxPagination.totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  };

  const handlePageButtonClick = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= reduxPagination.totalPages) {
      handlePageChange(page);
    }
  };

  return (
    <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#0B4B31]">{title}</h2>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* <label className="relative flex w-full max-w-xl items-center">
          <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
          <input
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by name, email, phone, or ID..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label> */}

        {/* Loading State
      {status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-[#0B4B31]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B4B31] border-r-transparent"></div>
          Loading parents...
        </div>
      )}

      {/* Error State */}
        {status === "failed" && (
          <div className="text-sm text-red-600">Error: {error}</div>
        )}

        {/* Results Count */}
        {status === "succeeded" && reduxParents && (
          <div className="text-sm text-[#0B4B31]">
            Showing {reduxParents.length} of {reduxPagination?.totalItems || 0} parents
            {localSearch && " (filtered)"}
          </div>
        )}
      </div>

      {/* Loading overlay for table */}
      {
        loading && (
          <div className="mt-6 flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-[#0B4B31]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B4B31] border-r-transparent"></div>
              <span>Loading parents...</span>
            </div>
          </div>
        )
      }

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
                    <ActionMenu
                      triggerLabel="Take Action"
                      items={[
                        {
                          label: "View",
                          icon: Eye,
                          onClick: (e) => {
                            e?.stopPropagation();
                            handleView(parent.id);
                          },
                          className: "bg-[#0B4B3138]",
                        },
                        {
                          label: "Edit",
                          icon: Pencil,
                          onClick: () => handleEdit(parent.id),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          onClick: () => handleDelete(parent),
                          iconClassName: "text-[#C43B30]",
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {status === "succeeded" && (!tableData || tableData.length === 0) && (
          <div className="text-center py-8 text-[#0B4B31]">
            {localSearch ? `No parents found for "${localSearch}"` : "No parents found"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {
        reduxPagination.totalItems > 0 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {tableData.length} of {reduxPagination.totalItems} parents
              {localSearch && " (filtered)"}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(reduxPagination.currentPage - 1)}
                  disabled={!reduxPagination.hasPrevPage}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${reduxPagination.hasPrevPage ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ‹
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageButtonClick(page)}
                    disabled={page === '...'}
                    className={`rounded-full border border-[#C5D2CD] px-4 py-2 text-sm transition ${page === reduxPagination.currentPage
                      ? 'bg-[#0B4B31] text-white border-[#0B4B31]'
                      : page === '...'
                        ? 'bg-white text-[#0B4B31] cursor-default'
                        : 'bg-white text-[#0B4B31] hover:bg-[#F3F6F5]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(reduxPagination.currentPage + 1)}
                  disabled={!reduxPagination.hasNextPage}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${reduxPagination.hasNextPage ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )
      }

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Parent"
        itemName={deleteModal.parent?.name}
        itemType="parent"
        description={`Are you sure you want to delete ${deleteModal.parent?.name}? This will remove all their information and associated data.`}
        warningText="This action cannot be undone. All associated data will be permanently deleted."
        confirmButtonText="Delete Parent"
        cancelButtonText="Cancel"
        variant="danger"
        isLoading={deleteState.loading}
        size="md"
      />

      {
        deleteState.success && (
          <div className="fixed top-4 right-4 z-50 rounded-lg bg-green-100 px-4 py-3 text-green-800 shadow-lg">
            Parent deleted successfully!
          </div>
        )
      }

      {
        deleteState.error && (
          <div className="fixed top-4 right-4 z-50 rounded-lg bg-red-100 px-4 py-3 text-red-800 shadow-lg">
            Error: {deleteState.error}
          </div>
        )
      }
    </section >
  );
};

export default ParentTable;