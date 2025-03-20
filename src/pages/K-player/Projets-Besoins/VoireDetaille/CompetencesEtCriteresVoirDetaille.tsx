import axios from "axios";
import { Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAuthHeader } from "../../../../utils/jwt";

interface Job {
  id: number;
  job: string;
}

interface Sector {
  id: number;
  sector: string;
  jobs: Job[];
}

interface OpportunitySkills {
  sectors: {
    id: number
    seniority: number
    jobs: number[]
  }[]
  languages: {
    id: number
    name: string
    level: number
  }[]
  authorizations: {
    id: number
    name: string
  }[]
  tools: {
    id: number
    name: string
  }[]
  qualities: {
    id: number
    name: string
  }[]
}

export interface OpportunityDetails {
  opportunity_id: number;
  user_id: string;
  title: string;
  description: string;
  rate: number;
  responded_at: string;
  start_at: string;
  announce_at: string;
  contract_role: string;
  opportunity_role: string;
  status: string;
  satisfaction: number;
  duration: number;
  crit_start_date: string;
  crit_start_date_lastest: string;
  crit_duration: number;
  crit_duration_latest: number;
  crit_target_rate: number;
  crit_max_rate: number;
  crit_location: string;
  crit_remote: boolean;
  created_at: string;
  updated_at: string;
}

type SectorSuggestionsResponse = Sector[];

interface SkillsAndCriteriasProps {
  opportunityData: OpportunityDetails | null;
  onSave: (data: Partial<OpportunityDetails>) => Promise<void>;
  isSaving: boolean;
}

