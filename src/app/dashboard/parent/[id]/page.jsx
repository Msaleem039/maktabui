"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParentById, resetAllParentsState } from "@/redux/slices/parentSlices/parentSlice";
import ParentProfile from "@/components/dashboard/parents/ParentProfile";

export default function ParentDetailPage({ params }) {
  const dispatch = useDispatch();
  
  const { parent, status, error } = useSelector((state) => state.getParentById);

  useEffect(() => {
    if (params?.id) {
      dispatch(getParentById(params.id));
    }

    return () => {
      dispatch(resetAllParentsState());
    };
  }, [params?.id, dispatch]);

  return (
    <div className="space-y-8">
      {status === "loading" && <p>Loading parent details...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {status === "succeeded" && parent && <ParentProfile parent={parent} />}
    </div>
  );
}
