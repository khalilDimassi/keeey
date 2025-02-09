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
    <div>
      <h2 className="text-2xl font-semibold text-teal-800 mb-6">
        Confidentialité et accès
      </h2>

      {/* VISIBILITÉ DU PROFIL */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">Qui peut voir mon profil ?</h3>
        <div className="space-y-3">
          {Object.entries(profileVisibility).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                  value ? "bg-teal-800" : "bg-gray-300"
                }`}
                onClick={() => toggleProfileVisibility(key as keyof typeof profileVisibility)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    value ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
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
        <button className="bg-teal-800 text-white px-6 py-3 rounded-3xl font-semibold hover:bg-teal-700 transition-all">
          Terminer
        </button>
      </div>
    </div>
  );
}

export default Confidentialite;
