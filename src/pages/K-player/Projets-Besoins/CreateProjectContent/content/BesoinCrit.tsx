import { FC, useState } from "react";
import { OpportunityCriteria, OpportunityRequirements } from "../../types";
import { PlusCircle, Trash2 } from "lucide-react";

interface BesoinCritProps {
    formData: OpportunityCriteria & OpportunityRequirements;
    onFormDataChange: (field: keyof (OpportunityCriteria & OpportunityRequirements), value: any) => void;
}

const BesoinCrit: FC<BesoinCritProps> = ({ formData, onFormDataChange }) => {
    const [inputValues, setInputValues] = useState({
        tool: "",
        authorization: "",
        language: "",
        quality: "",
    });

    const handleInputChange = (field: keyof typeof inputValues, value: string) => {
        setInputValues(prev => ({ ...prev, [field]: value }));
    };

    const addItem = (field: keyof typeof inputValues, listKey: keyof OpportunityRequirements) => {
        const value = inputValues[field]?.trim();
        if (!value) return;

        const currentArray = Array.isArray(formData[listKey])
            ? formData[listKey]
            : [];

        if (currentArray.includes(value)) {
            return;
        }

        onFormDataChange(listKey, [...currentArray, value]);
        handleInputChange(field, "");
    };

    const removeItem = (listKey: keyof OpportunityRequirements, item: string) => {
        const currentArray = Array.isArray(formData[listKey]) ? formData[listKey] : [];
        onFormDataChange(listKey, currentArray.filter(i => i !== item));

    };

    return (
        <div
            className="bg-white p-6 rounded-lg shadow-md"
            style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}
        >
            <h2 className="text-lg font-semibold mb-4">Critères</h2>

            {/* Type de contrat */}
            <p className="text-gray-600 mb-2">Type de contrat proposé</p>
            <div className="flex flex-wrap gap-4 mb-4">
                {[
                    { value: "FREELANCE", label: "Freelance" },
                    { value: "CDI", label: "CDI" },
                    { value: "CDD", label: "CDD" },
                    { value: "CDI-C", label: "CDI Cadre" },
                    { value: "PORTAGE", label: "Portage salarial" },
                    { value: "CONSULTANT", label: "Consultant" },
                ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="contract"
                            checked={formData.contract_role === value}
                            onChange={() => onFormDataChange("contract_role", value)}
                            className="w-4 h-4 text-blue-600"
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* Date de démarrage */}
            <p className="text-gray-600 mb-2">Date de démarrage souhaitée</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="w-full border p-2 rounded-xl"
                        value={formData.crit_start_date}
                        onChange={(e) => onFormDataChange("crit_start_date", e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="w-full border p-2 rounded-xl"
                        value={formData.crit_start_date_lastest}
                        onChange={(e) => onFormDataChange("crit_start_date_lastest", e.target.value)}
                        placeholder="Au plus tard"
                    />
                </div>
            </div>

            {/* Durée prévisionnelle */}
            <p className="text-gray-600 mb-2">Durée prévisionnelle</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="w-full border p-2 rounded-xl"
                        placeholder="jours"
                        value={formData.crit_duration}
                        onChange={(e) => {
                            const value = e.target.value;
                            onFormDataChange("crit_duration", value === "" ? null : parseInt(value, 10));
                        }}
                    />
                </div>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="w-full border p-2 rounded-xl"
                        placeholder="Au plus tard"
                        value={formData.crit_duration_lastest}
                        onChange={(e) => {
                            const value = e.target.value;
                            onFormDataChange("crit_duration_lastest", value === "" ? null : parseInt(value, 10));
                        }}
                    />
                </div>
            </div>

            {/* TJM ou salaire */}
            <p className="text-gray-600 mb-2">TJM ou salaire cible</p>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="TJM ou salaire cible"
                    className="w-full border p-2 rounded-xl"
                    value={formData.crit_target_rate}
                    onChange={(e) => {
                        const value = e.target.value;
                        onFormDataChange("crit_target_rate", value === "" ? null : parseInt(value, 10));
                    }}
                />
                <input
                    type="text"
                    placeholder="TJM ou salaire max"
                    className="w-full border p-2 rounded-xl"
                    value={formData.crit_max_rate}
                    onChange={(e) => {
                        const value = e.target.value;
                        onFormDataChange("crit_max_rate", value === "" ? null : parseInt(value, 10));
                    }}
                />
            </div>

            {/* Localisation */}
            <p className="text-gray-600 mb-2">Localisation</p>
            <input
                className="w-full border p-2 rounded-xl mb-4"
                type="text"
                placeholder="Localisation"
                value={formData.crit_location}
                onChange={(e) => onFormDataChange("crit_location", e.target.value)}
            />

            {/* Télétravail */}
            <p className="text-gray-600 mb-2">Télétravail</p>
            <div className="flex gap-4 mb-4">
                {[
                    { value: true, label: "Oui" },
                    { value: false, label: "Non" }
                ].map(({ value, label }) => (
                    <label key={label} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="remote"
                            checked={formData.crit_remote === value}
                            onChange={() => onFormDataChange("crit_remote", value)}
                            className="w-4 h-4 text-blue-600"
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* Outils */}
            <p className="text-gray-600 mt-4">Outils</p>
            <div className="flex items-center gap-1 mb-4">
                <input
                    type="text"
                    value={inputValues.tool}
                    onChange={(e) => handleInputChange("tool", e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addItem("tool", "tools");
                        }
                    }}
                    placeholder="Ajouter un outil"
                    className="w-full border p-2 rounded-xl"
                />
                <button
                    onClick={() => addItem("tool", "tools")}
                    className={`${inputValues.tool.trim()
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-400"
                        } transition-colors`}
                    disabled={!inputValues.tool.trim()}
                >
                    <PlusCircle size={28} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {formData.tools?.map((tool, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-[#215A96] text-white rounded-xl p-2"
                    >
                        <span>{tool}</span>
                        <button
                            onClick={() => removeItem("tools", tool)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Habilitations */}
            <p className="text-gray-600 mt-4">Habilitations</p>
            <div className="flex items-center gap-1 mb-4">
                <input
                    type="text"
                    value={inputValues.authorization}
                    onChange={(e) => handleInputChange("authorization", e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addItem("authorization", "authorizations");
                        }
                    }}
                    placeholder="Ajouter une habilitation"
                    className="w-full border p-2 rounded-xl"
                />
                <button
                    onClick={() => addItem("authorization", "authorizations")}
                    className={`${inputValues.authorization.trim()
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-400"
                        } transition-colors`}
                    disabled={!inputValues.authorization.trim()}
                >
                    <PlusCircle size={28} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {formData.authorizations?.map((auth, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-[#215A96] text-white rounded-xl p-2"
                    >
                        <span>{auth}</span>
                        <button
                            onClick={() => removeItem("authorizations", auth)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Langues */}
            <p className="text-gray-600 mt-4">Langues</p>
            <div className="flex items-center gap-1 mb-4">
                <input
                    type="text"
                    value={inputValues.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addItem("language", "languages");
                        }
                    }}
                    placeholder="Ajouter une langue"
                    className="w-full border p-2 rounded-xl"
                />
                <button
                    onClick={() => addItem("language", "languages")}
                    className={`${inputValues.language.trim()
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-400"
                        } transition-colors`}
                    disabled={!inputValues.language.trim()}
                >
                    <PlusCircle size={28} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {formData.languages?.map((lang, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-[#215A96] text-white rounded-xl p-2"
                    >
                        <span>{lang}</span>
                        <button
                            onClick={() => removeItem("languages", lang)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Qualités Relationnelles */}
            <p className="text-gray-600 mt-4">Qualités Relationnelles</p>
            <div className="flex items-center gap-1 mb-4">
                <input
                    type="text"
                    value={inputValues.quality}
                    onChange={(e) => handleInputChange("quality", e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addItem("quality", "qualities");
                        }
                    }}
                    placeholder="Ajouter une qualité"
                    className="w-full border p-2 rounded-xl"
                />
                <button
                    onClick={() => addItem("quality", "qualities")}
                    className={`${inputValues.quality.trim()
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-400"
                        } transition-colors`}
                    disabled={!inputValues.quality.trim()}
                >
                    <PlusCircle size={28} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {formData.qualities?.map((quality, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-[#215A96] text-white rounded-xl p-2"
                    >
                        <span>{quality}</span>
                        <button
                            onClick={() => removeItem("qualities", quality)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BesoinCrit;