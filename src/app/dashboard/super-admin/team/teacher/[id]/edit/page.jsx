"use client";

import { useState } from "react";
import { DropdownField } from "@/components/DropdownField";

const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => {
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
        className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
      />
    </div>
  );
};

export default function EditTeacherPage() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    address: "",
    photo: null,
    name: "",
    password: "",
    phone: "",
    sendEmail: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const roleOptions = [
    { label: "Teacher", value: "teacher" },
    { label: "Homeroom Teacher", value: "homeroom_teacher" },
  ];

  const sendEmailOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownToggle = (name) => {
    setDropdownOpen((prev) => (prev === name ? null : name));
  };

  const handleDropdownSelect = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDropdownOpen(null);
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher Data:", formData);
  };

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-4xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Edit Teacher</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropdownField
            label="Select Your Role"
            name="role"
            value={formData.role}
            options={roleOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownOpen === "role"}
            onToggle={() => handleDropdownToggle("role")}
            placeholder="Select"
          />

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

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />

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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Photo</label>
            <div className="w-full bg-[#D5E2DB] rounded-full px-4 py-3 flex items-center gap-3">
              <button
                type="button"
                className="bg-[#0B4B31] text-white px-4 py-2 rounded-full text-sm font-semibold"
              >
                Choose File
              </button>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="text-[#0B4B31]/60 text-sm cursor-pointer">
                {formData.photo ? formData.photo.name : "No file chosen"}
              </label>
            </div>
          </div>

          <DropdownField
            label="Send the teacher an email with updated info"
            name="sendEmail"
            value={formData.sendEmail}
            options={sendEmailOptions}
            onSelect={handleDropdownSelect}
            isOpen={dropdownOpen === "sendEmail"}
            onToggle={() => handleDropdownToggle("sendEmail")}
            placeholder="Select"
          />
        </form>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-full bg-[#E5EFEB] px-8 py-3 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#D4E6DE]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

