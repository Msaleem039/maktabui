"use client";

import { useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParentById, resetAllParentsState } from "@/redux/slices/parentSlices/parentSlice";
import ParentProfile from "@/components/dashboard/parents/ParentProfile";

export default function ParentDetailPage({ params }) {
  const dispatch = useDispatch();
  const { parent,invoices, status, error } = useSelector((state) => state.getParentById);
  console.log("parent",parent);

  const resolvedParams = use(params);
  const parentId = resolvedParams.id;

  useEffect(() => {
    if (parentId) {
      dispatch(getParentById(parentId));
    }

    return () => {
      dispatch(resetAllParentsState());
    };
  }, [parentId, dispatch]);

  return (
    <div className="space-y-8">
      {status === "loading" && <p>Loading parent details...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {status === "succeeded" && parent && <ParentProfile invoices={invoices} parent={parent} />}
    </div>
  );
}