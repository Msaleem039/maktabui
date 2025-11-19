"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

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

const FormDropdown = ({ label, name, value, options, onChange, placeholder = "Select", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div
        className="w-full bg-[#D5E2DB] text-[#0B4B31] rounded-full px-4 py-3 flex justify-between items-center cursor-pointer outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-[#0B4B31]" : "text-[#0B4B31]/60"}>
          {value || placeholder}
        </span>
        <span className="text-[#0B4B31]">▾</span>
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-[#D2E2DB] rounded-xl shadow-lg z-10 mt-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value || option}
              onClick={() => {
                onChange({ target: { name, value: option.value || option } });
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-[#E5EFEB] ${
                value === (option.value || option) ? "bg-[#0B4B31] text-white" : "text-[#0B4B31]"
              }`}
            >
              {option.label || option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DateInput = ({ label, name, value, onChange, placeholder, required = false, className = "" }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
        />
        <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B4B31]/60 pointer-events-none" />
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-2">Format: MM-DD-YYYY (e.g., 05-15-2010)</p>
    </div>
  );
};

export default function AddQuranLessonPage({ params }) {
  const [formData, setFormData] = useState({
    lessonTitle: "",
    subject: "",
    date: "",
    description: "",
    materials: "",
    homework: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#799086]">
            Welcome to
          </p>
          <h1 className="text-3xl font-black text-[#0B4B31] leading-tight sm:text-4xl">
            MaktabOS
          </h1>
        </div>
      </div>
      <div className="relative mx-auto max-w-5xl rounded-[28px] border border-[#E2E7E4] bg-white px-10 py-10 shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Add New Lesson</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Lesson Title"
            name="lessonTitle"
            value={formData.lessonTitle}
            onChange={handleChange}
            placeholder="Enter lesson title"
            required
          />

          <FormDropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            options={[
              { label: "Quran", value: "quran" },
              { label: "Arabic", value: "arabic" },
              { label: "Islamic Studies", value: "islamic_studies" },
            ]}
            placeholder="Select"
          />

          <DateInput
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="MM-DD-YYYY"
            required
          />

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />

          <FormInput
            label="Materials"
            name="materials"
            value={formData.materials}
            onChange={handleChange}
            placeholder="Enter materials"
          />

          <FormInput
            label="Homework"
            name="homework"
            value={formData.homework}
            onChange={handleChange}
            placeholder="Enter homework"
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

