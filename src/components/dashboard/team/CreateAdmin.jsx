"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAdminAction } from "@/redux/slices/adminSlices/adminSlices";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function CreateAdmin() {
  const dispatch = useDispatch();
  const { loading, admin, error } = useSelector((state) => state.createAdmin);

  const [formData, setFormData] = useState({
    email: "",
    address: "",
    photo: "",
    name: "",
    password: "",
    phone: "",
    branch: "",
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setFileName(file.name);

    try {
      const url = await uploadImageToSupabase(file);

      setFormData((prev) => ({ ...prev, photo: url }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setFileName(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(createAdminAction(formData)).unwrap();

      router.push("/dashboard/team/admin");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (admin) {
      setFormData({
        email: "",
        address: "",
        photo: null,
        name: "",
        password: "",
        phone: "",
        branch: "",
      });
      setUploadProgress(0);
      setFileName(""); // Clear file name on successful submission
    }
  }, [admin]);

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

      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Add Admin</h2>

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
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                style={{
                  backgroundColor: "#D5E2DB",
                  color: "#0B4B31",
                }}
                className="w-full placeholder:opacity-60 rounded-full px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-opacity-30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31] hover:text-[#084A2E] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />

          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
          />

          <FormInput
            label="Institute"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            placeholder="Institute"
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
                {fileName || "No file chosen"}
              </span>
            </div>
          </div>
        </form>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="rounded-full bg-[#E5EFEB] px-10 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}