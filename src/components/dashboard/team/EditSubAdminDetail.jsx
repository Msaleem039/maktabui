"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import {
  updateSubAdminAction,
  resetUpdateSubAdminState,
} from "@/redux/slices/subadminSlices/subAdminSlices";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "next/navigation";

export default function EditSubAdminDetail({ subAdmin }) {
  console.log("subAdmin data received in component:", subAdmin);

  const dispatch = useDispatch();
  const {
    loading: updateLoading,
    error: updateError,
    updatedSubAdmin,
    success: updateSuccess,
  } = useSelector((state) => state.updateSubAdmin);

  const router = useRouter();
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    photo: "",
    permissions: {
      manageStudents: false,
      manageParents: false,
      manageTeachers: false,
      manageClasses: false,
    },
    isActive: true,
  });

  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    if (subAdmin) {
      console.log("Setting form data from subAdmin:", subAdmin);

      let permissionsData = {
        manageStudents: false,
        manageParents: false,
        manageTeachers: false,
        manageClasses: false,
      };

      if (
        subAdmin.permissions &&
        Array.isArray(subAdmin.permissions) &&
        subAdmin.permissions.length > 0
      ) {
        const permissionObj = subAdmin.permissions[0];
        permissionsData = {
          manageStudents: permissionObj.manageStudents || false,
          manageParents: permissionObj.manageParents || false,
          manageTeachers: permissionObj.manageTeachers || false,
          manageClasses: permissionObj.manageClasses || false,
        };
        console.log("Extracted permissions:", permissionsData);
      }

      setFormData({
        name: subAdmin.name || "",
        phone: subAdmin.phone || "",
        photo: subAdmin.photo || "",
        permissions: permissionsData,
        isActive: subAdmin.isActive !== undefined ? subAdmin.isActive : true,
      });
    }
  }, [subAdmin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("permissions.")) {
      const permissionName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionName]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === "isActive") {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentAdminId) {
      alert("Admin authentication required. Please login again.");
      return;
    }

    const submitData = {
      adminId: currentAdminId,
      subAdminId: subAdmin._id,
      name: formData.name,
      phone: formData.phone,
      photo: formData.photo,
      permissions: [
        {
          manageStudents: formData.permissions.manageStudents,
          manageParents: formData.permissions.manageParents,
          manageTeachers: formData.permissions.manageTeachers,
          manageClasses: formData.permissions.manageClasses,
        },
      ],
      isActive: formData.isActive,
    };

    console.log(
      "Submitting data to backend:",
      JSON.stringify(submitData, null, 2)
    );

    try {
      await dispatch(updateSubAdminAction(submitData)).unwrap();
    } catch (error) {
      console.error("Failed to update sub-admin:", error);
    }
  };

  useEffect(() => {
    if (updateSuccess && updatedSubAdmin) {
      setTimeout(() => {
        router.push("/dashboard/team/sub-admin");
      }, 2000);
    }
  }, [updateSuccess, updatedSubAdmin, router]);

  useEffect(() => {
    return () => {
      dispatch(resetUpdateSubAdminState());
    };
  }, [dispatch]);

  const uploadImageToSupabase = (file) => {
    setUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file);

      xhr.open("PUT", `${backendUrl}/api/uploadImage`);

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadImageToSupabase(file);
      setFormData((prev) => ({
        ...prev,
        photo: url,
      }));

      // Show success message
      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Edit Sub-Admin
          </h2>
          <div className="text-sm text-gray-500">
            Status:
            <span
              className={`ml-2 px-3 py-1 rounded-full ${
                formData.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {currentAdminId && (
          <p className="text-sm text-gray-500 mb-4">
            Admin ID: {currentAdminId.substring(0, 8)}...
          </p>
        )}

        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">Error: {updateError}</p>
            <p className="text-red-600 text-sm mt-1">
              Please check the console for more details
            </p>
          </div>
        )}

        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">
              ✓ Sub-admin updated successfully! Redirecting...
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
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

          {/* PHOTO FIELD */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo
            </label>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="Photo URL"
                  className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPhotoPreview(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  disabled={!formData.photo}
                  title="Preview Photo"
                >
                  📷
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("upload-photo-input").click()
                  }
                  className="rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a3d27] disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading
                    ? `Uploading ${uploadProgress}%`
                    : "Upload New Photo"}
                </button>

                {formData.photo && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, photo: "" }))
                    }
                    className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <input
              id="upload-photo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#0B4B31] h-3 text-white text-xs text-center transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Uploading image...
                </p>
              </div>
            )}

            {/* Photo Preview */}
            {formData.photo && !uploading && (
              <div className="mt-3">
                <p className="text-xs text-gray-500">
                  Current photo:{" "}
                  {formData.photo.length > 50
                    ? formData.photo.substring(0, 50) + "..."
                    : formData.photo}
                </p>
              </div>
            )}
          </div>

          {/* PERMISSIONS SECTION */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manageStudents"
                  name="permissions.manageStudents"
                  checked={formData.permissions.manageStudents || false}
                  onChange={handleInputChange}
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
                  name="permissions.manageParents"
                  checked={formData.permissions.manageParents || false}
                  onChange={handleInputChange}
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
                  name="permissions.manageTeachers"
                  checked={formData.permissions.manageTeachers || false}
                  onChange={handleInputChange}
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
                  name="permissions.manageClasses"
                  checked={formData.permissions.manageClasses || false}
                  onChange={handleInputChange}
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

          {/* Selected permissions summary */}
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
              {!formData.permissions.manageStudents &&
                !formData.permissions.manageParents &&
                !formData.permissions.manageTeachers &&
                !formData.permissions.manageClasses && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    No permissions selected
                  </span>
                )}
            </div>
          </div>

          {/* ACCOUNT STATUS */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#0B4B31] border-gray-300 rounded focus:ring-[#0B4B31]"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active Account
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.isActive
                ? "Sub-admin can access the system"
                : "Sub-admin account is disabled"}
            </p>
          </div>

          {/* READ ONLY EMAIL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email (Read Only)
            </label>
            <input
              type="email"
              value={subAdmin?.email || ""}
              readOnly
              className="w-full bg-gray-100 text-gray-500 rounded-full px-4 py-3 outline-none cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* READ ONLY ID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sub-Admin ID (Read Only)
            </label>
            <input
              type="text"
              value={subAdmin?._id || ""}
              readOnly
              className="w-full bg-gray-100 text-gray-500 rounded-full px-4 py-3 outline-none cursor-not-allowed font-mono text-sm"
            />
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="md:col-span-2 flex justify-center gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/team/sub-admin")}
              className="rounded-full bg-gray-100 px-8 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              disabled={updateLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={updateLoading || uploading || !currentAdminId}
              className="rounded-full bg-[#0B4B31] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3d27] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Photo Preview Modal */}
      {showPhotoPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
              onClick={() => setShowPhotoPreview(false)}
            >
              ✖
            </button>

            <h3 className="font-semibold text-lg mb-4">
              Profile Photo Preview
            </h3>

            {formData.photo ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={formData.photo}
                  alt="Sub-Admin Photo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
                <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
                  <span className="text-gray-400">Image not available</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No photo available</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowPhotoPreview(false)}
                className="rounded-full bg-[#0B4B31] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0a3d27]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}