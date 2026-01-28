"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { getSubAdminByIdAction } from "@/redux/slices/subadminSlices/subAdminSlices";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  User,
  Calendar,
  MapPin,
  ImageIcon,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";

export default function ViewSubAdminPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainText } = useTheme();

  const { loading, subAdmin, error } = useSelector(
    (state) => state.getSubAdminById
  );
  const [subAdminData, setSubAdminData] = useState(null);
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
    if (currentAdminId && params?.id) {
      dispatch(
        getSubAdminByIdAction({
          adminId: currentAdminId,
          subAdminId: params.id,
        })
      );
    }
  }, [dispatch, params?.id, currentAdminId]);

  useEffect(() => {
    if (subAdmin) {
      setSubAdminData(subAdmin);
    }
  }, [subAdmin]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render permissions - UPDATED to handle array
  const renderPermissions = () => {
    if (
      !subAdminData?.permissions ||
      !Array.isArray(subAdminData.permissions) ||
      subAdminData.permissions.length === 0
    ) {
      return "No permissions assigned";
    }

    const permissions = subAdminData.permissions[0]; // Get first object from array
    const permissionList = [];

    if (permissions.manageStudents) permissionList.push("Manage Students");
    if (permissions.manageParents) permissionList.push("Manage Parents");
    if (permissions.manageTeachers) permissionList.push("Manage Teachers");
    if (permissions.manageClasses) permissionList.push("Manage Classes");

    return permissionList.length > 0
      ? permissionList.join(", ")
      : "No permissions assigned";
  };

  // Check if permission exists - UPDATED to handle array
  const hasPermission = (permissionName) => {
    if (
      !subAdminData?.permissions ||
      !Array.isArray(subAdminData.permissions) ||
      subAdminData.permissions.length === 0
    ) {
      return false;
    }
    const permissions = subAdminData.permissions[0];
    return permissions[permissionName] === true;
  };

  // Check if sub-admin is active
  const isActive = subAdminData?.isActive === true;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText || "MaktabOS"}
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
            <p className="mt-4 text-[#0B4B31]">Loading sub-admin details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subAdminData) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
              Welcome to
            </p>
            <h1 className="font-medium text-[#000000] text-[1.75rem]">
              {mainText || "MaktabOS"}
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">{error || "Sub-admin not found"}</p>
            <button
              onClick={() => router.push("/dashboard/team/sub-admin")}
              className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Back to Sub-Admins
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31]">
            Welcome to
          </p>
          <h1 className="font-medium text-[#000000] text-[1.75rem]">
            MaktabOS
          </h1>
          {currentAdminId && (
            <p className="text-sm text-gray-500 mt-2">
              Admin ID: {currentAdminId.substring(0, 8)}...
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/team/sub-admin")}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back to Sub-Admins
        </button>
        <button
          onClick={() =>
            router.push(`/dashboard/team/sub-admin/${subAdminData._id}/edit`)
          }
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <Edit size={16} />
          Edit Sub-Admin
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <h2 className="text-lg font-semibold text-[#104D2E] mb-6">
          Sub-Admin Details
        </h2>

        {/* Profile Photo Section */}
        {subAdminData.photo && (
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#0B4B31]/20">
              <Image
                src={subAdminData.photo}
                alt={subAdminData.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <User size={48} className="text-gray-400" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <User size={16} />
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Full Name</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {subAdminData.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Sub-Admin ID</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {subAdminData._id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Role</p>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800">
                  Sub-Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <Mail size={16} />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-2">
                  <Mail size={14} />
                  {subAdminData.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-2">
                  <Phone size={14} />
                  {subAdminData.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Account Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions Information */}
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <Shield size={16} />
              Permissions
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Assigned Permissions</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {renderPermissions()}
                </p>
              </div>

              {/* Permission Details - UPDATED to use hasPermission function */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  {hasPermission("manageStudents") ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                  <span className="text-xs">Manage Students</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission("manageParents") ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                  <span className="text-xs">Manage Parents</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission("manageTeachers") ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                  <span className="text-xs">Manage Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission("manageClasses") ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                  <span className="text-xs">Manage Classes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <Calendar size={16} />
              Account Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Created At</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(subAdminData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(subAdminData.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {subAdminData.photo && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-3">
              Profile Photo Preview
            </h3>
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#0B4B31]/30">
                <Image
                  src={subAdminData.photo}
                  alt={`${subAdminData.name}'s profile`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
                  <User size={48} className="text-gray-400" />
                  <span className="sr-only">Profile photo not available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
