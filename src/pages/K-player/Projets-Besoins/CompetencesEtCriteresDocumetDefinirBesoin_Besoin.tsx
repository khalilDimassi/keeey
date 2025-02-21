import React, { useRef, useState,useEffect } from "react";
import { Calendar, PlusCircle, Trash2 } from "lucide-react";
import DocumentsDevinirBesoin from "./DocumentUploadModal";


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

const CompetencesEtCriteresDocument: React.FC = () => {
  const [selectedSecteurs, setSelectedSecteurs] = useState<string[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>("CDI");
  const [remoteWork, setRemoteWork] = useState<string>("Non");
  const [languageInput, setLanguageInput] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);



    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
  

 // Gestion des sélections/désélections des secteurs
 const toggleSecteur = (secteur: string, index: number) => {
  const isSelected = selectedSecteurs.includes(secteur);
  
  if (isSelected) {
    // Si déjà sélectionné, on désélectionne
    setSelectedSecteurs(prev => prev.filter(item => item !== secteur));
    // Et on supprime l'option sélectionnée
    const newSelectedOptions = { ...selectedOptions };
    delete newSelectedOptions[index];
    setSelectedOptions(newSelectedOptions);
  } else {
    // Si pas sélectionné, on sélectionne
    setSelectedSecteurs(prev => [...prev, secteur]);
    // Et on sélectionne automatiquement l'option "Junior" (index 2)
    setSelectedOptions(prev => ({
      ...prev,
      [index]: 2
    }));
  }
};
 // Vérifie si une option est sélectionnée
 const isOptionSelected = (optionIndex: number, sectorIndex: number) => {
  return selectedOptions[sectorIndex] === optionIndex;
};
  const addLanguage = () => {
    if (languageInput.trim() !== "" && !languages.includes(languageInput)) {
      setLanguages([...languages, languageInput]);
      setLanguageInput("");
    }
  };
// Détermine la couleur d'une ligne spécifique basée sur l'option sélectionnée
const getLineColor = (sectorIndex: number, lineIndex: number) => {
  const selectedOption = selectedOptions[sectorIndex];
  
  if (selectedOption === 0) {
    // Expert - toutes les lignes sont bleues
    return "bg-blue-600";
  } else if (selectedOption === 1) {
    // Intermediaire - lignes 2 et 3 sont bleues
    return lineIndex >= 1 ? "bg-blue-600" : "bg-gray-400";
  } else if (selectedOption === 2) {
    // Junior - seulement la ligne 3 est bleue
    return lineIndex === 2 ? "bg-blue-600" : "bg-gray-400";
  }
  
  // Aucune option sélectionnée - toutes sont grises
  return "bg-gray-400";
};
  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang));
  };
 // Toggle le dropdown menu
  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Sélectionner une option du dropdown
  const selectOption = (optionIndex: number, sectorIndex: number) => {
    // Récupérer le secteur correspondant
    const secteur = secteursOptions[sectorIndex];
    
    // Ajouter automatiquement le secteur aux secteurs sélectionnés s'il n'est pas déjà sélectionné
    if (!selectedSecteurs.includes(secteur)) {
      setSelectedSecteurs(prev => [...prev, secteur]);
    }
    
    // Mettre à jour l'option sélectionnée
    setSelectedOptions({
      ...selectedOptions,
      [sectorIndex]: optionIndex
    });
    
    // Fermer le dropdown
    setOpenDropdownIndex(null);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <div className="my-2 bg-gray-100 min-h-screen flex gap-6">
      {/* Left side: Compétences */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2" style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
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
              <div key={index} className="flex bg-gray-100 border relative">
                <button
                  name="fr"
                  className={`px-3 flex py-2 ${
                    selectedSecteurs.includes(secteur)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => toggleSecteur(secteur, index)}
                >
                  {secteur}
                </button>
                <div className="relative">
                  <button
                    name="mn"
                    className="group px-2"
                    onClick={() => toggleDropdown(index)}
                  >
                    <div className="flex flex-col justify-between w-[15px] h-[12px] duration-500 overflow-hidden group-focus:rotate-180">
                      <div className={`h-[2px] w-7 ${getLineColor(index, 0)}`}></div>
                      <div className={`h-[2px] w-7 ${getLineColor(index, 1)}`}></div>
                      <div className={`h-[2px] w-7 ${getLineColor(index, 2)}`}></div>
                    </div>
                  </button>
                  {openDropdownIndex === index && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 top-full bg-white border border-gray-200 rounded-md shadow-lg"
                      style={{ minWidth: "150px", marginLeft: "30px", marginTop: "-90px" }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => selectOption(0, index)}
                          className={`block w-full text-left px-4 py-2 ${
                            isOptionSelected(0, index) 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Expert
                        </button>
                        <button
                          onClick={() => selectOption(1, index)}
                          className={`block w-full text-left px-4 py-2 ${
                            isOptionSelected(1, index) 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Intermediaire
                        </button>
                        <button
                          onClick={() => selectOption(2, index)}
                          className={`block w-full text-left px-4 py-2 ${
                            isOptionSelected(2, index) 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Junior
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
        <div className="bg-white p-6 rounded-lg shadow-md w-full"style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
          <h2 className="text-lg font-semibold mb-4">Critères</h2>

          {/* Type de contrat */}
          <p className="text-gray-600 mb-2">Type de contrat proposé</p>
          <div className="flex gap-4 mb-4">
            {["CDI", "Freelance", "Consultant"].map((contract) => (
              <label key={contract} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedContract === contract}
                  onChange={() => setSelectedContract(contract)}
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
          <DocumentsDevinirBesoin />
        </div>
      </div>
    </div>
  );
};

export default CompetencesEtCriteresDocument;