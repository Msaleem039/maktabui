import { ChevronDown } from "lucide-react";

export const DropdownField = ({
  label,
  name,
  value,
  options,
  onSelect,
  isOpen,
  onToggle,
  renderOption = null,
  className = "",
  placeholder = "Select an option"
}) => {
  const dropdownBaseStyle = "w-full bg-[#0B4B3199] text-black text-sm rounded-full px-4 py-4 flex justify-between items-center cursor-pointer select-none";
  const dropdownMenuStyle = "absolute w-full bg-white text-[#104D2E] mt-2 rounded-xl shadow-lg z-10 max-h-[200px] overflow-y-auto";

  // Generate a unique key for each option
  const getOptionKey = (option, index) => {
    if (option._id) return option._id;
    if (option.value) return option.value;
    if (option.id) return option.id;
    return `option-${index}`; // fallback to index if no unique identifier
  };

  // Get display text for an option
  const getOptionDisplay = (option) => {
    if (typeof option === 'string') return option;
    if (option.label) return option.label;
    if (option.fullName && option.specialization) {
      return `${option.fullName} - ${option.specialization}`;
    }
    if (option.fullName) return option.fullName;
    if (option.name) return option.name;
    return String(option); // fallback
  };

  // Get value for an option
  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    if (option.value) return option.value;
    if (option._id) return option._id;
    if (option.id) return option.id;
    return option;
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block font-normal text-sm text-[#000000] mb-1">{label}</label>
      <div
        className={dropdownBaseStyle}
        onClick={() => onToggle(name)}
      >
        <span>
          {value ? value : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className={dropdownMenuStyle}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-[#000000]">No options available</div>
          ) : (
            options.map((option, index) => (
              renderOption ? (
                <div key={getOptionKey(option, index)}>
                  {renderOption(option)}
                </div>
              ) : (
                <div
                  key={getOptionKey(option, index)}
                  onClick={() => onSelect(name, getOptionValue(option))}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#bdc9c4] ${value === getOptionValue(option) ? "bg-[#0e6b49]" : ""
                    }`}
                >
                  {getOptionDisplay(option)}
                </div>
              )
            ))
          )}
        </div>
      )}
    </div>
  );
};