import { useState } from "react";

function Confidentialite() {
  const [profileVisibility, setProfileVisibility] = useState({
    everyone: false,
    platformOnly: true,
    contactsOnly: false,
    noOne: false,
  });

  const toggleProfileVisibility = (key: keyof typeof profileVisibility) => {
    setProfileVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-teal-800 mb-6">
        Confidentialité et accès
      </h2>

      {/* VISIBILITÉ DU PROFIL */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">Qui peut voir mon profil ?</h3>
        <div className="space-y-3">
          {Object.entries(profileVisibility).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleProfileVisibility(key as keyof typeof profileVisibility)}
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center 
                ${value ? "bg-teal-800 border-teal-800" : "border-gray-400"}`}
              >
                {value && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
              </div>
              <span className="text-gray-700">
                {key === "everyone"
                  ? "Tout le monde"
                  : key === "platformOnly"
                  ? "Plateforme uniquement"
                  : key === "contactsOnly"
                  ? "Uniquement contacts"
                  : "Personne"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* BOUTON TERMINER */}
      <div className="flex justify-end">
        <button className="bg-teal-800 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 transition-all">
          Terminer
        </button>
      </div>
    </div>
  );
}
export default Confidentialite;
