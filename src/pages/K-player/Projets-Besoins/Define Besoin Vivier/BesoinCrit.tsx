import React from "react";

interface BesoinCritProps {
    formData: {
        contract_role: string;
        critStartDate: string;
        critStartDateLatest: string;
        critDuration: string;
        critDurationLatest: string;
        critTargetRate: string;
        critMaxRate: string;
        critLocation: string;
        remoteWork: string;
    };
    updateFormData: (section: string, field: string, value: any) => void;
}

const BesoinCrit: React.FC<BesoinCritProps> = ({ formData, updateFormData }) => {
    const handleChange = (field: string, value: string) => {
        updateFormData("criteria", field, value);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full" style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
            <h2 className="text-lg font-semibold mb-4">Critères</h2>

            {/* Type de contrat */}
            <p className="text-gray-600 mb-2">Type de contrat proposé</p>
            <div className="flex gap-4 mb-4">
                {["CDI", "CDD", "CDI-C", "FREELANCE", "CONSULTANT", "PORTAGE"].map((contract) => (
                    <label key={contract} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.contract_role === contract}
                            onChange={() => handleChange("contract_role", contract)}
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
                    <input
                        type="date"
                        className="w-full border p-2 rounded-md"
                        value={formData.critStartDate}
                        onChange={(e) => handleChange("critStartDate", e.target.value)}
                        placeholder="Date de début"
                    />
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="w-full border p-2 rounded-md"
                        placeholder="Au plus tard"
                        value={formData.critStartDateLatest}
                        onChange={(e) => handleChange("critStartDateLatest", e.target.value)}
                    />
                </div>
            </div>

            {/* Durée prévisionnelle */}
            <p className="text-gray-600 mb-2">Durée prévisionnelle (jours)</p>
            <div className="flex gap-2 mb-4">
                <input
                    type="number"
                    placeholder="Minimum"
                    className="w-full border p-2 rounded-md"
                    value={formData.critDuration}
                    onChange={(e) => handleChange("critDuration", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Maximum"
                    className="w-full border p-2 rounded-md"
                    value={formData.critDurationLatest}
                    onChange={(e) => handleChange("critDurationLatest", e.target.value)}
                />
            </div>

            {/* TJM ou salaire */}
            <p className="text-gray-600 mb-2">TJM ou salaire cible</p>
            <div className="flex gap-2 mb-4">
                <input
                    type="number"
                    placeholder="TJM ou salaire cible"
                    className="w-full border p-2 rounded-md"
                    value={formData.critTargetRate}
                    onChange={(e) => handleChange("critTargetRate", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="TJM ou salaire max"
                    className="w-full border p-2 rounded-md"
                    value={formData.critMaxRate}
                    onChange={(e) => handleChange("critMaxRate", e.target.value)}
                />
            </div>

            {/* Localisation */}
            <p className="text-gray-600 mb-2">Localisation</p>
            <input
                type="text"
                placeholder="Localisation"
                className="w-full border p-2 rounded-md mb-4"
                value={formData.critLocation}
                onChange={(e) => handleChange("critLocation", e.target.value)}
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
                            checked={formData.remoteWork === option}
                            onChange={() => handleChange("remoteWork", option)}
                            className="w-4 h-4 text-blue-600"
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default BesoinCrit;