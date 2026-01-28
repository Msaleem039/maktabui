"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTimetablesAction,
  deleteTimeTable,
} from "@/redux/slices/timetableSlices/timetableSlices";
import { getCookie } from "cookies-next";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { getAdminId } from "@/utils/getCookies";

export default function TimetablePage() {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    timetable: null,
  });
  const dropdownRefs = useRef({});
  const router = useRouter();
  const dispatch = useDispatch();
  const adminId = getAdminId();

  const {
    timetables,
    loading: timetableLoading,
    error: timetableError,
  } = useSelector((state) => state.getAllTimetables);

  const deleteState = useSelector((state) => state.deleteTimeTable);

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
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
    } else if (
      (user?.role === "Admin" || user?.role === "Super Admin") &&
      user?.id
    ) {
      requestData = { adminId: user.id };
    }

    dispatch(getAllTimetablesAction(requestData));
  }, [dispatch, user]);

  useEffect(() => {
    if (deleteState.success) {
      setDeleteModal({ open: false, timetable: null });

      let requestData = {};

      if (user?.role === "Student" && user?.id) {
        requestData = { studentId: user.id };
      } else if (user?.role === "Teacher" && user?.id) {
        requestData = { teacherId: user.id };
      } else if (
        (user?.role === "Admin" || user?.role === "Super Admin") &&
        user?.id
      ) {
        requestData = { adminId: user.id };
      }

      dispatch(getAllTimetablesAction(requestData));

      setTimeout(() => {
        dispatch(resetDeleteTimeTable());
      }, 2000);
    }
  }, [deleteState.success, dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, timetable, event) => {
    event.stopPropagation();
    if (action === "view") {
      router.push(`/dashboard/class/timetable/${timetable._id}/view`);
    } else if (action === "edit") {
      router.push(`/dashboard/class/timetable/${timetable._id}/edit`);
    } else if (action === "remove") {
      setDeleteModal({ open: true, timetable });
    }
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    if (deleteModal.timetable) {
      dispatch(deleteTimeTable(deleteModal.timetable._id));
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, timetable: null });
    // Clear any delete errors when closing modal
    if (deleteState.error) {
      dispatch(clearDeleteTimeTableError());
    }
  };

  const getTimetableDisplayName = (timetable) => {
    const className = timetable?.class?.name || "N/A";
    const subject = timetable?.subject || "N/A";
    const day = timetable?.dayOfWeek || "N/A";
    const time = `${timetable?.startTime} - ${timetable?.endTime}`;

    return `${className} - ${subject} (${day}, ${time})`;
  };

  if (timetableLoading)
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-[#0B4B31] mb-4">
            Manage Timetables
          </h1>
          {(user?.role === "Admin" || user?.role === "Super Admin") && (
            <Link
              href="/dashboard/class/createTimeTable"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B3120]"
            >
              <span className="text-lg">+</span>Add Timetable
            </Link>
          )}
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
          </div>
        </section>
      </div>
    );

  if (timetableError)
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-[#0B4B31] mb-4">
            Manage Timetables
          </h1>
          {(user?.role === "Admin" || user?.role === "Super Admin") && (
            <Link
              href="/dashboard/class/createTimeTable"
              className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B3120]"
            >
              <span className="text-lg">+</span>Add Timetable
            </Link>
          )}
        </div>

        <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
          <div className="text-center text-red-600 py-12">
            Error loading timetables: {timetableError}
            <button
              onClick={() => dispatch(getAllTimetablesAction())}
              className="mt-4 block mx-auto rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Try Again
            </button>
          </div>
        </section>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-[#0B4B31] mb-4">
          Manage Timetables
        </h1>
        {(user?.role === "Admin" || user?.role === "Super Admin") && (
          <Link
            href="/dashboard/class/createTimeTable"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4B3138] px-4 py-2 text-sm font-normal text-[#0B4B31] transition hover:bg-[#0B4B3120]"
          >
            <span className="text-lg">+</span>Add Timetable
          </Link>
        )}
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-semibold uppercase tracking-wide text-[#8A928F]">
            <tr>
              <th className="px-4 font-normal text-[#0000008C]">Class Name</th>
              <th className="px-4 font-normal text-[#0000008C]">Subject</th>
              <th className="px-4 font-normal text-[#0000008C]">Teacher</th>
              <th className="px-4 font-normal text-[#0000008C]">Day</th>
              <th className="px-4 font-normal text-[#0000008C]">Time</th>
              <th className="px-4 font-normal text-[#0000008C]">Topic</th>
              <th className="px-4 font-normal text-right text-[#0000008C]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {timetables.length > 0 ? (
              timetables.map((t) => (
                <tr
                  key={t._id}
                  className="rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm"
                >
                  <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                    {t.class?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                    {t.subject || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                    {t.teacher?.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                    {t.dayOfWeek || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1E1E1E]">{`${t.startTime} - ${t.endTime}`}</td>
                  <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                    {t.topic || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#1E1E1E]">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={(e) => toggleDropdown(t._id, e)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-[#71DD8C] transition hover:bg-[#0B4B31]/90"
                      >
                        Take Action
                        <span>▾</span>
                      </button>

                      {openDropdownId === t._id && (
                        <div
                          ref={(el) => (dropdownRefs.current[t._id] = el)}
                          className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-[#D2E2DB] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden"
                        >
                          {actionMenuItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.action}
                                type="button"
                                onClick={(e) =>
                                  handleActionClick(item.action, t, e)
                                }
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0B4B31] transition-all duration-150 ${
                                  idx === 0 ? "" : "border-t border-[#E2E7E4]"
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
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-[#8A928F]"
                >
                  No timetables found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Timetable"
        itemName={getTimetableDisplayName(deleteModal.timetable)}
        itemType="timetable entry"
        description={`Are you sure you want to delete this timetable entry? This will remove the scheduled class session from the timetable.`}
        warningText="This action cannot be undone. The timetable entry will be permanently deleted."
        confirmButtonText="Delete Timetable"
        cancelButtonText="Cancel"
        variant="danger"
        isLoading={deleteState.loading}
        size="md"
      />

      {/* Success/Error Messages */}
      {deleteState.success && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-green-100 px-4 py-3 text-green-800 shadow-lg">
          Timetable deleted successfully!
        </div>
      )}

      {deleteState.error && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-red-100 px-4 py-3 text-red-800 shadow-lg">
          Error: {deleteState.error}
        </div>
      )}
    </div>
  );
}