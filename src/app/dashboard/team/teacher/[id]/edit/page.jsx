"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherById, resetTeacherByIdState } from "@/redux/slices/teacherSlices/teacherSlices";
import EditTeacherDetail from "@/components/dashboard/team/EditTeacherDetail";

export default function EditTeacherPage(props) {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch();

  const { teacher, status, error } = useSelector((state) => state.getTeacherById);

  useEffect(() => {
    if (id) {
      dispatch(getTeacherById(id));
    }

    return () => {
      dispatch(resetTeacherByIdState());
    };
  }, [id, dispatch]);

  if (status === "loading") return <p>Loading teacher data...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (!teacher) return null;

  return <EditTeacherDetail teacher={teacher} {...props} />;
}
