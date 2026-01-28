"use client";

import StudentTable from "@/components/dashboard/students/StudentTable";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getParentChildById,
  resetParentChildState,
  clearParentChildError,
} from "@/redux/slices/studentSlices/studentSlices";
import { getCookie } from "cookies-next";
import { getUserId } from "@/utils/getCookies";

export default function ChildrensPage() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();
  const parentId = getUserId();
  console.log("parentId", parentId);

  const parentChildState = useSelector(
    (state) => state.getParentChildById || {}
  );

  const {
    parent = null,
    students = [],
    totalStudents = 0,
    status = "idle",
    error = null,
  } = parentChildState;
  console.log("Students", students);

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
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (parentId) {
      const requestData = {
        parentId: parentId,
        page: currentPage,
        limit: limit,
        search: debouncedSearch,
      };

      dispatch(getParentChildById(requestData));
    }
  }, [dispatch, parentId, currentPage, limit, debouncedSearch]);

  useEffect(() => {
    return () => {
      dispatch(resetParentChildState());
    };
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleClearError = () => {
    dispatch(clearParentChildError());
  };

  const pagination = useMemo(
    () => ({
      currentPage,
      limit,
      total: totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
    }),
    [currentPage, limit, totalStudents]
  );

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
          onClick={() => {
            handleClearError();
            const requestData = {
              parentId: parentId,
              page: currentPage,
              limit: limit,
              search: debouncedSearch,
            };
            dispatch(getParentChildById(requestData));
          }}
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
        title="My Children"
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
