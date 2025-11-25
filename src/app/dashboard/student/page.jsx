"use client";

import StudentTable from "@/components/dashboard/students/StudentTable";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllStudents,
  setStudentsPage 
} from "@/redux/slices/studentSlices/studentSlices";
import { getCookie } from "cookies-next";

export default function StudentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dispatch = useDispatch();

  const { students, status, error, pagination, search: storeSearch } = useSelector(
    (state) => state.getAllStudents
  );

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
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
    const requestData = {
      page: pagination.currentPage,
      limit: pagination.limit,
      search: debouncedSearch
    };

    if (user?.role === "Teacher") {
      requestData.teacherId = user.id;
    }

    dispatch(getAllStudents(requestData));
  }, [dispatch, user, debouncedSearch, pagination.currentPage, pagination.limit]);

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
    console.log("Change limit to:", newLimit);
  };

  if (status === "loading" && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  if (status === "failed" && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StudentTable
        title={user?.role === "Teacher" ? "My Students" : "Students (All Classes)"}
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
        students={students}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={status === "loading"}
      />
    </div>
  );
}