"use client";
import { useState, useEffect, useMemo } from "react";
import { Calendar, Upload, X, ArrowLeft, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  getAssignment,
  updateAssignment,
  clearUpdateStatus,
  clearError,
  getAssignmentById,
} from "@/redux/slices/assignmentSlices/assignmentSlices";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getStudentNamesWithIds } from "@/redux/slices/studentSlices/studentSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { getAdminId } from "@/utils/getCookies";

const FileUploadField = ({
  label,
  files,
  onFilesChange,
  existingAttachments = [],
  onRemoveExisting,
  className = "",
}) => {
  const adminId = getAdminId();
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const removeExistingAttachment = (index) => {
    if (onRemoveExisting) {
      onRemoveExisting(index);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-[#D5E2DB] rounded-2xl p-6 text-center">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center gap-2 bg-[#E5EFEB] text-[#0B4B31] rounded-full px-6 py-3 hover:bg-[#D4E6DE] transition"
        >
          <Upload size={16} />
          Upload Files
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, DOC, DOCX, Images
        </p>

        {/* Existing Attachments */}
        {existingAttachments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Existing Attachments:
            </p>
            <div className="space-y-2">
              {existingAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#F3F6F5] rounded-full px-4 py-2"
                >
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0B4B31] truncate flex-1 hover:underline"
                  >
                    {attachment.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeExistingAttachment(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Files */}
        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">New Files:</p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#F3F6F5] rounded-full px-4 py-2"
                >
                  <span className="text-sm text-[#0B4B31] truncate flex-1">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id;

  const {
    currentAssignment,
    updateStatus,
    updateError,
    fetchStatus,
    fetchError,
  } = useSelector((state) => state.assignment);

  const {
    teacherNames,
    status: teachersStatus,
    error: teachersError,
  } = useSelector((state) => state.getTeachersName);
  const {
    classNames,
    loading: classesLoading,
    error: classesError,
  } = useSelector((state) => state.getAllClassesName);
  const {
    students,
    status: studentsStatus,
    error: studentsError,
  } = useSelector((state) => state.getStudentNamesWithIds);

  const user = useMemo(() => {
    const userCookie = getCookie("user");
    return typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    subject: "",
    classId: "",
    teacherId: "",
    totalMarks: "",
    dueDate: "",
    attachments: [],
    student: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUserTeacherId, setCurrentUserTeacherId] = useState(null);

  useEffect(() => {
    if (assignmentId) {
      dispatch(getAssignmentById(assignmentId));
    }
    dispatch(getTeachersName(adminId));
    dispatch(getAllClassesNameAction(adminId));
    dispatch(getStudentNamesWithIds(adminId));
  }, [dispatch, assignmentId]);

  useEffect(() => {
    if (
      user &&
      user.role === "Teacher" &&
      teacherNames &&
      teacherNames.length > 0
    ) {
      const currentTeacher = teacherNames.find(
        (teacher) => teacher.user === user.id || teacher._id === user.id
      );

      if (currentTeacher) {
        setCurrentUserTeacherId(currentTeacher._id || currentTeacher.id);
      }
    }
  }, [user, teacherNames]);

  useEffect(() => {
    if (currentAssignment && currentAssignment._id === assignmentId) {
      const dueDate = currentAssignment.dueDate
        ? new Date(currentAssignment.dueDate).toISOString().split("T")[0]
        : "";

      setFormData({
        title: currentAssignment.title || "",
        description: currentAssignment.description || "",
        type: currentAssignment.type || "",
        subject: currentAssignment.subject || "",
        classId: currentAssignment.class?._id || currentAssignment.class || "",
        teacherId:
          currentAssignment.teacher?._id || currentAssignment.teacher || "",
        totalMarks: currentAssignment.totalMarks?.toString() || "",
        dueDate: dueDate,
        attachments: currentAssignment.attachments || [],
        student:
          currentAssignment.student?._id || currentAssignment.student || "",
      });

      setExistingAttachments(currentAssignment.attachments || []);
    }
  }, [currentAssignment, assignmentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownToggle = (name) => {
    if (name === "teacherId" && user?.role === "Teacher") {
      return;
    }
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleDropdownSelect = (name, value, selectedItem) => {
    if (name === "teacherId" && user?.role === "Teacher") {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDropdownOpen(null);
  };

  const handleStudentSelect = (name, studentId, selectedItem) => {
    setFormData((prev) => ({
      ...prev,
      student: studentId,
    }));
    setDropdownOpen(null);
  };

  const handleFilesChange = (files) => {
    setSelectedFiles(files);
  };

  const handleRemoveExistingAttachment = (index) => {
    const newAttachments = [...existingAttachments];
    newAttachments.splice(index, 1);
    setExistingAttachments(newAttachments);
    setFormData((prev) => ({
      ...prev,
      attachments: newAttachments,
    }));
  };

  const uploadFileToSupabase = (file) => {
    setUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.open("POST", "/api/uploadFile");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error("Network error"));
      };

      xhr.send(formData);
    });
  };

  const uploadFilesToSupabase = async (files) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map((file) => uploadFileToSupabase(file));
      const results = await Promise.all(uploadPromises);
      setUploading(false);
      setUploadProgress(0);
      return results;
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.type ||
      !formData.subject ||
      !formData.classId ||
      !formData.teacherId ||
      !formData.dueDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      let newUploadedAttachments = [];

      if (selectedFiles.length > 0) {
        newUploadedAttachments = await uploadFilesToSupabase(selectedFiles);
      }

      const allAttachments = [
        ...existingAttachments,
        ...newUploadedAttachments,
      ];

      const assignmentData = {
        assignmentId: assignmentId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subject: formData.subject,
        classId: formData.classId,
        teacherId: formData.teacherId,
        totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : 0,
        dueDate: formData.dueDate,
        attachments: allAttachments,
        student: formData.student,
      };

      dispatch(updateAssignment(assignmentData));
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    }
  };

  // Clear status and redirect on success
  useEffect(() => {
    if (updateStatus === "succeeded") {
      setTimeout(() => {
        router.push("/dashboard/assignment");
      }, 2000);
    }

    return () => {
      dispatch(clearUpdateStatus());
      dispatch(clearError());
    };
  }, [dispatch, updateStatus, router]);

  const assignmentTypeOptions = [
    { value: "Assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "project", label: "Project" },
    { value: "exam", label: "Exam" },
  ];

  const classOptions = (classNames || []).map((cls) => ({
    value: cls._id || cls.id,
    label: cls.name,
  }));

  const teacherOptions = (teacherNames || []).map((teacher) => ({
    value: teacher._id || teacher.id,
    label: teacher.fullName,
  }));

  const studentOptions = (students || []).map((student) => ({
    value: student._id || student.id,
    label: student.name || student.fullName || "Unknown Student",
  }));

  const currentTeacherName = currentUserTeacherId
    ? teacherOptions.find((teacher) => teacher.value === currentUserTeacherId)
        ?.label
    : "";

  const fetchingAssignment = fetchStatus === "loading";
  const fetchingTeachers = teachersStatus === "loading";
  const fetchingClasses = classesLoading;
  const fetchingStudents = studentsStatus === "loading";

  const isSubmitting = updateStatus === "loading" || uploading;
  const isLoadingData =
    fetchingAssignment ||
    fetchingTeachers ||
    fetchingClasses ||
    fetchingStudents;

  if (fetchingAssignment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4B31] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-[#0B4B31]">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (fetchError && !currentAssignment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading assignment: {fetchError}</p>
          <Link
            href="/dashboard/assignment"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-6 py-2 text-white hover:bg-[#0B4B31]/90"
          >
            <ArrowLeft size={16} />
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">
            Welcome to
          </p>
          <h1 className="text-[1.75rem] font-medium text-[#000000]">
            MaktabOS
          </h1>
        </div>

        <Link
          href="/dashboard/assignment"
          className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-normal text-white transition hover:bg-[#0B4B31]/90"
        >
          <ArrowLeft size={16} />
          Back to Assignments
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-6 text-[#000000]">
          Edit Assignment
        </h2>

        {/* Enhanced Status Messages */}
        <div className="space-y-4 mb-6">
          {/* File Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    Uploading files...
                  </span>
                </div>
                <span className="text-blue-600 text-sm font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Please wait while we upload your files. Do not close this page.
              </p>
            </div>
          )}

          {/* Assignment Update Progress */}
          {isSubmitting && !uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={18} className="animate-spin text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Updating assignment...
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-2 text-center">
                Saving your changes to the database.
              </p>
            </div>
          )}

          {/* Success Message */}
          {updateStatus === "succeeded" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">
                  Assignment updated successfully!
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1 text-center">
                Redirecting you back to assignments page...
              </p>
            </div>
          )}

          {/* Error Messages */}
          {updateError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-red-700 font-medium">
                  Error updating assignment:
                </span>
              </div>
              <p className="text-sm text-red-600 mt-1 text-center">
                {updateError}
              </p>
            </div>
          )}

          {teachersError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-center">
                Error loading teachers: {teachersError}
              </p>
            </div>
          )}

          {classesError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-center">
                Error loading classes: {classesError}
              </p>
            </div>
          )}

          {studentsError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-center">
                Error loading students: {studentsError}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Assignment Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter assignment title"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <SimpleDropdown
              label="Assignment Type"
              name="type"
              value={formData.type}
              options={assignmentTypeOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "type"}
              onToggle={handleDropdownToggle}
              placeholder="Select assignment type"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <FormInput
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <SimpleDropdown
              label="Class"
              name="classId"
              value={formData.classId}
              options={classOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "classId"}
              onToggle={handleDropdownToggle}
              placeholder={
                fetchingClasses ? "Loading classes..." : "Select a class"
              }
              required={true}
              disabled={isSubmitting || isLoadingData || fetchingClasses}
            />

            {/* Conditional Teacher Field */}
            {user?.role === "Teacher" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teacher <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700">
                  {fetchingTeachers ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    currentTeacherName || "No teacher found"
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically assigned as you are a teacher
                </p>
              </div>
            ) : (
              <SimpleDropdown
                label="Teacher"
                name="teacherId"
                value={formData.teacherId}
                options={teacherOptions}
                onSelect={handleDropdownSelect}
                isOpen={dropdownOpen === "teacherId"}
                onToggle={handleDropdownToggle}
                placeholder={
                  fetchingTeachers ? "Loading teachers..." : "Select a teacher"
                }
                required={true}
                disabled={isSubmitting || isLoadingData || fetchingTeachers}
              />
            )}

            <FormInput
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={formData.totalMarks}
              onChange={handleInputChange}
              placeholder="Enter total marks"
              disabled={isSubmitting || isLoadingData}
            />

            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              placeholder="Select due date"
              required={true}
              disabled={isSubmitting || isLoadingData}
            />

            <SimpleDropdown
              label="Assign to Student"
              name="student"
              value={formData.student}
              options={studentOptions}
              onSelect={handleStudentSelect}
              isOpen={dropdownOpen === "student"}
              onToggle={handleDropdownToggle}
              placeholder={
                fetchingStudents ? "Loading students..." : "Select a student"
              }
              required={false}
              disabled={isSubmitting || isLoadingData || fetchingStudents}
            />
          </div>

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter assignment description"
            className="sm:col-span-2"
            disabled={isSubmitting || isLoadingData}
          />

          <FileUploadField
            label="Attachments"
            files={selectedFiles}
            onFilesChange={handleFilesChange}
            existingAttachments={existingAttachments}
            onRemoveExisting={handleRemoveExistingAttachment}
            className="sm:col-span-2"
          />

          <div className="flex justify-center pt-6 gap-4">
            <Link
              href="/dashboard/assignment"
              className={`rounded-full px-8 py-3 text-sm font-semibold transition ${
                isSubmitting || isLoadingData
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingData}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition flex items-center gap-2 ${
                isSubmitting || isLoadingData
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {uploading ? "Uploading Files..." : "Updating Assignment..."}
                </>
              ) : (
                "Update Assignment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
