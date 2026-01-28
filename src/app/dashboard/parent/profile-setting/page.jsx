"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Save, X, User, Phone, MapPin, Lock } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { updateParent, getParentById } from '@/redux/slices/parentSlices/parentSlice';
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

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const { parent, status, error } = useSelector((state) => state.getParentById);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    newPassword: "",
    confirmPassword: "",
  });

  const extractNames = (fullName) => {
    const names = fullName?.split(' ') || ['', ''];
    return {
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || ''
    };
  };

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentId = getUserId();
        if (parentId) {
          await dispatch(getParentById(parentId)).unwrap();
        } else {
          console.error("No parent ID found");
        }
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
  }, [dispatch]);

  useEffect(() => {
    if (parent) {
      const { firstName, lastName } = extractNames(parent.fullName);
      
      setProfileData({
        firstName,
        lastName,
        phone: parent.phone || '',
        address: parent.address || '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [parent]);

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

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(profileData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)";
    }

    if (!profileData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (profileData.newPassword || profileData.confirmPassword) {
      if (profileData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
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

    const parentId = getUserId();
    if (!parentId) {
      setErrors({ submit: "User ID not found. Please log in again." });
      return;
    }

    const updateData = {
      fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
      phone: profileData.phone,
      address: profileData.address,
    };

    if (profileData.newPassword) {
      updateData.password = profileData.newPassword;
    }

    try {
      const result = await dispatch(updateParent({
        parentId: parentId,
        updateData
      })).unwrap();
      
      setShowSuccess(true);
      setIsEditing(false);
      
      setProfileData((prev) => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({
        submit: error || "Failed to update profile. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (parent) {
      const { firstName, lastName } = extractNames(parent.fullName);
      setProfileData({
        firstName,
        lastName,
        phone: parent.phone || '',
        address: parent.address || '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setErrors({});
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F9F7] to-[#E5EFEB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B31]"></div>
      </div>
    );
  }

  if (error && !parent) {
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
          <h1 className="text-3xl font-bold text-[#0B4B31]">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Update your personal information and password</p>
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

        {status === 'updating' && (
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
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600 mt-1">{parent?.email}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileInfoCard
                  icon={Phone}
                  label="Phone Number"
                  value={profileData.phone}
                />
                <ProfileInfoCard
                  icon={MapPin}
                  label="Address"
                  value={profileData.address}
                />
              </div>
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E2E7E4]">
                  <div className="p-2 bg-[#E5EFEB] rounded-full">
                    <User size={20} className="text-[#0B4B31]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInput
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                      icon={<User size={18} />}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormInput
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      value={parent?.email || ''}
                      onChange={() => {}}
                      placeholder="Your email"
                      disabled
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E2E7E4]">
                  <div className="p-2 bg-[#E5EFEB] rounded-full">
                    <Phone size={20} className="text-[#0B4B31]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      icon={<Phone size={18} />}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <FormInput
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      required
                      icon={<MapPin size={18} />}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="font-semibold">Note:</span> Leave password fields blank if you don't want to change your password.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={status === 'updating'}
                  className="flex-1 rounded-full bg-[#E5EFEB] px-6 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'updating'}
                  className="flex-1 rounded-full bg-[#0B4B31] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'updating' ? (
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
                Click "Edit Profile" to update your name, phone number, address, or password.
                Your email is permanent and cannot be changed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}