"use client";

import { ChevronDown } from "lucide-react";

export const SimpleDropdown = ({
    label,
    name,
    value,
    options,
    onSelect,
    isOpen,
    onToggle,
    placeholder,
    required = false
}) => {
    return (
        <div className="relative dropdown-container">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && "*"}
            </label>
            <button
                type="button"
                onClick={() => onToggle(name)}
                className="w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 text-left flex justify-between items-center"
            >
                <span className={!value ? "text-[#0B4B31]/60" : "text-[#0B4B31]"}>
                    {value ? options.find(opt => opt.value === value)?.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-[#0B4B31] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onSelect(name, option.value)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors duration-150"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};