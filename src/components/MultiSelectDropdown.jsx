import { ChevronDown } from "lucide-react";

export const MultiSelectDropdown = ({
    label,
    name,
    value,
    options,
    isOpen,
    onToggle,
    placeholder,
    required = false,
    onItemToggle,
    isItemSelected,
    getDisplayValue,
    disabled = false
}) => {
    return (
        <div className="relative dropdown-container">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && "*"}
            </label>
            <button
                type="button"
                onClick={() => !disabled && onToggle(name)}
                className={`w-full bg-[#D5E2DB] text-[#0B4B31] placeholder-[#0B4B31]/60 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B4B31]/30 text-left flex justify-between items-center ${disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                <span className={!value ? "text-[#0B4B31]/60" : "text-[#0B4B31]"}>
                    {getDisplayValue ? getDisplayValue() : value || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-[#0B4B31] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                        {options.length > 0 ? (
                            options.map((option) => (
                                <label
                                    key={option.value || option._id || option.id}
                                    className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-150"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isItemSelected(option.value || option._id || option.id)}
                                        onChange={() => onItemToggle(option.value || option._id || option.id, option.label || option.name)}
                                        className="w-4 h-4 text-[#0B4B31] bg-gray-100 border-gray-300 rounded focus:ring-[#0B4B31]"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{option.label || option.name}</span>
                                </label>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
