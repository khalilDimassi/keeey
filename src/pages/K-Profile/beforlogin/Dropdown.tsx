import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SmallDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("séniorité");

  return (
    <div className="relative w-28  ml-8 mb-2">
      {/* Main Button */}
      <div
        className="w-full flex justify-between items-center px-3 py-2 text-sm bg-white border border-gray-400 rounded-lg shadow-sm cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <ChevronDown className="w-4 h-4" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-purple-50 shadow-md rounded-lg py-1">
          {["Junior", "Intermédiaire", "Expert"].map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="px-3 py-1 text-sm text-gray-800 hover:bg-purple-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmallDropdown;
