import { useState } from "react";

function SearchCriteria() {
    const [availability, setAvailability] = useState("Immédiate");
  
    const contractTypes = [
      { id: 1, label: "Freelance / Indépendant", key: "freelance" },
      { id: 2, label: "Portage", key: "portage" },
      { id: 3, label: "CDI", key: "cdi" },
    ];
  
    const mobilityOptions = ["Locale", "Régionale", "France", "Internationale"];
  
    const companyTypes = [
      "Pas de critère / Ouvert(e) à tout",
      "Entreprise Industrielle / Client final",
      "Bureaux d'Études / ESN / Conseil",
      "Grandes Entreprises",
      "PME/TPE",
    ];
  
    return (
      <div className="p-4" >
        {/* Utilisation de grid pour aligner Type de contrat et Mobilité */}
        <div className="grid grid-cols-2 gap-6 items-start">
          {/* Type de contrat souhaité */}
          <div>
            <h2 className="text-lg font-medium">Type de contrat souhaité</h2>
            <div className="space-y-3">
              {contractTypes.map((contract) => (
                <div key={contract.id} className="space-y-1">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-teal-600 accent-teal-600" />
                    <span>{contract.label}</span>
                  </label>
                  {["freelance", "portage"].includes(contract.key) && (
                    <input
                      type="text"
                      placeholder="Tjm"
                      className="border border-gray-300 rounded px-3 py-1 w-full md:w-1/3"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Mobilité */}
          <div>
            <h2 className="text-lg font-medium">Mobilité</h2>
            <div className="space-y-2">
              {mobilityOptions.map((mobility, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox text-teal-600 accent-teal-600" />
                  <span>{mobility}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
  
        {/* Utilisation de grid pour aligner Type d’entreprise visée et Disponibilité */}
        <div className="grid grid-cols-2 gap-6 items-start mt-6">
          {/* Type d’entreprise visée */}
          <div>
            <h2 className="text-lg font-medium">Type d’entreprise visée</h2>
            <div className="space-y-2">
              {companyTypes.map((company, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox text-teal-600 accent-teal-600" />
                  <span>{company}</span>
                </label>
              ))}
            </div>
          </div>
  
          {/* Disponibilité */}
          <div>
            <h2 className="text-lg font-medium">Disponibilité</h2>
            <div className="space-y-2">
              {["Immédiate", "> 1 mois", "> 3 mois"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availability"
                    className="form-radio text-teal-600 accent-teal-600"
                    checked={availability === option}
                    onChange={() => setAvailability(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <input type="date" className="border border-gray-300 rounded p-2 mt-2 w-full md:w-1/2" />
          </div>
        </div>
      </div>
    );
  }
  export default SearchCriteria;