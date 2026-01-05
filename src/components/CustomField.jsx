"use client";

import { useTheme } from "@/hooks/useTheme";

export const CustomField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = ""
}) => {
  const { themeColor } = useTheme();
  const rgb = themeColor ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(themeColor) : null;
  const bgColor = rgb ? `rgba(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}, 0.6)` : "#0B4B3199";
  
  return (
    <div className={className}>
      <label className="block  font-normal text-sm text-[#000000] mb-1">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{ backgroundColor: bgColor }}
        className="w-full text-black text-sm placeholder-[#000000] rounded-full px-4 py-4 outline-none"
      />
    </div>
  );
};