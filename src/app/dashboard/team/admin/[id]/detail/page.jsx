"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAdminByIdAction } from "@/redux/slices/adminSlices/adminSlices";
import { ArrowLeft, Edit, Mail, Phone, User, Calendar, MapPin,ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ViewAdminPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { loading, admin, error } = useSelector((state) => state.getAdminById);
  const [adminData, setAdminData] = useState(null);
  console.log("admin", admin);
  
  useEffect(() => {
    if (params?.id) {
      dispatch(getAdminByIdAction(params.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (admin) {
      setAdminData(admin);
    }
  }, [admin]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    // Since your API doesn't have status, we'll assume active
    return "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
            <p className="mt-4 text-[#0B4B31]">Loading admin details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !adminData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">
              {error || "Admin not found"}
            </p>
            <button
              onClick={() => router.push('/dashboard/team/admin')}
              className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Back to Team
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard/team/admin')}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => router.push(`/dashboard/team/admin/${adminData._id}/edit`)}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <Edit size={16} />
          Edit Admin
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <h2 className="text-lg font-semibold text-[#104D2E] mb-6">Admin Details</h2>

        {/* Profile Photo Section */}
        {adminData.photo && (
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#0B4B31]/20">
              <Image
                src={adminData.photo}
                alt={adminData.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
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
                  {adminData.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Admin ID</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {adminData._id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Role</p>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                  Administrator
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
                  {adminData.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-2">
                  <Phone size={14} />
                  {adminData.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Address</p>
                <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-2">
                  <MapPin size={14} />
                  {adminData.address || "N/A"}
                </p>
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
                <p className="text-xs text-gray-600">Member Since</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(adminData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(adminData.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <ImageIcon size={16} />
              System Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Profile Photo</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {adminData.photo ? "Available" : "Not Available"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Database ID</p>
                <p className="text-sm font-medium text-[#1E1E1E] break-all">
                  {adminData._id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Version</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  v{adminData.__v || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Preview */}
        {adminData.photo && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-3">Profile Photo Preview</h3>
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#0B4B31]/30">
                <Image
                  src={adminData.photo}
                  alt={`${adminData.name}'s profile`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
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