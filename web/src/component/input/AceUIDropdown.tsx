"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownAction = {
  title: string;
  onClick: () => void;
};

type Props = {
  title: string;
  actions: DropdownAction[];
};

function AceUIDropdown({ title, actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border border-primary transition-colors duration-300 rounded-md p-2 ${
          isOpen
            ? "bg-primary text-background"
            : "text-primary hover:bg-primary hover:text-background"
        }`}
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-secondary rounded-md shadow-lg z-50 overflow-hidden">
          <div className="py-1 flex flex-col">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false); // Otomatis menutup menu setelah action ditekan
                }}
                className="text-left px-4 py-2 text-sm text-text hover:bg-secondary hover:text-primary transition-colors"
              >
                {action.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AceUIDropdown;
