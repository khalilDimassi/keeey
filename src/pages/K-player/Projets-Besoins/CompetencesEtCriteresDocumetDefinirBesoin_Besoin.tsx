import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import DocumentsDevinirBesoin from "./DocumentUploadModal";
import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";

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
  loading: boolean;
  error: string | null;
}

const CompetencesEtCriteresDocument: React.FC<CompetencesProps> = ({ sectors, loading, error }) => {
  // information generale
  const [title, setTitle] = useState<string>("");
  // TODO: const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [responseDate, setResponseDate] = useState<string>("");
  const [announceDate, setannounceDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [targetRate, setTargetRate] = useState<string>("");

  // Sectors & selectables
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const [seniority, setSeniority] = useState<{ [key: number]: number }>({});
  const [selectedJobs, setSelectedJobs] = useState<{ [key: number]: number[] }>({});

  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState<string>("");
  const [authorizations, setAuthorizations] = useState<string[]>([]);
  const [authorizationInput, setAuthorizationInput] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState<string>("");
  const [qualities, setQualities] = useState<string[]>([]);
  const [qualityInput, setQualityInput] = useState<string>("");

  // critaires
  const [contract_role, setcontract_role] = useState<string>("CDI");
  const [critStartDate, setCritStartDate] = useState<string>("");
  const [critStartDateLatest, setCritStartDateLatest] = useState<string>("");
  const [critDuration, setCritDuration] = useState<string>("");
  const [critDurationLatest, setCritDurationLatest] = useState<string>("");
  const [critTargetRate, setCritTargetRate] = useState<string>("");
  const [critMaxRate, setCritMaxRate] = useState<string>("");
  const [critLocation, setCritLocation] = useState<string>("");
  const [remoteWork, setRemoteWork] = useState<string>("Non");

  // TODO: docs

  // Submission
  const [submitStatus, setSubmitStatus] = useState<{ loading: boolean, error: string | null }>({ loading: false, error: null });

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


  const addItem = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (item.trim() !== "" && !list.includes(item)) {
      setList([...list, item]);
      setInput("");
    }
  };

  const removeItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((i) => i !== item));
  };

  // Prepare data for submission
  const prepareDataForSubmission = () => {
    const jobs = [];
    for (const sectorId of selectedSectors) {
      const jobsInSector = selectedJobs[sectorId] || [];
      for (const jobId of jobsInSector) {
        jobs.push({
          id: jobId,
          seniority: seniority[sectorId] || 1
        });
      }
    }

    // TODO: dynamic language level
    const langs = languages.map(lang => ({
      name: lang,
      level: 1
    }));

    return {
      title: title,
      // description: description,
      announce_at: announceDate,
      responded_at: responseDate,
      start_at: startDate,
      duration: parseInt(duration) || 0,
      rate: parseFloat(targetRate) || 0,
      opportunity_role: "REQUIREMENT",
      contract_role: contract_role,

      crit_start_date: critStartDate,
      crit_start_date_lastest: critStartDateLatest,
      crit_target_rate: parseFloat(critTargetRate) || 0,
      crit_max_rate: parseFloat(critMaxRate) || 0,
      crit_location: critLocation,
      crit_remote: remoteWork === "Oui",

      jobs: jobs,
      tools: tools,
      auths: authorizations,
      langs: langs,
      quals: qualities,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null });

    try {
      const data = prepareDataForSubmission();
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/v2`, data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      setSubmitStatus({ loading: false, error: null });
    } catch (error) {
      setSubmitStatus({ loading: false, error: "Failed to create opportunity" });
    }
  };

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

  const renderJobs = (sectorId: number) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (!sector) return null;
    return (
      <div className="flex flex-wrap gap-2 my-4">
        {sector.jobs.map(job => (
          <button
            type="button"
            key={job.id}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${selectedJobs[sectorId]?.includes(job.id) ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'
              }`}
            onClick={() => toggleJob(sectorId, job.id)}
          >
            {job.job} <span className="ml-1">{selectedJobs[sectorId]?.includes(job.id) ? '-' : '+'}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <>
        <div className="mb-8 mt-8">
          <div
            className="bg-white shadow-lg rounded-lg p-6"
            style={{
              boxShadow: "0 0 4px 1px #11355d69",
              borderRadius: "10px",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Informations generale</h2>
              {/* <Edit size={20} className="text-blue-800 cursor-pointer" /> */}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="Titre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date appelle d'offre</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  placeholder="Date appelle d'offre"
                  value={announceDate}
                  onChange={(e) => setannounceDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date démarrage</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  placeholder="Date démarrage"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date réponse</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  placeholder="Date réponse"
                  value={responseDate}
                  onChange={(e) => setResponseDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Durée prévisionnelle (jours)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  placeholder="Durée prévisionnelle"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">TJM cible</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  placeholder="TJM cible"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </>

      <div className="my-2 bg-gray-100 flex gap-6">
        <div
          className="bg-white p-6 rounded-lg shadow-md w-1/2"
          style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}
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
                    {selectedSectors.map((sectorId) => (
                      <button
                        type="button"
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
                        {sectors.find((s) => s.id === sectorId)?.sector}
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
                  type="button"
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
                      type="button"
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
                  value={authorizationInput}
                  onChange={(e) => setAuthorizationInput(e.target.value)}
                  placeholder="Ajouter une habilitation"
                  className="w-full border p-2 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => addItem(authorizationInput, authorizations, setAuthorizations, setAuthorizationInput)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PlusCircle size={28} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {authorizations.map((authorization, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-600 text-white rounded-md p-2"
                  >
                    <span>{authorization}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(authorization, authorizations, setAuthorizations)}
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
                      type="button"
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
                  type="button"
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
                      type="button"
                      onClick={() => removeItem(quality, qualities, setQualities)}
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
        <>
          {/* Right side: Critères and DocumentUploadModal */}
          <div className="flex flex-col w-1/2 gap-6">
            {/* Section Critères */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full" style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
              <h2 className="text-lg font-semibold mb-4">Critères</h2>

              {/* Type de contrat */}
              <p className="text-gray-600 mb-2">Type de contrat proposé</p>
              <div className="flex gap-4 mb-4">
                {["CDI", "FREELANCE", "CONSULTANT"].map((contract) => (
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
                  <input
                    type="date"
                    className="w-full border p-2 rounded-md"
                    value={critStartDate}
                    onChange={(e) => setCritStartDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full border p-2 rounded-md"
                    placeholder="Au plus tard"
                    value={critStartDateLatest}
                    onChange={(e) => setCritStartDateLatest(e.target.value)}
                  />
                </div>
              </div>

              {/* Durée prévisionnelle */}
              <p className="text-gray-600 mb-2">Durée prévisionnelle (jours)</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="TJM ou salaire cible"
                  className="w-full border p-2 rounded-md"
                  value={critDuration}
                  onChange={(e) => setCritDuration(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="TJM ou salaire max"
                  className="w-full border p-2 rounded-md"
                  value={critDurationLatest}
                  onChange={(e) => setCritDurationLatest(e.target.value)}
                />
              </div>

              {/* TJM ou salaire */}
              <p className="text-gray-600 mb-2">TJM ou salaire cible</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="TJM ou salaire cible"
                  className="w-full border p-2 rounded-md"
                  value={critTargetRate}
                  onChange={(e) => setCritTargetRate(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="TJM ou salaire max"
                  className="w-full border p-2 rounded-md"
                  value={critMaxRate}
                  onChange={(e) => setCritMaxRate(e.target.value)}
                />
              </div>

              {/* Localisation */}
              <p className="text-gray-600 mb-2">Localisation</p>
              <input
                type="text"
                placeholder="Localisation"
                className="w-full border p-2 rounded-md mb-4"
                value={critLocation}
                onChange={(e) => setCritLocation(e.target.value)}
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
            <div className="shadow-md w-full">
              <DocumentsDevinirBesoin />
            </div>
          </div>
        </>
      </div>

      {/* Submit button */}
      <div className="mt-6 flex justify-end">
        {submitStatus.error && (
          <div className="mr-4 text-red-500">
            {typeof submitStatus.error === 'string'
              ? submitStatus.error
              : JSON.stringify(submitStatus.error)}
          </div>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={submitStatus.loading}
        >
          {submitStatus.loading ? "Création en cours..." : "Créer le besoin"}
        </button>
      </div>
    </form>
  );
}

export default CompetencesEtCriteresDocument;