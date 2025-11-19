export const FormCheckbox = ({ label, name, checked, onChange, className = "" }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-[#0B4B31] bg-[#D5E2DB] border-gray-300 rounded focus:ring-[#0B4B31]"
        />
      </div>
      <label className="ml-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
    </div>
  );
};