"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAdminByIdAction } from "@/redux/slices/adminSlices/adminSlices";
import EditAdminDetail from "@/components/dashboard/team/EditAdminDetail";

export default function EditAdminPage(props) {
    const params = useParams();
    const { id } = params;

    const dispatch = useDispatch();

    const { admin, loading, error } = useSelector((state) => state.getAdminById);

    useEffect(() => {
        if (id) {
            dispatch(getAdminByIdAction(id));
        }

    }, [id, dispatch]);

    if (loading) return <p>Loading admin data...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!admin) return null;

    return <EditAdminDetail admin={admin} {...props} />;
}