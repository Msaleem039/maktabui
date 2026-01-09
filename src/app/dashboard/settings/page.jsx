"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateThemeAction, resetUpdateThemeState } from "@/redux/slices/adminSlices/adminSlices";
import { setTheme } from "@/redux/slices/themeSlices/themeSlice";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => {
  const { themeColor } = useTheme();
  
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          backgroundColor: "#D5E2DB",
          color: themeColor,
        }}
        className="w-full placeholder:opacity-60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-opacity-30"
      />
    </div>
  );
};

const ColorPicker = ({ label, name, value, onChange, required = false, className = "" }) => {
  const { themeColor } = useTheme();
  
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-12 w-24 rounded-lg border-2 border-gray-200 cursor-pointer"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="#000000"
          required={required}
          style={{
            backgroundColor: "#D5E2DB",
            color: themeColor,
          }}
          className="flex-1 placeholder:opacity-60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-opacity-30"
        />
      </div>
    </div>
  );
};

const ImageUpload = ({ label, name, selectedFile, previewUrl, onFileSelect, onRemove, required = false, className = "" }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    onFileSelect(name, file);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="space-y-3">
        {(previewUrl || selectedFile) && (
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={previewUrl || URL.createObjectURL(selectedFile)}
              alt={label}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-[#0B4B31] text-white px-4 py-3 rounded-full hover:bg-[#0B4B31]/90 transition-colors text-sm font-semibold">
            {selectedFile ? "Change Image" : "Select Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {(selectedFile || previewUrl) && (
            <button
              type="button"
              onClick={() => onRemove(name)}
              className="px-4 py-3 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
            >
              Remove
            </button>
          )}
        </div>
        {selectedFile && (
          <p className="text-xs text-gray-500">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { themeColor } = useTheme();
  const { loading, success, error } = useSelector((state) => state.updateTheme);

  const [formData, setFormData] = useState({
    themeColor: "#0B4B31",
    secondaryColor: "#13574A",
    logo: "",
    favicon: "",
    mainText: "",
  });

  const [selectedFiles, setSelectedFiles] = useState({
    logo: null,
    favicon: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    logo: "",
    favicon: "",
  });

  useEffect(() => {
    // Reset success state after 3 seconds
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateThemeState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (name, file) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setSelectedFiles((prev) => ({ ...prev, [name]: file }));
    setPreviewUrls((prev) => ({ ...prev, [name]: previewUrl }));
  };

  const handleFileRemove = (name) => {
    // Cleanup preview URL
    if (previewUrls[name] && previewUrls[name].startsWith("blob:")) {
      URL.revokeObjectURL(previewUrls[name]);
    }

    setSelectedFiles((prev) => ({ ...prev, [name]: null }));
    setPreviewUrls((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminId = getAdminId();
    if (!adminId) {
      alert("Admin authentication required. Please login again.");
      return;
    }

    try {
      // Create FormData with File objects or existing URLs
      const submitFormData = new FormData();
      submitFormData.append("adminId", adminId);
      submitFormData.append("themeColor", formData.themeColor);
      submitFormData.append("secondaryColor", formData.secondaryColor);
      
      if (selectedFiles.logo) {
        submitFormData.append("logo", selectedFiles.logo);
      } else if (formData.logo) {
        submitFormData.append("logo", formData.logo);
      }
      
      if (selectedFiles.favicon) {
        submitFormData.append("favicon", selectedFiles.favicon);
      } else if (formData.favicon) {
        submitFormData.append("favicon", formData.favicon);
      }
      
      if (formData.mainText) {
        submitFormData.append("mainText", formData.mainText);
      }

      const result = await dispatch(updateThemeAction(submitFormData)).unwrap();

      // Get the returned URLs from the backend response
      const logoUrl = result?.theme?.logo || formData.logo || "";
      const faviconUrl = result?.theme?.favicon || formData.favicon || "";

      // Update theme state with new values
      dispatch(setTheme({
        themeColor: formData.themeColor,
        secondaryColor: formData.secondaryColor,
        logo: logoUrl,
        favicon: faviconUrl,
        mainText: formData.mainText || "MaktabOS",
      }));

      // Cleanup preview URLs after successful upload
      if (previewUrls.logo && previewUrls.logo.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrls.logo);
      }
      if (previewUrls.favicon && previewUrls.favicon.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrls.favicon);
      }

      // Update form data with returned URLs
      setFormData((prev) => ({
        ...prev,
        logo: logoUrl,
        favicon: faviconUrl,
      }));

      // Clear selected files after successful upload
      setSelectedFiles({ logo: null, favicon: null });
      setPreviewUrls({ logo: logoUrl, favicon: faviconUrl });
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Customize your dashboard theme, colors, logo, and branding.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Theme</h2>
        <p className="text-sm text-gray-500 mb-6">
          Configure the visual appearance of your dashboard.
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-green-700 text-sm font-medium">Theme new updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ColorPicker
              label="Theme Color"
              name="themeColor"
              value={formData.themeColor}
              onChange={handleChange}
              required
            />

            <ColorPicker
              label="Secondary Color"
              name="secondaryColor"
              value={formData.secondaryColor}
              onChange={handleChange}
              required
            />

            <ImageUpload
              label="Logo"
              name="logo"
              selectedFile={selectedFiles.logo}
              previewUrl={previewUrls.logo || formData.logo}
              onFileSelect={handleFileSelect}
              onRemove={handleFileRemove}
              className="md:col-span-1"
            />

            <ImageUpload
              label="Favicon"
              name="favicon"
              selectedFile={selectedFiles.favicon}
              previewUrl={previewUrls.favicon || formData.favicon}
              onFileSelect={handleFileSelect}
              onRemove={handleFileRemove}
              className="md:col-span-1"
            />

            <FormInput
              label="Main Text"
              name="mainText"
              type="text"
              value={formData.mainText}
              onChange={handleChange}
              placeholder="Enter main text (e.g., Welcome to MaktabOS)"
              className="md:col-span-2"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: themeColor }}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  themeColor: "#0B4B31",
                  secondaryColor: "#13574A",
                  logo: "",
                  favicon: "",
                  mainText: "",
                });
                dispatch(resetUpdateThemeState());
              }}
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
