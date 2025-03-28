import React, { useState } from "react";
import { Calendar, PlusCircle, Trash2 } from "lucide-react";
import DocumentsSection from "./DocumentUploadModal";


const secteursOptions = [
  "Développement et Programmation",
  "Infrastructures et Réseaux",
  "Gestion de Projet et Consulting",
  "Marketing Digital et Communication",
  "Cybersécurité",
  "Administration des Bases de Données",
  "Data et Intelligence Artificielle (IA)",
  "Web, Design et UX/UI",
];

const CompetencesEtCriteresBesoin: React.FC = () => {
  const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
  const [contract_role, setcontract_role] = useState<string>("CDI");
  const [remoteWork, setRemoteWork] = useState<string>("Non");
  const [languageInput, setLanguageInput] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);

  const toggleSecteur = (secteur: string) => {
    setSelectedSecteurs((prev) =>
      prev.includes(secteur)
        ? prev.filter((item) => item !== secteur)
        : [...prev, secteur]
    );
  };

  const addLanguage = () => {
    if (languageInput.trim() !== "" && !languages.includes(languageInput)) {
      setLanguages([...languages, languageInput]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  return (
    <div className="my-2 bg-gray-100 min-h-screen flex gap-6">
      {/* Left side: Compétences */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
        <h2 className="text-lg font-semibold mb-4">Compétences</h2>
        {/* Secteur (Encadré) */}
        <p className="text-black font-semibold mb-2">Secteur</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            "Automobile / Equipementiers",
            "Ferroviaire",
            "Aérospatial",
            "Défense",
            "Life Science",
            "Énergie",
            "Naval",
            "Industrie Mécanique / Électronique / Multi secteurs",
          ].map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-2 border rounded-md p-2 text-gray-700"
            >
              <input type="checkbox" className="w-4 h-4 accent-blue-600" />
              {item}
            </button>
          ))}
        </div>
        {/* Secteurs */}
        <p className="text-gray-600 mb-2">Secteur</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {secteursOptions.map((secteur, index) => (
            <button
              key={index}
              className={`px-3 py-2 rounded-md border ${selectedSecteurs.includes(secteur)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => toggleSecteur(secteur)}
            >
              {secteur} +
            </button>
          ))}
        </div>

        {/* Séniorité */}
        <p className="text-gray-600 mb-2">Séniorité</p>
        <div className="flex items-center">
          <input type="range" className="w-full" />
          <span className="ml-2 text-gray-700">Expert</span>
        </div>

        {/* Outils */}
        <p className="text-gray-600 mt-4">Outils / habilitations</p>
        <input type="text" className="w-full border p-2 rounded-md mt-1" />

        {/* Langues */}
        <p className="text-gray-600 mt-4">Langues</p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Ajouter une langue"
            className="w-full border p-2 rounded-md"
          />
          <button
            onClick={addLanguage}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={28} />
          </button>
        </div>

        {/* Affichage des langues ajoutées */}
        <div className="flex flex-wrap gap-2 mb-4">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-md p-2"
            >
              <span>{lang}</span>
              <button
                onClick={() => removeLanguage(lang)}
                className="text-white"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Qualités relationnelles */}
        <p className="text-gray-600 mt-4">Qualités Relationnelles</p>
        <input type="text" className="w-full border p-2 rounded-md mt-1" />
      </div>

      {/* Right side: Critères and DocumentUploadModal */}
      <div className="flex flex-col w-1/2 gap-6">
        {/* Section Critères */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h2 className="text-lg font-semibold mb-4">Critères</h2>

          {/* Type de contrat */}
          <p className="text-gray-600 mb-2">Type de contrat proposé</p>
          <div className="flex gap-4 mb-4">
            {["CDI", "Freelance", "Consultant"].map((contract) => (
              <label key={contract} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={contract_role === contract}
                  onChange={() => setcontract_role(contract)}
                  className="w-4 h-4 text-blue-600"
                />
                {contract}
              </label>
            ))}
          </div>

          {/* Date de démarrage */}
          <p className="text-gray-600 mb-2">Date de démarrage souhaitée</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex gap-2">
              <input type="date" className="w-full border p-2 rounded-md" />
              <button className="p-2 border rounded-md">
                <Calendar size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full border p-2 rounded-md"
                placeholder="Au plus tard"
              />
              <button className="p-2 border rounded-md">
                <Calendar size={18} />
              </button>
            </div>
          </div>

          {/* Durée prévisionnelle */}
          <p className="text-gray-600 mb-2">Durée prévisionnelle</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex gap-2">
              <input type="date" className="w-full border p-2 rounded-md" />
              <button className="p-2 border rounded-md">
                <Calendar size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full border p-2 rounded-md"
                placeholder="Au plus tard"
              />
              <button className="p-2 border rounded-md">
                <Calendar size={18} />
              </button>
            </div>
          </div>

          {/* TJM ou salaire */}
          <p className="text-gray-600 mb-2">TJM ou salaire cible</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="TJM ou salaire cible"
              className="w-full border p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="TJM ou salaire max"
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* Localisation */}
          <p className="text-gray-600 mb-2">Localisation</p>
          <input
            type="text"
            placeholder="Localisation"
            className="w-full border p-2 rounded-md mb-4"
          />

          {/* Télétravail */}
          <p className="text-gray-600 mb-2">Télétravail</p>
          <div className="flex gap-4 mb-4">
            {["Oui", "Non"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="remote"
                  value={option}
                  checked={remoteWork === option}
                  onChange={() => setRemoteWork(option)}
                  className="w-4 h-4 text-blue-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* DocumentUploadModal */}
        <div className=" shadow-md w-full">
          <DocumentsSection />
        </div>
      </div>
    </div>
  );
};

export default CompetencesEtCriteresBesoin;