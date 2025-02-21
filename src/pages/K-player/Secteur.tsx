import { useState } from "react";

const Secteur = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Secteur</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        mn
      </button>
      {menuOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Option 1</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Option 2</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Secteur;
