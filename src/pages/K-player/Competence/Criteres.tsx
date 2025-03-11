import React from "react";

interface CriteresProps {
    selectedContract: string;
    setSelectedContract: React.Dispatch<React.SetStateAction<string>>;
    remoteWork: string;
    setRemoteWork: React.Dispatch<React.SetStateAction<string>>;
}

const Criteres: React.FC<CriteresProps> = ({
    selectedContract,
    setSelectedContract,
    remoteWork,
    setRemoteWork,
}) => {
    return (
        <div
            className="bg-white p-6 rounded-lg shadow-md w-1/2"
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
        >
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
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="w-full border p-2 rounded-md"
                        placeholder="Au plus tard"
                    />
                </div>
            </div>

            {/* Durée prévisionnelle */}
            <p className="text-gray-600 mb-2">Durée prévisionnelle</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2">
                    <input type="date" className="w-full border p-2 rounded-md" />
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="w-full border p-2 rounded-md"
                        placeholder="Au plus tard"
                    />
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
            <div className="flex gap-4">
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
    );
};

export default Criteres;