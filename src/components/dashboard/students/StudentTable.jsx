"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, Eye, Pencil, MessageSquare, Trash2, ChevronDown } from "lucide-react";
import ActionMenu from "../ActionMenu";

const StudentTable = ({
  title = "Students (All Classes)",
  onSearchChange,
  searchValue = "",
  students = [],
  pagination = {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  onPageChange,
  onLimitChange,
  loading = false
}) => {
  const router = useRouter();

  const transformedStudents = useMemo(() => {
    return students.map((student) => ({
      id: student._id,
      name: student.studentName,
      parentName: student.parent?.fullName || "N/A",
      phone: student.phone,
      class: student.classes?.[0]?.name || student.class?.name || "Not Assigned",
      email: student.email,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      enrollDate: student.enrollDate,
      fee: student.fee,
      originalData: student
    }));
  }, [students]);

  const tableData = useMemo(() => {
    if (transformedStudents.length > 0) return transformedStudents;
    return [];
  }, [transformedStudents]);

  const [selectedId, setSelectedId] = useState(null);

  const filteredStudents = tableData;

  const handleSearchChange = (event) => {
    onSearchChange?.(event.target.value);
  };

  const handleRowSelect = (studentId) => {
    setSelectedId(studentId);
  };

  const handleView = (studentId) => {
    router.push(`/dashboard/student/${studentId}`);
  };

  const handleEdit = (studentId) => {
    router.push(`/dashboard/student/${studentId}/edit`);
  };

  const handleRemove = (studentId) => {
    if (confirm("Are you sure you want to remove this student?")) {
      console.log("Remove student:", studentId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPageNumbers = () => {
    const pages = [];
    const current = pagination.currentPage;
    const total = Math.max(1, pagination.totalPages || 0);

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
    if (typeof page === 'number' && page >= 1 && page <= Math.max(1, pagination.totalPages || 0)) {
      onPageChange?.(page);
    }
  };

  const actionMenuItems = [
    {
      label: "View Profile",
      icon: Eye,
      onClick: (studentId) => handleView(studentId),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: (studentId) => handleEdit(studentId),
    },
    {
      label: "Remove",
      icon: Trash2,
      onClick: (studentId) => handleRemove(studentId),
      iconClassName: "text-[#C43B30]",
    },
  ];

  const startIndex = (pagination.currentPage - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.currentPage * pagination.limit, pagination.totalCount || 0);

  return (
    <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">

      <h2 className="text-lg font-semibold text-[#104D2E] mb-4">
        {title}
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        <label className="relative flex w-full max-w-xl items-center">
          <span className="absolute left-4 text-[#0B4B31]/60">🔍</span>
          <input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by name, parent, email, phone, or class..."
            className="w-full rounded-full border border-[#0B4B31] bg-white py-3 pl-10 pr-4 text-sm text-[#0B4B31] outline-none focus:border-[#0B4B31] focus:bg-white"
          />
        </label>

        <div>
          <button
            type="button"
            className="rounded-full border border-[#0B4B31]/30 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
          >
            See All ↗
          </button>
        </div>
      </div>

      {
        loading && (
          <div className="mt-6 flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-[#0B4B31]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B4B31] border-r-transparent"></div>
              <span className="text-sm">Loading students...</span>
            </div>
          </div>
        )
      }

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-[#333]">
          <thead className="text-xs font-normal uppercase tracking-wide text-[#00000066]">
            <tr>
              <th className="px-4 font-normal text-[#0000008C]">Student Name</th>
              <th className="px-4 font-normal text-[#0000008C]">Parent Name</th>
              <th className="px-4 font-normal text-[#0000008C]">Phone Number</th>
              <th className="px-4 font-normal text-[#0000008C]">Class</th>
              <th className="px-4 font-normal text-[#0000008C]">Email</th>
              <th className="px-4 font-normal text-right text-[#0000008C]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.map((student) => {
              const isSelected = student.id === selectedId;
              return (
                <tr
                  key={student.id}
                  onClick={() => handleRowSelect(student.id)}
                  className={`group cursor-pointer rounded-3xl border border-[#E2E7E4] bg-[#FBFDFB] shadow-sm transition hover:shadow-md ${isSelected ? "bg-[#C9DCD4] border-[#AECDBF]" : ""
                    }`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B4B31]">
                    <div className="relative flex items-center gap-3 pl-3">
                      <span
                        className={`absolute left-0 inline-flex h-2 w-2 rounded-full transition ${isSelected
                          ? "bg-[#0B4B31]"
                          : "bg-transparent group-hover:bg-[#0B4B31]/50"
                          }`}
                      ></span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF] text-sm">
                        {student.gender === "Female" ? "👩" : "👨"}
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/student/${student.id}`}
                          className="font-medium text-[#1E1E1E] transition hover:text-[#0B4B31]/70"
                        >
                          {student.name}
                        </Link>
                        <span className="text-xs text-[#666]">
                          {student.gender} • {formatDate(student.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1E1E1E] font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F5EF] text-xs">
                        👤
                      </span>
                      <span className="font-medium text-[#1E1E1E]">{student.parentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#000000] font-medium text-sm">{student.phone}</td>
                  <td className="px-4 py-3 text-[#000000] font-medium text-sm">{student.class}</td>
                  <td className="px-4 py-3 text-[#000000] font-medium text-sm text-xs">
                    {student.email}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      triggerLabel="Take Action"
                      items={actionMenuItems.map(item => ({
                        ...item,
                        onClick: () => item.onClick(student.id)
                      }))}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {
        filteredStudents?.length === 0 && !loading && (
          <div className="text-center py-8 text-[#666]">
            {searchValue ? "No students match your search" : "No students found"}
          </div>
        )
      }

      {/* Always show pagination if there are students OR if we have pagination data */}
      {
        (pagination.totalCount > 0 || filteredStudents?.length > 0) && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#8A928F]">
              Showing {startIndex} to {endIndex} of {pagination.totalCount || filteredStudents?.length} students
              {searchValue && " (filtered)"}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageButtonClick(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || pagination.currentPage === 1}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${pagination.hasPrevPage ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ‹
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageButtonClick(page)}
                    disabled={page === '...'}
                    className={`rounded-full border border-[#C5D2CD] px-4 py-2 text-sm transition ${page === pagination.currentPage
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
                  onClick={() => handlePageButtonClick(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || pagination.currentPage === (pagination.totalPages || 0)}
                  className={`rounded-full border border-[#C5D2CD] bg-white px-3 py-2 text-sm text-[#0B4B31] transition ${pagination.hasNextPage ? 'hover:bg-[#F3F6F5]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )
      }
    </section >
  );
};

export default StudentTable;