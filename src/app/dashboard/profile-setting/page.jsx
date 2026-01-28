"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Save, X, User, Mail, Lock } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { updateSuperAdminAction, getSuperAdminDetailAction } from '@/redux/slices/superadminSlices/superadminSlices';
import { getUserId } from "@/utils/getCookies";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  disabled = false,
  icon = null,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 ${
            disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0B4B31]/60">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 ${
            disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
            disabled
              ? "text-[#0B4B31]/40 cursor-not-allowed"
              : "text-[#0B4B31]/60 hover:text-[#0B4B31]"
          } transition-colors`}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

const ProfileInfoCard = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-[#F5F9F7] rounded-xl border border-[#E2E7E4]">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white rounded-full">
        <Icon size={18} className="text-[#0B4B31]" />
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
    <p className="text-gray-800 pl-11">{value || "Not provided"}</p>
  </div>
);

export default function SuperAdminProfileSettings() {
  const dispatch = useDispatch();
  const { superAdminDetail, superAdminUpdate } = useSelector((state) => state.dashboard);
  
  const superAdmin = superAdminDetail?.data;
  const loading = superAdminDetail.loading;
  const error = superAdminDetail.error;
  const updating = superAdminUpdate.loading;
  const updateSuccess = superAdminUpdate.success;
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchSuperAdminData = async () => {
      try {
        await dispatch(getSuperAdminDetailAction()).unwrap();
      } catch (error) {
        console.error("Error fetching super admin data:", error);
        setErrors({ fetch: error || "Failed to load profile data." });
      }
    };

    fetchSuperAdminData();
  }, [dispatch]);

  useEffect(() => {
    if (superAdmin) {
      setProfileData({
        email: superAdmin.email || superAdmin.user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [superAdmin]);

  useEffect(() => {
    if (updateSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [updateSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
      }
      
      if (profileData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = "New passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const userId = getUserId();
      
      if (!userId) {
        setErrors({ submit: "User ID not found. Please login again." });
        return;
      }

      const updateData = {
        userId: userId,
        email: profileData.email,
      };

      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      await dispatch(updateSuperAdminAction(updateData)).unwrap();
      
      setIsEditing(false);
      
      setProfileData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      await dispatch(getSuperAdminDetailAction()).unwrap();
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({
        submit: error || "Failed to update profile. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (superAdmin) {
      setProfileData({
        email: superAdmin.email || superAdmin.user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setErrors({});
  };

  if (loading && !superAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F9F7] to-[#E5EFEB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B31]"></div>
      </div>
    );
  }

  if (error && !superAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F9F7] to-[#E5EFEB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading profile: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#0B4B31] px-6 py-3 text-white font-semibold hover:bg-[#0B4B31]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F9F7] to-[#E5EFEB] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0B4B31]">Super Admin Profile Settings</h1>
          <p className="text-gray-600 mt-2">Update your email and password</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{errors.submit}</p>
            </div>
          </div>
        )}

        {errors.fetch && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{errors.fetch}</p>
            </div>
          </div>
        )}

        {updating && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B4B31] mx-auto mb-3"></div>
              <p className="text-gray-700">Updating profile...</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[28px] border border-[#E2E7E4] shadow-[0_30px_80px_-50px_rgba(11,75,49,0.15)] p-8">
          {!isEditing && (
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0B4B31]/20 to-[#D5E2DB] border-4 border-white shadow-lg flex items-center justify-center">
                  <User size={40} className="text-[#0B4B31]" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {superAdmin?.fullName || superAdmin?.name || "Super Admin"}
                  </h2>
                  <p className="text-gray-600 mt-1">{profileData.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ProfileInfoCard
                  icon={Mail}
                  label="Email"
                  value={profileData.email}
                />
              </div>
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E2E7E4]">
                  <div className="p-2 bg-[#E5EFEB] rounded-full">
                    <Mail size={20} className="text-[#0B4B31]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Email Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      icon={<Mail size={18} />}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E2E7E4]">
                  <div className="p-2 bg-[#E5EFEB] rounded-full">
                    <Lock size={20} className="text-[#0B4B31]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Change Password
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <PasswordInput
                      label="Current Password"
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                      required={profileData.newPassword || profileData.confirmPassword}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <PasswordInput
                      label="New Password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <PasswordInput
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Note:</span> 
                    {` Fill in all password fields only if you want to change your password.
                    Current password is required to change to a new password.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updating}
                  className="flex-1 rounded-full bg-[#E5EFEB] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {!isEditing && (
            <div className="mt-8 p-4 bg-[#F5F9F7] border border-[#E2E7E4] rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">Profile Information</h4>
              <p className="text-sm text-gray-600">
                Click "Edit Profile" to update your email and password.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}