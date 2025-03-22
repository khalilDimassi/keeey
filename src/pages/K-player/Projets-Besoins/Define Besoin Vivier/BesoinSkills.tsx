import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Sector } from "./DefineBesoinForm";

interface BesoinSkillsProps {
    formData: {
        selectedSectors: number[];
        activeSector: number | null;
        seniority: { [key: number]: number };
        selectedJobs: { [key: number]: number[] };
        tools: string[];
        authorizations: string[];
        languages: string[];
        qualities: string[];
    };
    sectors: Sector[];
    loading: boolean;
    error: string | null;
    toggleSector: (sectorId: number) => void;
    handleSeniorityChange: (sectorId: number, value: number) => void;
    toggleJob: (sectorId: number, jobId: number) => void;
    addItem: (listName: "tools" | "authorizations" | "languages" | "qualities", item: string) => void;
    removeItem: (listName: "tools" | "authorizations" | "languages" | "qualities", item: string) => void;
    setActiveSector: (sectorId: number) => void;
}

const BesoinSkills: React.FC<BesoinSkillsProps> = ({
    formData,
    sectors,
    loading,
    error,
    toggleSector,
    handleSeniorityChange,
    toggleJob,
    addItem,
    removeItem,
    setActiveSector,
}) => {
    // Local state for input fields
    const [toolInput, setToolInput] = useState("");
    const [authorizationInput, setAuthorizationInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");
    const [qualityInput, setQualityInput] = useState("");

    const renderSenioritySlider = (sectorId: number) => {
        const seniorityLevels = [
            { level: 1, name: "Junior", description: "1 - 4 ans" },
            { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
            { level: 3, name: "Senior", description: "10 - 14 ans" },
            { level: 4, name: "Lead", description: "15 - 19 ans" },
            { level: 5, name: "Principal", description: "20+ ans" },
        ];
        const currentLevel = formData.seniority[sectorId] || 1;
        const currentSeniority = seniorityLevels.find(level => level.level === currentLevel);

        return (
            <div className="my-4">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{currentSeniority?.name}</span>
                    <span>{currentSeniority?.description}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="5"
                    value={currentLevel}
                    onChange={(e) => handleSeniorityChange(sectorId, parseInt(e.target.value))}
                    className="w-full"
                />
            </div>
        );
    };

    const renderJobs = (sectorId: number) => {
        const sector = sectors.find(s => s.id === sectorId);
        if (!sector) return null;

        return (
            <div className="flex flex-wrap gap-2 my-4">
                {sector.jobs.map(job => (
                    <button
                        type="button"
                        key={job.id}
                        className={`flex items-center px-3 py-2 border  shadow rounded-xl ${formData.selectedJobs[sectorId]?.includes(job.id)
                            ? 'bg-[#215A96] text-white'
                            : 'border-black bg-gray-50 text-gray-700'
                            }`}
                        onClick={() => toggleJob(sectorId, job.id)}
                    >
                        {job.job} <span className="ml-1">{formData.selectedJobs[sectorId]?.includes(job.id) ? '-' : '+'}</span>
                    </button>
                ))}
            </div>
        );
    };

    const handleAddItemClick = (
        listName: "tools" | "authorizations" | "languages" | "qualities",
        input: string,
        setInput: React.Dispatch<React.SetStateAction<string>>
    ) => {
        addItem(listName, input);
        setInput("");
    };

    return (
        <div
            className="bg-white p-6 rounded-lg shadow-md w-1/2"
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
        >
            <h2 className="text-lg font-semibold mb-4">Compétences</h2>
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
                <>
                    {/* Secteur */}
                    <p className="text-black font-semibold mb-2">Secteur</p>
                    <div className="grid grid-cols-3 gap-2 mb-4" style={{ width: "auto" }}>
                        {sectors.map((sector) => (
                            <button
                                type="button"
                                key={sector.id}
                                className={`flex items-center px-3 py-2 border shadow rounded-xl ${formData.selectedSectors.includes(sector.id) ?
                                    'bg-[#215A96] text-white' :
                                    'border-black bg-gray-50 text-gray-700'
                                    }`}
                                onClick={() => toggleSector(sector.id)}
                                disabled={!formData.selectedSectors.includes(sector.id) && formData.selectedSectors.length >= 3}
                            >
                                {sector.sector} <span className="ml-1">{formData.selectedSectors.includes(sector.id) ? '-' : '+'}</span>
                            </button>
                        ))}
                    </div>

                    {/* Selected sectors display */}
                    {formData.selectedSectors.length > 0 && (
                        <div className="flex justify-center items-center">
                            <div
                                className="inline-flex border border-gray-300 rounded-md overflow-hidden mb-6"
                                style={{ borderRadius: "20px" }}
                            >
                                {formData.selectedSectors.map((sectorId) => (
                                    <button
                                        type="button"
                                        key={sectorId}
                                        className={`px-4 py-2 ${formData.activeSector === sectorId
                                            ? "bg-[#215A96] text-white"
                                            : "border-black bg-gray-50 text-gray-700"
                                            }`}
                                        onClick={() => setActiveSector(sectorId)}
                                    >
                                        {formData.activeSector === sectorId && (
                                            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#215A96] text-white rounded-full mr-1 text-xs"></span>
                                        )}
                                        {sectors.find((s) => s.id === sectorId)?.sector}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Jobs */}
                    {formData.activeSector !== null && (
                        <div className="my-6">
                            {renderSenioritySlider(formData.activeSector)}
                            <br />
                            <p className="text-gray-600 mb-2">Metier</p>
                            {renderJobs(formData.activeSector)}
                        </div>
                    )}

                    {/* Outils */}
                    <p className="text-gray-600 mt-4">Outils</p>
                    <div className="flex items-center gap-1 mb-4">
                        <input
                            type="text"
                            value={toolInput}
                            onChange={(e) => setToolInput(e.target.value)}
                            placeholder="Ajouter un outil"
                            className="w-full border p-2 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => handleAddItemClick("tools", toolInput, setToolInput)}
                            className="text-[#215A96] hover:text-blue-800"
                        >
                            <PlusCircle size={28} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tools.map((tool, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-[#215A96] text-white rounded-md p-2"
                            >
                                <span>{tool}</span>
                                <button
                                    type="button"
                                    onClick={() => removeItem("tools", tool)}
                                    className="text-white"
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
                            value={authorizationInput}
                            onChange={(e) => setAuthorizationInput(e.target.value)}
                            placeholder="Ajouter une habilitation"
                            className="w-full border p-2 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => handleAddItemClick("authorizations", authorizationInput, setAuthorizationInput)}
                            className="text-[#215A96] hover:text-blue-800"
                        >
                            <PlusCircle size={28} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.authorizations.map((authorization, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-[#215A96] text-white rounded-md p-2"
                            >
                                <span>{authorization}</span>
                                <button
                                    type="button"
                                    onClick={() => removeItem("authorizations", authorization)}
                                    className="text-white"
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
                            value={languageInput}
                            onChange={(e) => setLanguageInput(e.target.value)}
                            placeholder="Ajouter une langue"
                            className="w-full border p-2 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => handleAddItemClick("languages", languageInput, setLanguageInput)}
                            className="text-[#215A96] hover:text-blue-800"
                        >
                            <PlusCircle size={28} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.languages.map((lang, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-[#215A96] text-white rounded-md p-2"
                            >
                                <span>{lang}</span>
                                <button
                                    type="button"
                                    onClick={() => removeItem("languages", lang)}
                                    className="text-white"
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
                            value={qualityInput}
                            onChange={(e) => setQualityInput(e.target.value)}
                            placeholder="Ajouter une qualité"
                            className="w-full border p-2 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => handleAddItemClick("qualities", qualityInput, setQualityInput)}
                            className="text-[#215A96] hover:text-blue-800"
                        >
                            <PlusCircle size={28} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.qualities.map((quality, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-[#215A96] text-white rounded-md p-2"
                            >
                                <span>{quality}</span>
                                <button
                                    type="button"
                                    onClick={() => removeItem("qualities", quality)}
                                    className="text-white"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BesoinSkills;