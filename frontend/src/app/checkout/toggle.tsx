"use client";
import React from "react";

interface ToggleProps {
  isActive: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ isActive, onChange }) => {
  return (
    <button
      onClick={() => onChange(!isActive)}
      className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
        isActive ? "bg-blue-600" : "bg-gray-400"
      }`}
      role="switch"
      aria-checked={isActive}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
          isActive ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};