const SkillsAndCriterias = ({ opportunityData, onSave, isSaving }: SkillsAndCriteriasProps) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSkills, setEditingSkills] = useState<boolean>(false);
  const [editingCriteria, setEditingCriteria] = useState<boolean>(false);

  const [skillsFormData, setSkillsFormData] = useState({
    // Skills
    selectedSectors: [] as number[],
    activeSector: null as number | null,
    seniority: {} as { [key: number]: number },
    selectedJobs: {} as { [key: number]: number[] },
    tools: [] as string[],
    authorizations: [] as string[],
    languages: [] as string[],
    qualities: [] as string[],
  });

  const [criteriaFormData, setCriteriaFormData] = useState({
    // Criteria
    contract_role: "CDI",
    critStartDate: "",
    critStartDateLatest: "",
    critDuration: 0,
    critDurationLatest: 0,
    critTargetRate: 0,
    critMaxRate: 0,
    critLocation: "",
    remoteWork: false,
  });

  const [newItem, setNewItem] = useState({
    tools: "",
    authorizations: "",
    languages: "",
    qualities: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<SectorSuggestionsResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
        );
        setSectors(response.data);
      } catch (err) {
        setError('Failed to fetch sectors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (opportunityData) {
      const newCriteriaFormData = {
        contract_role: opportunityData.contract_role || '',
        critStartDate: opportunityData.crit_start_date || '',
        critStartDateLatest: opportunityData.crit_start_date_lastest || '',
        critDuration: opportunityData.crit_duration || 0,
        critDurationLatest: opportunityData.crit_duration_latest || 0,
        critTargetRate: opportunityData.crit_target_rate || 0,
        critMaxRate: opportunityData.crit_max_rate || 0,
        critLocation: opportunityData.crit_location || '',
        remoteWork: opportunityData.crit_remote || false,
      };
      setCriteriaFormData(newCriteriaFormData);

      (async () => {
        try {
          setLoading(true);
          const response = await axios.get<OpportunitySkills>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityData.opportunity_id}/skills`
          );

          // Transform API response to match the form data structure
          const apiData = response.data ?? {};

          const selectedSectors: number[] = [];
          const seniority: { [key: number]: number } = {};
          const selectedJobs: { [key: number]: number[] } = {};

          apiData.sectors?.forEach(sector => {
            selectedSectors.push(sector.id);
            seniority[sector.id] = sector.seniority;
            selectedJobs[sector.id] = sector.jobs;
          }) ?? [];

          const tools = apiData.tools?.map(tool => tool.name) ?? [];
          const authorizations = apiData.authorizations?.map(auth => auth.name) ?? [];
          const languages = apiData.languages?.map(lang => lang.name) ?? [];
          const qualities = apiData.qualities?.map(quality => quality.name) ?? [];

          setSkillsFormData({
            selectedSectors,
            activeSector: selectedSectors.length > 0 ? selectedSectors[0] : null,
            seniority,
            selectedJobs,
            tools,
            authorizations,
            languages,
            qualities
          });

        } catch (err) {
          setError('Failed to fetch skills data. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [opportunityData]);

  // Handler for updating any field in formData
  const updateSkillsFormData = (_section: string, field: string, value: any) => {
    setSkillsFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Special handlers for more complex updates
  const toggleSector = (sectorId: number) => {
    setSkillsFormData(prev => {
      if (prev.selectedSectors.includes(sectorId)) {
        const updatedSectors = prev.selectedSectors.filter(id => id !== sectorId);
        const updatedSeniority = { ...prev.seniority };
        delete updatedSeniority[sectorId];
        const updatedJobs = { ...prev.selectedJobs };
        delete updatedJobs[sectorId];

        return {
          ...prev,
          selectedSectors: updatedSectors,
          seniority: updatedSeniority,
          selectedJobs: updatedJobs,
          activeSector: prev.activeSector === sectorId
            ? (updatedSectors.length > 0 ? updatedSectors[0] : null)
            : prev.activeSector
        };
      } else if (prev.selectedSectors.length < 3) {
        return {
          ...prev,
          selectedSectors: [...prev.selectedSectors, sectorId],
          seniority: { ...prev.seniority, [sectorId]: 1 },
          selectedJobs: { ...prev.selectedJobs, [sectorId]: [] },
          activeSector: sectorId
        };
      }
      return prev;
    });
  };

  const handleSeniorityChange = (sectorId: number, value: number) => {
    setSkillsFormData(prev => ({
      ...prev,
      seniority: { ...prev.seniority, [sectorId]: value }
    }));
  };

  const toggleJob = (sectorId: number, jobId: number) => {
    setSkillsFormData(prev => {
      const jobs = prev.selectedJobs[sectorId] || [];
      const updatedJobs = jobs.includes(jobId)
        ? jobs.filter(id => id !== jobId)
        : [...jobs, jobId];

      return {
        ...prev,
        selectedJobs: { ...prev.selectedJobs, [sectorId]: updatedJobs }
      };
    });
  };

  // List management (tools, authorizations, languages, qualities)
  const addItem = (listName: "tools" | "authorizations" | "languages" | "qualities", item: string) => {
    if (item.trim() !== "" && !skillsFormData[listName].includes(item)) {
      setSkillsFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], item]
      }));
      setNewItem(prev => ({
        ...prev,
        [listName]: ""
      }));
    }
  };

  const removeItem = (listName: "tools" | "authorizations" | "languages" | "qualities", item: string) => {
    setSkillsFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(i => i !== item)
    }));
  };

  const updateCriteriaFormData = (_section: string, field: string, value: any) => {
    setCriteriaFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Prepare criteria data for submission
  const prepareCriteriaForSubmission = (): Partial<OpportunityDetails> => {
    return {
      contract_role: criteriaFormData.contract_role,
      crit_start_date: criteriaFormData.critStartDate,
      crit_start_date_lastest: criteriaFormData.critStartDateLatest,
      crit_duration: criteriaFormData.critDuration,
      crit_duration_latest: criteriaFormData.critDurationLatest,
      crit_target_rate: criteriaFormData.critTargetRate,
      crit_max_rate: criteriaFormData.critMaxRate,
      crit_location: criteriaFormData.critLocation,
      crit_remote: criteriaFormData.remoteWork,
    };
  };

  // Separate handler for updating criteria using the props onSave
  const handleSaveCriteria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      const criteriaData = prepareCriteriaForSubmission();
      await onSave(criteriaData);
      setEditingCriteria(false);
    } catch (error) {
      console.error("Failed to update criteria:", error);
    }
  };

  // Prepare skills data for submission 
  const prepareSkillsForSubmission = () => {
    const jobs = [];
    for (const sectorId of skillsFormData.selectedSectors) {
      const jobsInSector = skillsFormData.selectedJobs[sectorId] || [];
      for (const jobId of jobsInSector) {
        jobs.push({
          id: jobId,
          seniority: skillsFormData.seniority[sectorId] || 1
        });
      }
    }

    const langs = skillsFormData.languages.map(lang => ({
      name: lang,
      level: 1
    }));

    return {
      jobs: jobs,
      tools: skillsFormData.tools,
      auths: skillsFormData.authorizations,
      langs: langs,
      quals: skillsFormData.qualities,
    };
  };

  // Handler for updating skills
  const handleSaveSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      const skillsData = prepareSkillsForSubmission();

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityData?.opportunity_id}/skills`,
        skillsData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      setEditingSkills(false);
    } catch (error) {
      console.error("Failed to update skills:", error);
    }
  };

  // Get sector name by ID
  const getSectorName = (sectorId: number | null) => {
    if (!sectorId) return "";
    const sector = sectors.find(s => s.id === sectorId);
    return sector ? sector.sector : "";
  };

  // Get jobs for active sector
  const getJobsForActiveSector = () => {
    if (!skillsFormData.activeSector) return [];
    const sector = sectors.find(s => s.id === skillsFormData.activeSector);
    return sector ? sector.jobs : [];
  };

  // Get selected job names for display
  const getSelectedJobNames = () => {
    const result = [];
    for (const sectorId of skillsFormData.selectedSectors) {
      const sector = sectors.find(s => s.id === sectorId);
      if (!sector) continue;

      const jobIds = skillsFormData.selectedJobs[sectorId] || [];
      for (const jobId of jobIds) {
        const job = sector.jobs.find(j => j.id === jobId);
        if (job) result.push(job.job);
      }
    }
    return result;
  };

  // Get seniority level text
  const getSeniorityText = (level: number) => {
    switch (level) {
      case 1: return "Junior";
      case 2: return "Mid-Level";
      case 3: return "Senior";
      case 4: return "Lead";
      case 5: return "Principal";
      default: return "Junior";
    }
  };

  // Get active sector seniority
  const getActiveSectorSeniority = () => {
    if (!skillsFormData.activeSector) return 1;
    return skillsFormData.seniority[skillsFormData.activeSector] || 1;
  };

  return (
    <div className="w-full mx-auto grid grid-cols-2 gap-6">
      {/* Compétences Card */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compétences</h2>
          <Edit
            size={20}
            className="text-blue-800 cursor-pointer"
            onClick={() => setEditingSkills(!editingSkills)}
          />
        </div>

        {editingSkills ? (
          <form onSubmit={handleSaveSkills} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Secteur</h3>
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <button
                    key={sector.id}
                    type="button"
                    className={`px-3 py-1 rounded-xl text-sm ${skillsFormData.selectedSectors.includes(sector.id)
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-700"
                      }`}
                    onClick={() => toggleSector(sector.id)}
                  >
                    {sector.sector}
                  </button>
                ))}
              </div>
            </div>

            {skillsFormData.selectedSectors.length > 0 && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm text-gray-600">Secteur actif</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsFormData.selectedSectors.map(sectorId => (
                      <button
                        key={sectorId}
                        type="button"
                        className={`px-3 py-1 rounded-xl text-sm ${skillsFormData.activeSector === sectorId
                          ? "bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-700"
                          }`}
                        onClick={() => updateSkillsFormData("skills", "activeSector", sectorId)}
                      >
                        {getSectorName(sectorId)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm text-gray-600">Métier</h3>
                  <div className="flex flex-wrap gap-2">
                    {getJobsForActiveSector().map(job => (
                      <button
                        key={job.id}
                        type="button"
                        className={`px-3 py-1 rounded-xl text-sm ${skillsFormData.selectedJobs[skillsFormData.activeSector!]?.includes(job.id)
                          ? "bg-blue-700 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                        onClick={() => toggleJob(skillsFormData.activeSector!, job.id)}
                      >
                        {job.job}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-600">Niveau</h3>
                  <div className="flex items-center">
                    <input
                      type="range"
                      className="w-full"
                      min="1"
                      max="4"
                      value={getActiveSectorSeniority()}
                      onChange={(e) => handleSeniorityChange(
                        skillsFormData.activeSector!,
                        parseInt(e.target.value)
                      )}
                    />
                    <span className="ml-2 text-gray-700">
                      {getSeniorityText(getActiveSectorSeniority())}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Outils / habilitations</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <input
                      type="text"
                      className="w-full border rounded-l-xl p-2"
                      placeholder="Ajouter un outil"
                      value={newItem.tools}
                      onChange={(e) => setNewItem({ ...newItem, tools: e.target.value })}
                    />
                    <button
                      type="button"
                      className="bg-blue-700 text-white px-2 rounded-r-xl"
                      onClick={() => addItem("tools", newItem.tools)}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skillsFormData.tools.map(tool => (
                      <span key={tool} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded flex items-center">
                        {tool}
                        <button
                          type="button"
                          className="ml-1 text-red-500"
                          onClick={() => removeItem("tools", tool)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Qualités Relationnelles</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <input
                      type="text"
                      className="w-full border rounded-l-xl p-2"
                      placeholder="Ajouter une qualité"
                      value={newItem.qualities}
                      onChange={(e) => setNewItem({ ...newItem, qualities: e.target.value })}
                    />
                    <button
                      type="button"
                      className="bg-blue-700 text-white px-2 rounded-r-xl"
                      onClick={() => addItem("qualities", newItem.qualities)}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {skillsFormData.qualities.map(quality => (
                      <span key={quality} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded flex items-center">
                        {quality}
                        <button
                          type="button"
                          className="ml-1 text-red-500"
                          onClick={() => removeItem("qualities", quality)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Langue</h3>
              <div className="space-y-2">
                <div className="flex">
                  <input
                    type="text"
                    className="w-full border rounded-l-xl p-2"
                    placeholder="Ajouter une langue"
                    value={newItem.languages}
                    onChange={(e) => setNewItem({ ...newItem, languages: e.target.value })}
                  />
                  <button
                    type="button"
                    className="bg-blue-700 text-white px-2 rounded-r-xl"
                    onClick={() => addItem("languages", newItem.languages)}
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillsFormData.languages.map(language => (
                    <span key={language} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded flex items-center">
                      {language}
                      <button
                        type="button"
                        className="ml-1 text-red-500"
                        onClick={() => removeItem("languages", language)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 rounded-xl"
                onClick={() => setEditingSkills(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 text-white rounded-xl"
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Secteur</h3>
              <div className="border p-2 rounded-xl text-gray-700">
                ✔ {skillsFormData.selectedSectors.map(id => getSectorName(id)).join(", ") || "Aucun secteur sélectionné"}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Métier</h3>
              <div className="flex flex-wrap gap-2">
                {getSelectedJobNames().map(job => (
                  <div key={job} className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: "#215A96", borderRadius: "10px" }}>
                    {job}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-600">Niveau</h3>
              <div className="flex items-center">
                <input type="range" className="w-full" value={getActiveSectorSeniority()} readOnly />
                <span className="ml-2 text-gray-700">{getSeniorityText(getActiveSectorSeniority())}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Outils / habilitations</h3>
                <div className="flex flex-wrap gap-1">
                  {skillsFormData.tools.map(tool => (
                    <span key={tool} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Qualités Relationnelles</h3>
                <div className="flex flex-wrap gap-1">
                  {skillsFormData.qualities.map(quality => (
                    <span key={quality} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                      {quality}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Langue</h3>
              <div className="flex flex-wrap gap-2">
                {skillsFormData.languages.map(language => (
                  <span key={language} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Critères Card */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Critères</h2>
          <Edit
            size={20}
            className="text-blue-800 cursor-pointer"
            onClick={() => setEditingCriteria(!editingCriteria)}
          />
        </div>

        {editingCriteria ? (
          <form onSubmit={handleSaveCriteria} className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-600">Type de contrat proposé</h3>
              <select
                className="w-full border rounded-xl p-2 mt-1"
                value={criteriaFormData.contract_role}
                onChange={(e) => updateCriteriaFormData("criteria", "contract_role", e.target.value)}
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="CDI-C">CDI-C</option>
                <option value="FREELANCE">Freelance</option>
                <option value="PORTAGE">Portage</option>
                <option value="CONSULTANT">Consultant</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Date démarrage souhaité</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    className="border rounded-xl p-2 w-full"
                    value={criteriaFormData.critStartDate}
                    onChange={(e) => updateCriteriaFormData("criteria", "critStartDate", e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="date"
                    className="border rounded-xl p-2 w-full"
                    value={criteriaFormData.critStartDateLatest}
                    onChange={(e) => updateCriteriaFormData("criteria", "critStartDateLatest", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Durée prévisionnelle (jours)</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="border rounded-xl p-2 w-full"
                    value={criteriaFormData.critDuration}
                    onChange={(e) => updateCriteriaFormData("criteria", "critDuration", parseInt(e.target.value))}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="border rounded-xl p-2 w-full"
                    value={criteriaFormData.critDurationLatest}
                    onChange={(e) => updateCriteriaFormData("criteria", "critDurationLatest", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">TJM ou salaire cible / Max</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="border rounded-xl p-2 w-full"
                    value={criteriaFormData.critTargetRate}
                    onChange={(e) => updateCriteriaFormData("criteria", "critTargetRate", parseInt(e.target.value))}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="border rounded-xl p-2 w-full"
                    value={criteriaFormData.critMaxRate}
                    onChange={(e) => updateCriteriaFormData("criteria", "critMaxRate", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Localisation</h3>
                <input
                  type="text"
                  className="border rounded-xl p-2 w-full"
                  value={criteriaFormData.critLocation}
                  onChange={(e) => updateCriteriaFormData("criteria", "critLocation", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Télétravail</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remoteWork"
                  checked={criteriaFormData.remoteWork}
                  onChange={(e) => updateCriteriaFormData("criteria", "remoteWork", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="remoteWork">Disponible en télétravail</label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 rounded-xl"
                onClick={() => setEditingCriteria(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 text-white rounded-xl"
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-600">Type de contrat proposé</h3>
              <div className="text-gray-700">✔ {criteriaFormData.contract_role}</div>
            </div>

            <div className="grid grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Date démarrage souhaité</h3>
                <div className="space-x-4">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {criteriaFormData.critStartDate || 'Non défini'}
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {criteriaFormData.critStartDateLatest || 'Non défini'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Durée prévisionnelle</h3>
                <div className="space-x-4">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {criteriaFormData.critDuration || 0} jours
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {criteriaFormData.critDurationLatest || 0} jours
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">TJM ou salaire cible / Max</h3>
                <div className="space-x-4">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {criteriaFormData.critTargetRate || 0} €
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                    {criteriaFormData.critMaxRate || 0} €
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Localisation</h3>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded">
                  {criteriaFormData.critLocation || 'Non défini'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-600">Télétravail</h3>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded">
                {criteriaFormData.remoteWork ? 'Oui' : 'Non'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsAndCriterias;