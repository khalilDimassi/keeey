import { useState } from "react";

function SearchCriteria() {
    const [availability, setAvailability] = useState("Immédiate");
    const [transportMode, setTransportMode] = useState("noConstraint");
    const [workLocation, setWorkLocation] = useState("onSite");

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
        <div className="p-4">
            <div className="grid grid-cols-2 gap-6 items-start">
                {/* Type de contrat souhaité */}
                <div className="space-y-3">
                    <h2 className="text-lg font-medium">Type de contrat souhaité</h2>
                    <div className="space-y-2">
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
                    
                         {/* Mobilité - Mode de transport */}
                <div className="mt-6">
                <h2 className="text-lg font-medium">Mobilité - Mode de transport</h2>
                <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="transportMode"
                            className="form-radio text-teal-600 accent-teal-600"
                            checked={transportMode === "noConstraint"}
                            onChange={() => setTransportMode("noConstraint")}
                        />
                        <span>Pas de contrainte : Véhicule personnel ou autre mode de transport</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="transportMode"
                            className="form-radio text-teal-600 accent-teal-600"
                            checked={transportMode === "publicTransport"}
                            onChange={() => setTransportMode("publicTransport")}
                        />
                        <span>Modes doux ou transport en commun uniquement</span>
                    </label>
                </div>
            </div>
                </div>

                {/* Mobilité */}
                <div className=" space-y-2">
                <h2 className="text-lg font-medium space-y-2">Mobilité</h2>

                      {/* Ville input field */}
                      <div className="mb-3 space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Ville</label>
                          <input 
                              type="text" 
                              placeholder="Ville" 
                              className="border border-gray-300 rounded px-3 py-1 w-full md:w-1/2"
                          />
                      </div>

                      {/* Mobility Options */}
                      <div className="flex items-center space-x-4 space-y-2">
                          {mobilityOptions.map((mobility, index) => (
                              <label key={index} className="flex items-center space-x-2">
                                  <input type="checkbox" className="form-checkbox text-teal-600 accent-teal-600" />
                                  <span>{mobility}</span>
                              </label>
                          ))}
                      </div>

{/* Distance Slider */}
<div className="mt-3">
    <label className="block text-sm font-medium text-gray-700">Distance</label>
    <input 
        type="range" 
        min="0" 
        max="100" 
        defaultValue="0" 
        className="w-full"
    />
    <div className="flex justify-between text-sm text-gray-600">
        <span>0 km</span>
        <span>100 km</span>
    </div>
</div>

                </div>
                
            </div>

       

            <div className="grid grid-cols-2 gap-6 items-start mt-8">
                {/* Type d’entreprise visée */}
                <div className="space-y-7">
                    <h2 className="text-lg font-medium">Type d’entreprise visée</h2>
                    <div className="space-y-3">
                        {companyTypes.map((company, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input type="checkbox" className="form-checkbox text-teal-600 accent-teal-600" />
                                <span>{company}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type de lieu de travail */}
                <div>
                    <h2 className="text-lg font-medium " style={{marginTop:"-7rem"}}>Type de lieu de travail</h2>
                    <div className="space-y-2">
                        {["Sur site", "Hybride", "À distance"].map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="workLocation"
                                    className="form-radio text-teal-600 accent-teal-600"
                                    checked={workLocation === option}
                                    onChange={() => setWorkLocation(option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                     {/* Disponibilité */}
            <div className="mt-8">
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

           
        </div>
    );
}

export default SearchCriteria;
