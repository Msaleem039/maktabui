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
        className="w-full bg-[#0B4B3199] text-black text-sm placeholder-[#000000] rounded-full px-4 py-4 outline-none"
      />
    </div>
  );
};