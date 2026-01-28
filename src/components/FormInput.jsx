"use client";

import { useTheme } from "@/hooks/useTheme";

export const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, className = "" }) => {
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