import React from "react";

interface AceUIInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
}

function AceUIInput({ label, value, onChange, placeholder, type }: AceUIInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-black ml-1">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className="w-full mt-1 border-2 border-blue-100 p-3 rounded-xl"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

export default AceUIInput;
