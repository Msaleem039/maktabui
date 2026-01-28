"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getSubAdminByIdAction } from "@/redux/slices/subadminSlices/subAdminSlices";
import Cookies from "js-cookie";
import EditSubAdminDetail from "@/components/dashboard/team/EditSubAdminDetail";

export default function EditSubAdminPage(props) {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch();
  const { loading, subAdmin, error } = useSelector(
    (state) => state.getSubAdminById
  );
  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        if (userData && userData.id) {
          setCurrentAdminId(userData.id);
        } else {
          console.error("User ID not found in cookie");
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    } else {
      console.error("User cookie not found");
    }
  }, []);

  useEffect(() => {
    if (id && currentAdminId) {
      dispatch(
        getSubAdminByIdAction({ adminId: currentAdminId, subAdminId: id })
      );
    }
  }, [id, currentAdminId, dispatch]);

  if (loading) return <p>Loading admin data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!subAdmin) return null;

  return <EditSubAdminDetail subAdmin={subAdmin} {...props} />;
}
