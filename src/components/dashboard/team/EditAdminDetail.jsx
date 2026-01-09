"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAdminAction,
  resetState,
} from "@/redux/slices/adminSlices/adminSlices";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "next/navigation";

export default function EditAdminDetail({ admin }) {
  const dispatch = useDispatch();
  const {
    loading: updateLoading,
    error: updateError,
    updatedAdmin,
  } = useSelector((state) => state.updateAdmin);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    photo: "",
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        address: admin.address || "",
        phone: admin.phone || "",
        photo: admin.photo || "",
      });
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      id: admin._id,
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      photo: formData.photo,
    };

    try {
      await dispatch(updateAdminAction(submitData)).unwrap();

      setTimeout(() => {
        router.push("/dashboard/team/admin");
      }, 2000);
    } catch (error) {
      console.error("Failed to update admin:", error);
    }
  };

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
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Edit Admin</h2>

        {updateError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {updateError}
          </div>
        )}

        {updatedAdmin && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Admin updated successfully!
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

          <div className="md:col-span-2">
            <FormInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
            />
          </div>

          {/* PHOTO FIELD */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo
            </label>

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
              >
                📷
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                document.getElementById("upload-photo-input").click()
              }
              className="mt-3 rounded-full bg-[#E5EFEB] px-4 py-2 text-sm font-semibold text-[#0B4B31]"
            >
              Upload New Photo
            </button>

            <input
              id="upload-photo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#0B4B31] h-3 text-white text-xs text-center"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>

          {/* READ ONLY EMAIL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email (Read Only)
            </label>
            <input
              type="email"
              value={admin?.email || ""}
              readOnly
              className="w-full bg-gray-100 text-gray-500 rounded-full px-4 py-3 outline-none cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>
        </form>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={updateLoading}
            className="rounded-full bg-[#E5EFEB] px-8 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {showPhotoPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative">
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setShowPhotoPreview(false)}
            >
              ✖
            </button>

            <h3 className="font-semibold text-lg mb-4">Current Photo</h3>

            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Admin Photo"
                className="w-full rounded-xl border"
              />
            ) : (
              <p className="text-gray-500">No photo available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}