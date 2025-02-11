import { useState } from "react";

function Competencies() {
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
    const sectors: string[] = [
      "Automobile / Equipements",
      "Ferroviaire",
      "Aérospatial",
      "Naval",
      "Life Science",
      "Énergie",
      "Défense",
      "Industrie Mécanique / Électronique / Multi secteurs",
      "Digital - IT",
    ];
  
    const skillsBySector: Record<string, string[]> = {
      "Digital - IT": [
        "Développement & Programmation",
        "Infrastructures et Réseau",
        "Data et Intelligence Artificielle",
        "Web, Design et UI/UX",
        "Cybersécurité",
        "Gestion de Projet et Consulting",
        "Marketing Digital et Communication",
        "Administration des Bases de Données",
        "Architectes et Ingénierie Systèmes",
      ],
    };
  
    const subSkillsBySkill: Record<string, string[]> = {
      "Développement & Programmation": [
        "Développeur Full-Stack",
        "Développeur Front-End",
        "Développeur Back-End",
        "Développeur Web",
        "Développeur Mobile",
        "Ingénieur Logiciel",
      ],
    };
  
    const handleSectorSelect = (sector: string) => {
      setSelectedSectors((prev) =>
        prev.includes(sector)
          ? prev.filter((item) => item !== sector)
          : prev.length < 3
          ? [...prev, sector]
          : prev
      );
    };
  
    const handleSkillSelect = (skill: string) => {
      // Si la compétence est déjà sélectionnée, on la désélectionne
      if (selectedSkill === skill) {
        setSelectedSkill(null);
      } else {
        setSelectedSkill(skill);
      }
    };
  
    return (
      <div className="space-y-6 p-4">
        {/* Section Sélection des Secteurs */}
        <div className="rounded-lg p-4 bg-gray-50 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Choisissez le secteur de compétences qui correspond à votre domaine d’expertise
            <span className="text-sm text-gray-500"> (Choisissez 3 maximum)</span>
          </h2>
  
          {/* Liste des secteurs avec checkbox */}
          <div className="flex flex-wrap gap-3 mt-3">
            {sectors.map((sector) => (
              <label key={sector} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(sector)}
                  onChange={() => handleSectorSelect(sector)}
                  className="hidden"
                />
                <div
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition ${
                    selectedSectors.includes(sector)
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  <span className="mr-2">
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      readOnly
                      className="accent-teal-600"
                    />
                  </span>
                  {sector}
                </div>
              </label>
            ))}
          </div>
  
          {/* Secteurs sélectionnés */}
          {selectedSectors.length > 0 && (
            <div className="flex gap-0 items-center justify-center mt-4">
              {selectedSectors.map((sector, index) => (
                <button
                  key={sector}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedSector === sector ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
                  } 
                  ${index > 0 ? "border-l-2 border-white" : ""} 
                  ${index === 0 ? "rounded-l-full" : ""} 
                  ${index === selectedSectors.length - 1 ? "rounded-r-full" : ""}`}
                  style={{
                    width: `${100 / selectedSectors.length}%`, // Ajuste la largeur en fonction du nombre de secteurs
                  }}
                  onClick={() => setSelectedSector(sector)}
                >
                  {sector}
                </button>
              ))}
            </div>
          )}
        </div>
  
        {/* Section Compétences et Sous-compétences : affichée seulement si un secteur est sélectionné */}
        {selectedSectors.length > 0 && selectedSector && selectedSectors.includes(selectedSector) && (
          <div className="rounded-lg p-4 bg-gray-50 shadow-md">
            {/* Affichage des compétences du secteur sélectionné */}
            {skillsBySector[selectedSector] && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">{selectedSector}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsBySector[selectedSector].map((skill) => (
                    <button
                      key={skill}
                      className={`px-3 py-1 rounded-lg border transition ${
                        selectedSkill === skill
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                      onClick={() => handleSkillSelect(skill)} // Appelle la fonction handleSkillSelect
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
  
            {/* Affichage des sous-compétences du skill sélectionné */}
            {selectedSkill && subSkillsBySkill[selectedSkill] && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">{selectedSkill}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subSkillsBySkill[selectedSkill].map((subSkill) => (
                    <button
                      key={subSkill}
                      className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 border border-gray-300"
                    >
                      {subSkill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  export default Competencies;