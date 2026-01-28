"use client";

import StudentTable from "@/components/dashboard/students/StudentTable";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudents,
  setStudentsPage,
  setStudentsSearch,
  setStudentsLimit,
} from "@/redux/slices/studentSlices/studentSlices";
import { getCookie } from "cookies-next";
import { getAdminId } from "@/utils/getCookies";

export default function StudentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dispatch = useDispatch();
  const adminId = getAdminId();

  const {
    students,
    status,
    error,
    pagination,
    search: storeSearch,
  } = useSelector((state) => state.getAllStudents);

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (storeSearch) {
      setSearchValue(storeSearch);
    }
  }, [storeSearch]);

  useEffect(() => {
    if (debouncedSearch !== storeSearch) {
      dispatch(setStudentsSearch(debouncedSearch));
    }
  }, [debouncedSearch, storeSearch, dispatch]);

  useEffect(() => {
    const requestData = {
      page: pagination.currentPage,
      limit: pagination.limit,
      search: debouncedSearch,
      adminId: adminId,
    };

    if (user?.role === "Teacher") {
      requestData.teacherId = user.id;
    }

    dispatch(getAllStudents(requestData));
  }, [
    dispatch,
    user,
    debouncedSearch,
    pagination.currentPage,
    pagination.limit,
    adminId,
  ]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (value !== debouncedSearch) {
      dispatch(setStudentsPage(1));
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setStudentsPage(newPage));
  };

  const handleLimitChange = (newLimit) => {
    dispatch(setStudentsLimit(newLimit));
    dispatch(setStudentsPage(1));
  };

  if (status === "loading" && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg">Loading students...</div>
      </div>
    );
  }

  if (status === "failed" && students.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-500 text-lg mb-2">Error loading students</div>
        <div className="text-gray-600">{error}</div>
        <button
          onClick={() =>
            dispatch(
              getAllStudents({
                page: 1,
                limit: pagination.limit,
                search: debouncedSearch,
                adminId,
              })
            )
          }
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StudentTable
        title={
          user?.role === "Teacher" ? "My Students" : "Students (All Classes)"
        }
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
        students={students || []}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={status === "loading"}
      />
    </div>
  );
}
