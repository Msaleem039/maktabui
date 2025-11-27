"use client";

import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getTimetableByIdAction } from "@/redux/slices/timetableSlices/timetableSlices";
import TimetableDetailCard from "@/components/dashboard/classes/TimetableDetailCard";

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return "N/A";

  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diff = (end - start) / (1000 * 60);

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

export default function TimetableDetailPage(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Fix for Next.js 14+ - params is now a Promise
  // Extract the ID safely
  const timetableId = useMemo(() => {
    // If params is a Promise, we need to handle it differently
    // For now, use the props structure that Next.js provides
    if (props.params?.id) {
      return props.params.id;
    }
    if (props.searchParams?.id) {
      return props.searchParams.id;
    }
    // Fallback: check if there's an id in any possible location
    return props.id || null;
  }, [props.params, props.searchParams, props.id]);

  const {
    loading,
    timetable: currentTimetable,
    error
  } = useSelector(state => state.getTimetableById);

  useEffect(() => {
    if (timetableId) {
      dispatch(getTimetableByIdAction(timetableId));
    }
  }, [timetableId, dispatch]);

  const timetableData = useMemo(() => {
    if (!currentTimetable) return null;

    return {
      id: currentTimetable._id,
      class: currentTimetable.class?.name || "N/A",
      classCode: currentTimetable.class?.code || "N/A",
      classSubject: currentTimetable.class?.subject || "N/A",
      teacher: currentTimetable.teacher?.fullName || "N/A",
      teacherEmail: currentTimetable.teacher?.email || "N/A",
      teacherPhone: currentTimetable.teacher?.phone || "N/A",
      dayOfWeek: currentTimetable.dayOfWeek,
      startTime: currentTimetable.startTime,
      endTime: currentTimetable.endTime,
      subject: currentTimetable.subject,
      topic: currentTimetable.topic,
      duration: calculateDuration(currentTimetable.startTime, currentTimetable.endTime)
    };
  }, [currentTimetable]);

  const handleEditTimetable = () => {
    if (timetableData?.id) {
      router.push(`/dashboard/class/timetable/${timetableData.id}/edit`);
    }
  };

  const handleBackToList = () => {
    router.push('/dashboard/class/timetable');
  };

  console.log("Timetable ID:", timetableId);
  console.log("Current Timetable:", currentTimetable);
  console.log("Loading:", loading);
  console.log("Error:", error);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
              Welcome to
            </p>
            <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
              MaktabOS
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[#799086]">Loading timetable details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
              Welcome to
            </p>
            <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
              MaktabOS
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!loading && !currentTimetable && !error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
              Welcome to
            </p>
            <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
              MaktabOS
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[#799086]">Timetable not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
            Welcome to
          </p>
          <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
            MaktabOS
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border border-[#0B4B31] text-[#0B4B31] rounded-lg hover:bg-[#0B4B31] hover:text-white transition-colors"
          >
            Back to List
          </button>
          <button
            onClick={handleEditTimetable}
            className="px-4 py-2 bg-[#0B4B31] text-white rounded-lg hover:bg-[#083823] transition-colors"
          >
            Edit Timetable
          </button>
        </div>
      </div>

      {timetableData && (
        <TimetableDetailCard
          timetableData={timetableData}
          onEditTimetable={handleEditTimetable}
        />
      )}
    </div>
  );
}