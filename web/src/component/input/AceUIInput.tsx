import React from "react";

interface AceUIInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
}

function AceUIInput({
  label,
  value,
  onChange,
  placeholder,
  type,
}: AceUIInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-text ml-1">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="w-full mt-1 border-2 border-secondary bg-background text-text focus:outline-none focus:border-primary p-3 rounded-xl transition-colors"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

export default AceUIInput;
