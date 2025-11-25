"use client";
import { useState, useEffect } from "react";
import { Calendar, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createAssignment, clearCreateStatus, clearError } from "@/redux/slices/assignmentSlices/assignmentSlices";
import { getTeachersName } from "@/redux/slices/teacherSlices/teacherSlices";
import { getAllClassesNameAction } from "@/redux/slices/classSlices/classSlice";
import { getStudentNamesWithIds } from "@/redux/slices/studentSlices/studentSlices";
import { FormInput } from "@/components/FormInput";
import { SimpleDropdown } from "@/components/SimpleDropdown";

const FileUploadField = ({ label, files, onFilesChange, className = "" }) => {
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
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
        <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX, Images</p>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-[#F3F6F5] rounded-full px-4 py-2">
                <span className="text-sm text-[#0B4B31] truncate flex-1">{file.name}</span>
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
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const dispatch = useDispatch();

  const { createStatus, createError } = useSelector((state) => state.assignment);
  const { teacherNames, status: teachersStatus, error: teachersError } = useSelector((state) => state.getTeachersName);
  const { classNames, loading: classesLoading, error: classesError } = useSelector((state) => state.getAllClassesName);
  const { students, status: studentsStatus, error: studentsError } = useSelector((state) => state.getStudentNamesWithIds);

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
    student: "" // Changed from students array to single student ID
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch initial data
  useEffect(() => {
    dispatch(getTeachersName());
    dispatch(getAllClassesNameAction());
    dispatch(getStudentNamesWithIds());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownToggle = (name) => {
    setDropdownOpen(prev => prev === name ? null : name);
  };

  const handleDropdownSelect = (name, value, selectedItem) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setDropdownOpen(null);
  };

  // Handle student selection - single student
  const handleStudentSelect = (name, studentId, selectedItem) => {
    setFormData(prev => ({
      ...prev,
      student: studentId // Store as single student ID
    }));
    setDropdownOpen(null);
  };

  const handleFilesChange = (files) => {
    setSelectedFiles(files);
  };

  // File upload function using XMLHttpRequest
  const uploadFileToSupabase = (file) => {
    const SUPABASE_URL = "https://rixdrbokebnvidwyzvzo.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGRyYm9rZWJudmlkd3l6dnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjMzMzIsImV4cCI6MjA0ODE5OTMzMn0.Zhnz5rLRoIhtHyF52pFjzYijNdxgZBvEr9LtOxR2Lhw";
    const fileName = `${Date.now()}_${file.name}`;

    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${SUPABASE_URL}/storage/v1/object/maktab-system/${fileName}`
        );
        xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_KEY}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/maktab-system/${fileName}`;
            resolve({
              name: file.name,
              url: fileUrl,
              size: file.size,
              type: file.type,
              fileName: fileName
            });
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.send(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Upload multiple files
  const uploadFilesToSupabase = async (files) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadPromises = files.map(file => uploadFileToSupabase(file));
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

    // Basic validation
    if (!formData.title || !formData.type || !formData.subject || !formData.classId || !formData.teacherId || !formData.dueDate) {
      alert('Please fill all required fields');
      return;
    }

    try {
      let uploadedAttachments = [];

      // Upload files to Supabase if any files are selected
      if (selectedFiles.length > 0) {
        uploadedAttachments = await uploadFilesToSupabase(selectedFiles);
      }

      const assignmentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subject: formData.subject,
        classId: formData.classId,
        teacherId: formData.teacherId,
        totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : 0,
        dueDate: formData.dueDate,
        attachments: uploadedAttachments,
        student: formData.student 
      };

      dispatch(createAssignment(assignmentData));

    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  // Clear status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCreateStatus());
      dispatch(clearError());
    };
  }, [dispatch]);

  // Reset form on success
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setFormData({
        title: "",
        description: "",
        type: "",
        subject: "",
        classId: "",
        teacherId: "",
        totalMarks: "",
        dueDate: "",
        attachments: [],
        student: "" // Reset to empty string
      });
      setSelectedFiles([]);
      setUploadProgress(0);
    }
  }, [createStatus]);

  // Transform data for SimpleDropdown
  const assignmentTypeOptions = [
    { value: "Assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "project", label: "Project" },
    { value: "exam", label: "Exam" }
  ];

  const classOptions = (classNames || []).map(cls => ({
    value: cls._id || cls.id,
    label: cls.name
  }));

  const teacherOptions = (teacherNames || []).map(teacher => ({
    value: teacher._id || teacher.id,
    label: teacher.fullName
  }));

  const studentOptions = (students || []).map(student => ({
    value: student._id || student.id,
    label: student.name || student.fullName || "Unknown Student"
  }));

  const fetchingTeachers = teachersStatus === "loading";
  const fetchingClasses = classesLoading;
  const fetchingStudents = studentsStatus === "loading";

  const isSubmitting = createStatus === 'loading' || uploading;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[2.5rem] font-semibold text-[#0B4B31] mb-1">Welcome to</p>
          <h1 className="text-[1.75rem] font-medium text-[#000000]">MaktabOS</h1>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-6 text-[#000000]">Create Assignment</h2>

        {/* Status Messages */}
        {uploading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center mb-6">
            <div>Uploading files... {uploadProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {isSubmitting && !uploading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-full text-center mb-6">
            Creating assignment...
          </div>
        )}

        {createStatus === 'succeeded' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-full text-center mb-6">
            Assignment created successfully!
          </div>
        )}

        {createError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error: {createError}
          </div>
        )}

        {teachersError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error loading teachers: {teachersError}
          </div>
        )}

        {classesError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error loading classes: {classesError}
          </div>
        )}

        {studentsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full text-center mb-6">
            Error loading students: {studentsError}
          </div>
        )}

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
            />

            <FormInput
              label="Subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              required={true}
            />

            <SimpleDropdown
              label="Class"
              name="classId"
              value={formData.classId}
              options={classOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "classId"}
              onToggle={handleDropdownToggle}
              placeholder={fetchingClasses ? "Loading classes..." : "Select a class"}
              required={true}
            />

            <SimpleDropdown
              label="Teacher"
              name="teacherId"
              value={formData.teacherId}
              options={teacherOptions}
              onSelect={handleDropdownSelect}
              isOpen={dropdownOpen === "teacherId"}
              onToggle={handleDropdownToggle}
              placeholder={fetchingTeachers ? "Loading teachers..." : "Select a teacher"}
              required={true}
            />

            <FormInput
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={formData.totalMarks}
              onChange={handleInputChange}
              placeholder="Enter total marks"
            />

            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              placeholder="Select due date"
              required={true}
            />

            {/* FIXED: Use handleStudentSelect instead of handleDropdownSelect for student dropdown */}
            <SimpleDropdown
              label="Assign to Student"
              name="student"
              value={formData.student}
              options={studentOptions}
              onSelect={handleStudentSelect} 
              isOpen={dropdownOpen === "student"}
              onToggle={handleDropdownToggle}
              placeholder={fetchingStudents ? "Loading students..." : "Select a student"}
              required={false}
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
          />

          <FileUploadField
            label="Attachments"
            files={selectedFiles}
            onFilesChange={handleFilesChange}
            className="sm:col-span-2"
          />

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting || fetchingTeachers || fetchingClasses || fetchingStudents}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition ${isSubmitting || fetchingTeachers || fetchingClasses || fetchingStudents
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#E5EFEB] text-[#0B4B31] hover:bg-[#D4E6DE]"
                }`}
            >
              {isSubmitting ? (uploading ? 'Uploading Files...' : 'Creating Assignment...') : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;