"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditStudentForm from "@/components/dashboard/students/EditStudentForm";
import { getStudentById } from "@/redux/slices/studentSlices/studentSlices";

export default function EditStudentPage({ params }) {
  const dispatch = useDispatch();
  const { student, status, error } = useSelector((state) => state.getStudentById);
  console.log("student",student);

  useEffect(() => {
    if (params?.id) {
      dispatch(getStudentById(params.id));
    }
  }, [dispatch, params?.id]);

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Loading student data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="space-y-8">
        <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-red-800 font-medium text-lg">Error loading student data</div>
                <div className="text-red-600 mt-1">{error}</div>
              </div>
            </div>
            <button
              onClick={() => params?.id && dispatch(getStudentById(params.id))}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <EditStudentForm studentId={params?.id} student={student} />
      </div>
    </div>
  );
}