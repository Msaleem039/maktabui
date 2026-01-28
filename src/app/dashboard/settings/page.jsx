"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateThemeAction,
  resetUpdateThemeState,
} from "@/redux/slices/adminSlices/adminSlices";
import { setTheme } from "@/redux/slices/themeSlices/themeSlice";
import { getAdminId } from "@/utils/getCookies";
import { useTheme } from "@/hooks/useTheme";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
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

const ColorPicker = ({
  label,
  name,
  value,
  onChange,
  required = false,
  className = "",
}) => {
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

// Supabase stores full public URLs in DB. For local previews we use blob URLs.
const isSupportedImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return (
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  );
};

const ImageUpload = ({
  label,
  name,
  selectedFile,
  previewUrl,
  onFileSelect,
  onRemove,
  required = false,
  className = "",
  uploading = false,
  uploadProgress = 0,
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = isSupportedImageUrl(previewUrl) ? previewUrl : "";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      e.target.value = ""; // Reset input
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      e.target.value = ""; // Reset input
      return;
    }

    onFileSelect(name, file);
    setImageError(false);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="space-y-3">
        {imageUrl && !imageError && (
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-contain p-2"
              onError={() => {
                setImageError(true);
              }}
            />
          </div>
        )}
        {imageError && (
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
            <div className="text-xs text-gray-500 text-center px-2">
              Image not available
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <label
            className={`cursor-pointer bg-[#0B4B31] text-white px-4 py-3 rounded-full hover:bg-[#0B4B31]/90 transition-colors text-sm font-semibold ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {uploading
              ? `Uploading ${uploadProgress}%`
              : selectedFile
                ? "Change Image"
                : "Select Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {(selectedFile || imageUrl) && !uploading && (
            <button
              type="button"
              onClick={() => {
                onRemove(name);
                setImageError(false);
              }}
              className="px-4 py-3 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
            >
              Remove
            </button>
          )}
        </div>
        {selectedFile && !uploading && (
          <p className="text-xs text-gray-500">
            Selected: {selectedFile.name} (
            {(selectedFile.size / 1024).toFixed(1)} KB)
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
  const theme = useSelector((state) => state.theme || {});

  const [formData, setFormData] = useState({
    themeColor: "#0B4B31",
    secondaryColor: "#13574A",
    logo: "",
    favicon: "",
    mainText: "",
  });

  // Store selected files (for upload on submit)
  const [selectedFiles, setSelectedFiles] = useState({
    logo: null,
    favicon: null,
  });

  // Store preview URLs (blob URLs for new selections, or existing server URLs)
  const [previewUrls, setPreviewUrls] = useState({
    logo: "",
    favicon: "",
  });

  // Upload state (only used during submit)
  const [uploading, setUploading] = useState({
    logo: false,
    favicon: false,
  });

  const [uploadProgress, setUploadProgress] = useState({
    logo: 0,
    favicon: 0,
  });

  // Store the last saved Supabase public URLs (from Redux theme / API response)
  const originalUrlsRef = useRef({
    logo: "",
    favicon: "",
  });

  // GET logic (separate): reflect Redux theme into local form state.
  useEffect(() => {
    if (theme && Object.keys(theme).length > 0) {
      setFormData((prev) => ({
        themeColor: theme.themeColor || prev.themeColor,
        secondaryColor: theme.secondaryColor || prev.secondaryColor,
        logo: theme.logo || prev.logo,
        favicon: theme.favicon || prev.favicon,
        mainText: theme.mainText || prev.mainText,
      }));

      // Only set preview from saved URLs if user is not currently previewing a new local file.
      setPreviewUrls((prev) => {
        const newUrls = { ...prev };

        if (
          theme.logo &&
          typeof theme.logo === "string" &&
          !prev.logo.startsWith("blob:")
        ) {
          newUrls.logo = theme.logo;
          originalUrlsRef.current.logo = theme.logo;
        }

        if (
          theme.favicon &&
          typeof theme.favicon === "string" &&
          !prev.favicon.startsWith("blob:")
        ) {
          newUrls.favicon = theme.favicon;
          originalUrlsRef.current.favicon = theme.favicon;
        }

        return newUrls;
      });
    }
  }, [
    theme?.themeColor,
    theme?.secondaryColor,
    theme?.logo,
    theme?.favicon,
    theme?.mainText,
  ]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateThemeState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url && typeof url === "string" && url.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.warn("Error revoking blob URL:", error);
          }
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image to Supabase Storage via Next.js API route (called only on submit)
  const uploadImageToSupabase = (file, name) => {
    setUploading((prev) => ({ ...prev, [name]: true }));
    setUploadProgress((prev) => ({ ...prev, [name]: 0 }));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      // Next.js API route uploads to Supabase and returns { file: { url } }
      const apiUrl = "/api/uploadImage";

      xhr.open("PUT", apiUrl);

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress((prev) => ({
            ...prev,
            [name]: Math.round((e.loaded / e.total) * 100),
          }));
        }
      };

      xhr.onload = () => {
        setUploading((prev) => ({ ...prev, [name]: false }));
        setUploadProgress((prev) => ({ ...prev, [name]: 0 }));

        if (xhr.status === 200) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.success && res.file?.url) {
              resolve(res.file.url);
            } else {
              reject(new Error("Invalid response from upload API"));
            }
          } catch (parseError) {
            reject(new Error("Failed to parse upload response"));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        setUploading((prev) => ({ ...prev, [name]: false }));
        setUploadProgress((prev) => ({ ...prev, [name]: 0 }));
        reject(new Error("Network error during upload"));
      };

      xhr.send(formData);
    });
  };

  // File selection: ONLY create local preview (blob URL). No upload here.
  const handleFileSelect = (name, file) => {
    // Cleanup old blob URL (for this field) if it exists
    if (previewUrls[name]?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewUrls[name]);
      } catch (error) {
        console.warn("Error revoking blob URL:", error);
      }
    }

    const blobUrl = URL.createObjectURL(file);

    // Store file for upload on submit + set preview to blob URL
    setSelectedFiles((prev) => ({ ...prev, [name]: file }));
    setPreviewUrls((prev) => ({ ...prev, [name]: blobUrl }));
  };

  // Remove selection: drop local file + restore saved Supabase URL (if any)
  const handleFileRemove = (name) => {
    if (previewUrls[name]?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewUrls[name]);
      } catch (error) {
        console.warn("Error revoking blob URL:", error);
      }
    }

    setSelectedFiles((prev) => ({ ...prev, [name]: null }));

    const savedUrl = originalUrlsRef.current[name] || formData[name] || "";
    setPreviewUrls((prev) => ({ ...prev, [name]: savedUrl }));
  };

  // Submit: upload new files (if selected) -> save returned Supabase URLs in DB -> sync Redux + local state
  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminId = getAdminId();
    if (!adminId) {
      alert("Admin authentication required. Please login again.");
      return;
    }

    try {
      // Start from existing saved URLs; replace only if a new file is selected.
      let finalLogoUrl = formData.logo || originalUrlsRef.current.logo || "";
      let finalFaviconUrl = formData.favicon || originalUrlsRef.current.favicon || "";

      // Upload logo if a new file was selected
      if (selectedFiles.logo) {
        try {
          finalLogoUrl = await uploadImageToSupabase(selectedFiles.logo, "logo");
          // Cleanup blob URL after successful upload
          if (previewUrls.logo && previewUrls.logo.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrls.logo);
          }
        } catch (error) {
          console.error("Logo upload failed:", error);
          alert(`Failed to upload logo: ${error.message || "Unknown error"}`);
          return; // Stop submission if upload fails
        }
      }

      // Upload favicon if a new file was selected
      if (selectedFiles.favicon) {
        try {
          finalFaviconUrl = await uploadImageToSupabase(selectedFiles.favicon, "favicon");
          // Cleanup blob URL after successful upload
          if (previewUrls.favicon && previewUrls.favicon.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrls.favicon);
          }
        } catch (error) {
          console.error("Favicon upload failed:", error);
          alert(`Failed to upload favicon: ${error.message || "Unknown error"}`);
          return; // Stop submission if upload fails
        }
      }

      // Step 2: Save theme with uploaded URLs
      const payload = {
        adminId,
        themeColor: formData.themeColor,
        secondaryColor: formData.secondaryColor,
        mainText: formData.mainText,
        logo: finalLogoUrl,
        favicon: finalFaviconUrl,
      };

      const result = await dispatch(updateThemeAction(payload)).unwrap();

      const websiteSettings = result?.data?.websiteSettings || {};

      // Step 3: Update Redux theme state
      dispatch(
        setTheme({
          themeColor: websiteSettings.themeColor,
          secondaryColor: websiteSettings.secondaryColor,
          logo: websiteSettings.logo || "",
          favicon: websiteSettings.favicon || "",
          mainText: websiteSettings.mainText || "MaktabOS",
        }),
      );

      // Step 4: Reset form state with server URLs
      setFormData((prev) => ({
        ...prev,
        logo: websiteSettings.logo || "",
        favicon: websiteSettings.favicon || "",
      }));

      // Clear selected files and update preview URLs to server URLs
      setSelectedFiles({ logo: null, favicon: null });
      setPreviewUrls({
        logo: websiteSettings.logo || "",
        favicon: websiteSettings.favicon || "",
      });

      // Update original URLs ref
      originalUrlsRef.current = {
        logo: websiteSettings.logo || "",
        favicon: websiteSettings.favicon || "",
      };
    } catch (error) {
      console.error("Failed to update theme:", error);
      const errorMessage = error?.message || "Failed to update theme. Please try again.";
      alert(errorMessage);
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
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Dashboard Theme
        </h2>
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
            <p className="text-green-700 text-sm font-medium">
              Theme new updated successfully!
            </p>
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
              previewUrl={previewUrls.logo || formData.logo || ""}
              onFileSelect={handleFileSelect}
              onRemove={handleFileRemove}
              uploading={uploading.logo}
              uploadProgress={uploadProgress.logo}
              className="md:col-span-1"
            />

            <FormInput
              label="Institute Name"
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
                  // favicon: "",
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