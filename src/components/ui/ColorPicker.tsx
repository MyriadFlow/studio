import React from "react";

interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ id, label, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type="color"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg"
        title={`Choose ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default ColorPicker;
