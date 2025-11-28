"use client";

import Image from "next/image";
import { User, Edit, Trash2, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { deleteAdminAction, getAllAdminsAction } from "@/redux/slices/adminSlices/adminSlices";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const AdminCard = ({ key, admin, onDelete, isExpanded, onToggle, isInstitute = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteAdminAction(admin._id)).unwrap();
      
      await dispatch(getAllAdminsAction()).unwrap();
      
      onDelete?.(admin);
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting admin:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  if (isInstitute) {
    return (
      <div className="relative h-[280px] rounded-[28px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/institute.svg"
            alt="Institute card background"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{admin.name}</h3>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#0B4B31]/10 flex items-center justify-center">
              <Building2 size={20} className="text-[#0B4B31]" />
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-[#0B4B31] text-xs">▾</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative rounded-[28px] overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-[320px]'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/proofile card 4.svg"
            alt="Admin card background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Glassmorphism overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20 transition-all duration-300 ${isExpanded ? 'relative rounded-t-[28px] mt-24' : ''
          }`}>

          {/* Expand/Collapse Button */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={onToggle}
              className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 ${isHovered || isExpanded ? 'shadow-lg' : 'shadow-md'
                }`}
            >
              {isExpanded ? (
                <ChevronUp size={16} className="text-[#0B4B31]" />
              ) : (
                <ChevronDown size={16} className="text-[#0B4B31]" />
              )}
            </button>
          </div>

          {/* Admin Info */}
          <div className="flex items-center justify-between mb-4 pt-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{admin.name}</h3>
              {admin.role && (
                <p className="text-sm text-gray-600 mt-1">({admin.role})</p>
              )}
              <p className="text-sm text-gray-600 mt-1">{admin.email}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#0B4B31]/10 flex items-center justify-center ml-4">
              <User size={24} className="text-[#0B4B31]" />
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-2 rounded-full bg-[#0B4B31] text-white text-xs font-semibold">
              Administrator
            </span>
            {admin.createdAt && (
              <span className="inline-flex items-center px-3 py-2 rounded-full bg-[#F16957] text-white text-xs font-semibold">
                Joined: {new Date(admin.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div
              className="mt-4 pt-5 border-t border-gray-200/60 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                {/* Joined Date */}
                {admin.createdAt && (
                  <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                    <p className="text-gray-500 font-medium">Joined Date</p>
                    <p className="text-[#0B4B31] font-semibold mt-1">
                      {new Date(admin.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {admin.phone && (
                  <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                    <p className="text-gray-500 font-medium">Phone</p>
                    <p className="text-[#0B4B31] font-semibold mt-1">{admin.phone}</p>
                  </div>
                )}

                {/* Address */}
                {admin.address && (
                  <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40 sm:col-span-2">
                    <p className="text-gray-500 font-medium">Address</p>
                    <p className="text-[#0B4B31] font-semibold mt-1">{admin.address}</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white/60 rounded-xl p-4 border border-white/40 shadow-sm">
                <p className="text-gray-500 font-medium text-sm mb-3">Quick Actions</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push(`/dashboard/team/admin/${admin._id}/detail`)}
                    className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <User size={16} />
                    View Profile
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/team/admin/${admin._id}/edit`)}
                    className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleDeleteClick}
                    className="flex-1 rounded-full bg-white border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 transition-all hover:bg-red-50 hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed Actions */}
          {!isExpanded && admin.showActions && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => router.push(`/dashboard/team/admin/${admin._id}/edit`)}
                className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 rounded-full bg-[#0B4B31] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0B4B31]/90 hover:shadow-md flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Admin"
        itemName={admin.name}
        itemType="admin"
        description={`Are you sure you want to delete ${admin.name}? This will remove all their data and access.`}
        warningText="This action cannot be undone. All associated data will be permanently deleted."
        confirmButtonText="Delete Admin"
        cancelButtonText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        size="md"
      />
    </>
  );
};

export default AdminCard;