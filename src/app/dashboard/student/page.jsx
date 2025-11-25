"use client";

import StudentTable from "@/components/dashboard/students/StudentTable";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents } from "@/redux/slices/studentSlices/studentSlices";
import { getCookie } from "cookies-next";

export default function StudentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const { students, status, error } = useSelector(
    (state) => state.getAllStudents
  );

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
  }, []);

  useEffect(() => {
    const requestData = {};

    if (user?.role === "Teacher") {
      requestData.teacherId = user.id;
    }

    dispatch(getAllStudents(requestData));
  }, [dispatch, user]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  if (status === "failed") {
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
        onSearchChange={setSearchValue}
        searchValue={searchValue}
        students={students}
      />
    </div>
  );
}