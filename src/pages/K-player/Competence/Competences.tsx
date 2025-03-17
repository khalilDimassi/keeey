import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

export interface Job {
  id: number;
  job: string;
}

export interface Sector {
  id: number;
  sector: string;
  jobs: Job[];
}

interface CompetencesProps {
  sectors: Sector[];
}

const Competences: React.FC<CompetencesProps> = ({ sectors }) => {
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const [seniority, setSeniority] = useState<{ [key: number]: number }>({});
  const [selectedJobs, setSelectedJobs] = useState<{ [key: number]: number[] }>({});

  const toggleSector = (sectorId: number) => {
    if (selectedSectors.includes(sectorId)) {
      setSelectedSectors(selectedSectors.filter(id => id !== sectorId));
      setSeniority(prev => {
        const updated = { ...prev };
        delete updated[sectorId];
        return updated;
      });
      setSelectedJobs(prev => {
        const updated = { ...prev };
        delete updated[sectorId];
        return updated;
      });
      if (activeSector === sectorId) {
        // Set the next available sector as active or null if none left
        const remainingSectors = selectedSectors.filter(id => id !== sectorId);
        setActiveSector(remainingSectors.length > 0 ? remainingSectors[0] : null);
      }
    } else if (selectedSectors.length < 3) {
      setSelectedSectors([...selectedSectors, sectorId]);
      setSeniority(prev => ({ ...prev, [sectorId]: 1 }));
      setSelectedJobs(prev => ({ ...prev, [sectorId]: [] }));
      setActiveSector(sectorId);
    }
  };

  const handleSeniorityChange = (sectorId: number, value: number) => {
    setSeniority(prev => ({ ...prev, [sectorId]: value }));
  };

  const toggleJob = (sectorId: number, jobId: number) => {
    setSelectedJobs(prev => {
      const jobs = prev[sectorId] || [];
      if (jobs.includes(jobId)) {
        return { ...prev, [sectorId]: jobs.filter(id => id !== jobId) };
      } else {
        return { ...prev, [sectorId]: [...jobs, jobId] };
      }
    });
  };

  const [tools, setTools] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [qualities, setQualities] = useState<string[]>([]);

  const [toolInput, setToolInput] = useState<string>("");
  const [certificationInput, setCertificationInput] = useState<string>("");
  const [languageInput, setLanguageInput] = useState<string>("");
  const [qualityInput, setQualityInput] = useState<string>("");

  // Add item to a list
  const addItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
    if (item.trim() !== "" && !list.includes(item)) {
      setList([...list, item]);
      setInput("");
    }
  };

  // Remove item from a list
  const removeItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((i) => i !== item));
  };

  // Collect and return user selections
  // const collectSelections = () => {
  //   const selections = selectedSectors.map(sectorId => ({
  //     id: sectorId,
  //     seniority: seniority[sectorId],
  //     jobs: selectedJobs[sectorId] || [],
  //   }));
  // //  onSelectionChange(selections);
  // };

  // Render seniority slider
  const renderSenioritySlider = (sectorId: number) => {
    const seniorityLevels = [
      { level: 1, name: "Junior", description: "1 - 4 ans" },
      { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
      { level: 3, name: "Senior", description: "10 - 14 ans" },
      { level: 4, name: "Lead", description: "15 - 19 ans" },
      { level: 5, name: "Principal", description: "20+ ans" },
    ];
    const currentLevel = seniority[sectorId] || 1;
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

  // Render jobs list
  const renderJobs = (sectorId: number) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (!sector) return null;
    return (
      <div className="flex flex-wrap gap-2 my-4">
        {sector.jobs.map(job => (
          <button
            key={job.id}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${selectedJobs[sectorId]?.includes(job.id) ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'
              }`}
            onClick={() => toggleJob(sectorId, job.id)}
          >
            {job.job} <span className="ml-1">+</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className="bg-white p-6 rounded-lg shadow-md w-1/2"
        style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
      >
        <h2 className="text-lg font-semibold mb-4">Compétences</h2>
        {/* Secteur */}
        <p className="text-black font-semibold mb-2">Secteur</p>
        <div className="grid grid-cols-3 gap-2 mb-4" style={{ width: "auto" }}>
          {sectors.map(sector => (
            <button
              key={sector.id}
              className={`
              px-4 py-2 rounded-full text-sm flex items-center 
              ${selectedSectors.includes(sector.id) ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}
            `}
              onClick={() => toggleSector(sector.id)}
              disabled={!selectedSectors.includes(sector.id) && selectedSectors.length >= 3}
            >
              {sector.sector} <span className="ml-1">{selectedSectors.includes(sector.id) ? '-' : '+'}</span>
            </button>
          ))}
        </div>

        {/* Selected sectors display */}
        {selectedSectors.length > 0 && (
          <div className="flex justify-center items-center">
            <div
              className="inline-flex border border-gray-300 rounded-md overflow-hidden mb-6"
              style={{ borderRadius: "20px" }}
            >
              {selectedSectors.map(sectorId => (
                <button
                  key={sectorId}
                  className={`px-4 py-2 ${activeSector === sectorId
                    ? "bg-blue-600 text-white"
                    : "bg-white border-r border-gray-300"
                    }`}
                  onClick={() => setActiveSector(sectorId)}
                >
                  {activeSector === sectorId && (
                    <span className="inline-flex items-center justify-center w-4 h-4 bg-blue-600 text-white rounded-full mr-1 text-xs">
                      ✓
                    </span>
                  )}
                  {sectors.find(s => s.id === sectorId)?.sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Jobs */}
        {activeSector !== null && (
          <div className="my-6">
            {renderSenioritySlider(activeSector)}
            <br></br>
            <p className="text-gray-600 mb-2">Metier</p>
            {renderJobs(activeSector)}
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
            onClick={() => addItem(toolInput, tools, setTools, setToolInput)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={28} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-md p-2"
            >
              <span>{tool}</span>
              <button
                onClick={() => removeItem(tool, tools, setTools)}
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
            value={certificationInput}
            onChange={(e) => setCertificationInput(e.target.value)}
            placeholder="Ajouter une habilitation"
            className="w-full border p-2 rounded-md"
          />
          <button
            onClick={() => addItem(certificationInput, certifications, setCertifications, setCertificationInput)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={28} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {certifications.map((certification, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-md p-2"
            >
              <span>{certification}</span>
              <button
                onClick={() => removeItem(certification, certifications, setCertifications)}
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
            onClick={() => addItem(languageInput, languages, setLanguages, setLanguageInput)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={28} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-md p-2"
            >
              <span>{lang}</span>
              <button
                onClick={() => removeItem(lang, languages, setLanguages)}
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
            onClick={() => addItem(qualityInput, qualities, setQualities, setQualityInput)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle size={28} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {qualities.map((quality, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-md p-2"
            >
              <span>{quality}</span>
              <button
                onClick={() => removeItem(quality, qualities, setQualities)}
                className="text-white"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Competences;