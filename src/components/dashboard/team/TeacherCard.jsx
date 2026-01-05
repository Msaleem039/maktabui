"use client";

import Image from "next/image";
import { User, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { deleteTeacher, getAllTeachers } from "@/redux/slices/teacherSlices/teacherSlices";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

const TeacherCard = ({ teacher, onDelete, isExpanded, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { themeColor } = useTheme();
  const adminId = getAdminId();
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteTeacher(teacher._id)).unwrap();
      
      onDelete?.(teacher);
      
      await dispatch(getAllTeachers(adminId)).unwrap();
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting teacher:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div
        className={`relative rounded-[28px] overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-[320px]'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0">
          <Image
            src="/proofile card 4.svg"
            alt="Teacher card background"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className={`absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-b-[28px] p-4 border-t border-white/20 transition-all duration-300 ${isExpanded ? 'relative rounded-t-[28px]' : ''
          }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={onToggle}
              className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 ${isHovered || isExpanded ? 'shadow-lg' : 'shadow-md'
                }`}
            >
              {isExpanded ? (
                <ChevronUp size={16} style={{ color: themeColor }} />
              ) : (
                <ChevronDown size={16} style={{ color: themeColor }} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{teacher.name}</h3>
              {teacher.role && (
                <p className="text-sm text-gray-600 mt-1">({teacher.role})</p>
              )}
              <p className="text-sm text-gray-600 mt-1">{teacher.email}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center ml-4" style={{ backgroundColor: `${themeColor}1A` }}>
              <User size={24} style={{ color: themeColor }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {teacher.students !== undefined && teacher.students !== null && (
              <span className="inline-flex items-center px-3 py-2 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: themeColor }}>
                Students ({teacher.students})
              </span>
            )}
            {teacher.lastLogin && (
              <span className="inline-flex items-center px-3 py-2 rounded-full bg-[#F16957] text-white text-xs font-semibold">
                Last Login: {teacher.lastLogin}
              </span>
            )}
          </div>

          {teacher.className && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-2 rounded-full bg-cyan-100 text-gray-900 text-xs font-semibold">
                Class: {teacher.className}
              </span>
            </div>
          )}

          {isExpanded && (
            <div
              className="mt-4 pt-5 border-t border-gray-200/60 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                  <p className="text-gray-500 font-medium">Status</p>
                  <p className="font-semibold mt-1" style={{ color: themeColor }}>
                    {teacher.role === "Owner" ? "Administrator" : "Active"}
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                  <p className="text-gray-500 font-medium">Account Type</p>
                  <p className="font-semibold mt-1" style={{ color: themeColor }}>Teacher</p>
                </div>

                {teacher.joinedDate && (
                  <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                    <p className="text-gray-500 font-medium">Joined</p>
                    <p className="font-semibold mt-1" style={{ color: themeColor }}>{teacher.joinedDate}</p>
                  </div>
                )}

                {teacher.phone && (
                  <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/40">
                    <p className="text-gray-500 font-medium">Phone</p>
                    <p className="font-semibold mt-1" style={{ color: themeColor }}>{teacher.phone}</p>
                  </div>
                )}
              </div>

              <div className="bg-white/60 rounded-xl p-4 border border-white/40 shadow-sm">
                <p className="text-gray-500 font-medium text-sm mb-3">Quick Actions</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push(`/dashboard/team/teacher/${teacher._id}/detail`)}
                    className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <User size={16} />
                    View Profile
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/team/teacher/${teacher._id}/edit`)}
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
                    Delete Teacher
                  </button>
                </div>
              </div>
            </div>
          )}

          {teacher.showActions && (
            <div className={`flex gap-2 transition-all duration-300 ${isExpanded ? 'mt-4' : 'mt-3'
              }`}>
              <button
                onClick={() => router.push(`/dashboard/team/teacher/${teacher._id}/edit`)}
                className="flex-1 rounded-full bg-white border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 rounded-full px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColor }}
                onMouseEnter={(e) => e.target.style.backgroundColor = `${themeColor}E6`}
                onMouseLeave={(e) => e.target.style.backgroundColor = themeColor}
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
        title="Delete Teacher"
        itemName={teacher.name}
        itemType="teacher"
        description={`Are you sure you want to delete ${teacher.name}? This will remove all their data and access.`}
        warningText="This action cannot be undone. All associated data will be permanently deleted."
        confirmButtonText="Delete Teacher"
        cancelButtonText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        size="md"
      />
    </>
  );
};

export default TeacherCard;