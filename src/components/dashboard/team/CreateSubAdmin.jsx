"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubAdminAction } from "@/redux/slices/subadminSlices/subAdminSlices";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function CreateSubAdmin() {
  const dispatch = useDispatch();
  const { loading, subAdmin, error, success } = useSelector(
    (state) => state.createSubAdmin
  );
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    photo: "",
    name: "",
    password: "",
    phone: "",
    permissions: {
      manageStudents: false,
      manageParents: false,
      manageTeachers: false,
      manageClasses: false,
    },
  });

  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const uploadImageToSupabase = (file) => {
    setUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.open("PUT", `/api/uploadImage`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          resolve(res.file.url);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadImageToSupabase(file);
      setFormData((prev) => ({ ...prev, photo: url }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentAdminId) {
      alert("Admin authentication required. Please login again.");
      return;
    }

    const dataToSend = {
      ...formData,
      adminId: currentAdminId,
    };

    dispatch(createSubAdminAction(dataToSend));
  };

  useEffect(() => {
    if (success && subAdmin) {
      setFormData({
        email: "",
        photo: "",
        name: "",
        password: "",
        phone: "",
        permissions: {
          manageStudents: false,
          manageParents: false,
          manageTeachers: false,
          manageClasses: false,
        },
      });
      setUploadProgress(0);

      setTimeout(() => {
        router.push("/dashboard/team/sub-admin");
      }, 2000);
    }
  }, [success, subAdmin, router]);

  useEffect(() => {
    if (error) {
      alert(`Error creating sub-admin: ${error}`);
    }
  }, [error]);

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

      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          Add Sub Admin
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">
              ✓ Sub-admin created successfully! Redirecting...
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Photo
            </label>
            <div className="w-full bg-[#D5E2DB] rounded-full px-4 py-3 flex items-center gap-3">
              <button
                type="button"
                className="bg-[#0B4B31] text-white px-4 py-2 rounded-full text-sm font-semibold"
                onClick={() => document.getElementById("photo-upload").click()}
                disabled={uploading}
              >
                {uploading ? `Uploading ${uploadProgress}%` : "Choose File"}
              </button>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="photo-upload"
              />
              <span className="text-[#0B4B31]/60 text-sm">
                {formData.photo ? "File uploaded" : "No file chosen"}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manageStudents"
                  checked={formData.permissions.manageStudents}
                  onChange={() => handlePermissionChange("manageStudents")}
                  className="h-4 w-4 text-[#0B4B31] border-gray-300 rounded focus:ring-[#0B4B31]"
                />
                <label
                  htmlFor="manageStudents"
                  className="ml-2 text-sm text-gray-700"
                >
                  Manage Students
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manageParents"
                  checked={formData.permissions.manageParents}
                  onChange={() => handlePermissionChange("manageParents")}
                  className="h-4 w-4 text-[#0B4B31] border-gray-300 rounded focus:ring-[#0B4B31]"
                />
                <label
                  htmlFor="manageParents"
                  className="ml-2 text-sm text-gray-700"
                >
                  Manage Parents
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manageTeachers"
                  checked={formData.permissions.manageTeachers}
                  onChange={() => handlePermissionChange("manageTeachers")}
                  className="h-4 w-4 text-[#0B4B31] border-gray-300 rounded focus:ring-[#0B4B31]"
                />
                <label
                  htmlFor="manageTeachers"
                  className="ml-2 text-sm text-gray-700"
                >
                  Manage Teachers
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manageClasses"
                  checked={formData.permissions.manageClasses}
                  onChange={() => handlePermissionChange("manageClasses")}
                  className="h-4 w-4 text-[#0B4B31] border-gray-300 rounded focus:ring-[#0B4B31]"
                />
                <label
                  htmlFor="manageClasses"
                  className="ml-2 text-sm text-gray-700"
                >
                  Manage Classes
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select the permissions this sub-admin will have
            </p>
          </div>

          {Object.values(formData.permissions).some((value) => value) && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Selected Permissions:
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.manageStudents && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Manage Students
                  </span>
                )}
                {formData.permissions.manageParents && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Manage Parents
                  </span>
                )}
                {formData.permissions.manageTeachers && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Manage Teachers
                  </span>
                )}
                {formData.permissions.manageClasses && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Manage Classes
                  </span>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploading || !currentAdminId}
            className="rounded-full bg-[#0B4B31] px-10 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3d27] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Sub Admin"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}