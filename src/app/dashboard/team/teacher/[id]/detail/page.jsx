"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import { getTeacherById, resetTeacherByIdState } from "@/redux/slices/teacherSlices/teacherSlices";
import { ArrowLeft, Edit, Mail, Phone, User, Calendar, MapPin, BookOpen, GraduationCap, Users, Languages, Clock } from "lucide-react";
import Image from "next/image";

export default function ViewTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainText } = useTheme();
  
  const { teacher, status, error } = useSelector((state) => state.getTeacherById);
  const [teacherData, setTeacherData] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    if (params?.id) {
      dispatch(getTeacherById(params.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (teacher) {
      setTeacherData(teacher);
      setImageError(false);
    }
  }, [teacher]);

  useEffect(() => {
    return () => {
      dispatch(resetTeacherByIdState());
    };
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'inactive':
        return "bg-red-100 text-red-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent"></div>
            <p className="mt-4 text-[#0B4B31]">Loading teacher details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !teacherData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">
              {error || "Teacher not found"}
            </p>
            <button
              onClick={() => router.push('/dashboard/teachers')}
              className="mt-4 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
            >
              Back to Teachers
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
            {mainText || "MaktabOS"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard/teachers')}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => router.push(`/dashboard/teachers/${teacherData._id}/edit`)}
          className="flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
        >
          <Edit size={16} />
          Edit Teacher
        </button>
      </div>

      <section className="rounded-[36px] border border-[#E2E7E4] bg-white px-6 py-6 shadow-[0_40px_80px_-60px_rgba(11,75,49,0.45)] sm:px-10">
        <h2 className="text-lg font-semibold text-[#104D2E] mb-6">Teacher Details</h2>

        {/* Profile Photo Section */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#0B4B31]/20">
            {teacherData.photo && !imageError ? (
              <Image
                src={teacherData.photo}
                alt={teacherData.fullName}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

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
                  {teacherData.fullName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Teacher ID</p>
                <p className="text-sm font-medium text-[#1E1E1E] break-all">
                  {teacherData._id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Gender</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {teacherData.gender || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Date of Birth</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(teacherData.dateOfBirth)}
                </p>
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
                  {teacherData.email || teacherData.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-2">
                  <Phone size={14} />
                  {teacherData.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Address</p>
                <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-2">
                  <MapPin size={14} />
                  {teacherData.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <GraduationCap size={16} />
              Professional Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Qualification</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {teacherData.qualification || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Specialization</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {teacherData.specialization || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Experience</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {teacherData.experienceYears || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Hire Date</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(teacherData.hireDate)}
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
                <p className="text-xs text-gray-600">Status</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(teacherData.status)}`}>
                  {teacherData.status || "Active"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600">Role</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {teacherData.user?.role || "Teacher"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Member Since</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(teacherData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-[#1E1E1E]">
                  {formatDate(teacherData.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Taught */}
        {teacherData.subjects && teacherData.subjects.length > 0 && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <BookOpen size={16} />
              Subjects Taught
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacherData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Classes */}
        {teacherData.assignedClasses && teacherData.assignedClasses.length > 0 && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <Users size={16} />
              Assigned Classes
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacherData.assignedClasses.map((classItem, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                >
                  Class ID: {classItem._id}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Total: {teacherData.assignedClasses.length} classes
            </p>
          </div>
        )}

        {/* Languages */}
        {teacherData.languages && teacherData.languages.length > 0 && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
              <Languages size={16} />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacherData.languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
          <h3 className="text-sm font-semibold text-[#0B4B31] mb-4 flex items-center gap-2">
            <Clock size={16} />
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-600">Attendance Records</p>
              <p className="text-sm font-medium text-[#1E1E1E]">
                {teacherData.attendanceRecords?.length || 0} records
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Timetable Entries</p>
              <p className="text-sm font-medium text-[#1E1E1E]">
                {teacherData.timetable?.length || 0} entries
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Database Version</p>
              <p className="text-sm font-medium text-[#1E1E1E]">
                v{teacherData.__v || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Photo Preview */}
        {teacherData.photo && (
          <div className="mt-6 rounded-[18px] border border-[#D2E2DB] bg-[#E5EFEB] p-6">
            <h3 className="text-sm font-semibold text-[#0B4B31] mb-3">Profile Photo Preview</h3>
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#0B4B31]/30">
                {!imageError ? (
                  <Image
                    src={teacherData.photo}
                    alt={`${teacherData.fullName}'s profile`}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}