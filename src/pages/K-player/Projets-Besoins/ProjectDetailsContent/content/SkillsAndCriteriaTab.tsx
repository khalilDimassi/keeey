import { FC, useEffect, useState } from "react";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import {
  OpportunitySectors,
  Sector,
  OpportunityCriteria,
  OpportunityRequirements
} from "../../types";
import axios, { AxiosHeaders } from "axios";
import { getAuthHeader } from "../../../../../utils/jwt";

interface SkillsAndCriteriasProps {
  sectors: Sector[];
  loading: boolean;
  error: string | null;
  initialFormData: {
    sectors: OpportunitySectors;
    criteria: OpportunityCriteria;
    requirements: OpportunityRequirements;
  };
  opportunity_id: string
}

const DEFAULT_FORM_DATA = {
  sectors: {
    selected_sectors: []
  },
  criteria: {
    contract_role: "FREELANCE",
    crit_start_date: "",
    crit_start_date_lastest: "",
    crit_duration: null,
    crit_duration_lastest: null,
    crit_target_rate: null,
    crit_max_rate: null,
    crit_location: "",
    crit_remote: false
  },
  requirements: {
    tools: [],
    authorizations: [],
    languages: [],
    qualities: []
  }
};

const SkillsAndCriterias: FC<SkillsAndCriteriasProps> = ({
  sectors,
  loading,
  error,
  initialFormData,
  opportunity_id
}) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(initialFormData || {})
  });
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [_submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingCriterias, setIsEditingCriterias] = useState(false);
  const [inputValues, setInputValues] = useState({
    tool: "",
    authorization: "",
    language: "",
    quality: "",
  });
  const [activeSector, setActiveSector] = useState<number | null>(null);

  const onFormDataChange = (
    section: 'sectors' | 'criteria' | 'requirements',
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    if (formData.sectors.selected_sectors && formData.sectors.selected_sectors.length > 0 && !activeSector) {
      setActiveSector(formData.sectors.selected_sectors[0].id);
    } else if (!formData.sectors.selected_sectors || formData.sectors.selected_sectors.length === 0) {
      setActiveSector(null);
    }
  }, [formData.sectors.selected_sectors]);

  const toggleSector = (sectorId: number) => {
    const isSelected = formData.sectors.selected_sectors.some(s => s.id === sectorId);

    if (isSelected) {
      const updatedSectors = formData.sectors.selected_sectors.filter(s => s.id !== sectorId);
      onFormDataChange("sectors", "selected_sectors", updatedSectors);

      if (activeSector === sectorId) {
        setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
      }
    } else if (formData.sectors.selected_sectors.length < 3) {
      const newSector = {
        id: sectorId,
        seniority: 1,
        jobs: [],
      };
      onFormDataChange(
        "sectors",
        "selected_sectors",
        [...formData.sectors.selected_sectors, newSector]
      );
      setActiveSector(sectorId);
    }
  };

  const handleSeniorityChange = (sectorId: number, value: number) => {
    const updatedSectors = formData.sectors.selected_sectors.map(sector =>
      sector.id === sectorId ? { ...sector, seniority: value } : sector
    );
    onFormDataChange("sectors", "selected_sectors", updatedSectors);
  };

  const toggleJob = (sectorId: number, jobId: number) => {
    const updatedSectors = formData.sectors.selected_sectors.map(sector => {
      if (sector.id !== sectorId) return sector;

      const jobIndex = sector.jobs.findIndex(j => j.id === jobId);

      if (jobIndex >= 0) {
        return {
          ...sector,
          jobs: sector.jobs.filter(j => j.id !== jobId),
        };
      } else {
        return {
          ...sector,
          jobs: [...sector.jobs, { id: jobId, skills: [] }],
        };
      }
    });

    onFormDataChange("sectors", "selected_sectors", updatedSectors);
  };

  const toggleSkill = (sectorId: number, jobId: number, skillId: number) => {
    const updatedSectors = formData.sectors.selected_sectors.map(sector => {
      if (sector.id !== sectorId) return sector;

      const updatedJobs = sector.jobs.map(job => {
        if (job.id !== jobId) return job;

        const skillIndex = job.skills.indexOf(skillId);

        return {
          ...job,
          skills: skillIndex >= 0
            ? job.skills.filter(id => id !== skillId)
            : [...job.skills, skillId],
        };
      });

      return { ...sector, jobs: updatedJobs };
    });

    onFormDataChange("sectors", "selected_sectors", updatedSectors);
  };

  const countSelectedSkillsForJob = (sectorId: number, jobId: number) => {
    const sector = formData.sectors.selected_sectors.find(s => s.id === sectorId);
    if (!sector) return 0;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.length : 0;
  };

  const isJobSelected = (sectorId: number, jobId: number) => {
    const sector = formData.sectors.selected_sectors.find(s => s.id === sectorId);
    return sector ? sector.jobs.some(j => j.id === jobId) : false;
  };

  const isSkillSelected = (sectorId: number, jobId: number, skillId: number) => {
    const sector = formData.sectors.selected_sectors.find(s => s.id === sectorId);
    if (!sector) return false;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.includes(skillId) : false;
  };

  const getSeniority = (sectorId: number) => {
    const sector = formData.sectors.selected_sectors.find(s => s.id === sectorId);
    return sector ? sector.seniority : 1;
  };

  // Requirements section handlers
  const handleInputChange = (field: keyof typeof inputValues, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field: keyof typeof inputValues, listKey: keyof OpportunityRequirements) => {
    const value = inputValues[field]?.trim();
    if (!value) return;

    const currentArray = Array.isArray(formData.requirements[listKey])
      ? formData.requirements[listKey]
      : [];

    if (currentArray.includes(value)) {
      return;
    }

    onFormDataChange("requirements", listKey, [...currentArray, value]);
    handleInputChange(field, "");
  };

  const removeItem = (listKey: keyof OpportunityRequirements, item: string) => {
    const currentArray = Array.isArray(formData.requirements[listKey])
      ? formData.requirements[listKey]
      : [];
    onFormDataChange("requirements", listKey, currentArray.filter(i => i !== item));
  };

  const handleSaveSkills = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}/v2`,
        { sectors: formData.sectors.selected_sectors },
        { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
      );

      setSubmissionStatus({
        success: true,
        message: 'Skills saved successfully!'
      });
      setIsEditingSkills(false);
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message: 'Failed to save skills data.'
      });
    } finally {
      setIsSubmitting(false);
      // Clear status message after a delay
      setTimeout(() => setSubmissionStatus({}), 3000);
    }
  };

  const handleSaveCriterias = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}/v2`,
        {
          ...formData.criteria,
          ...formData.requirements
        },
        { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
      );

      setSubmissionStatus({
        success: true,
        message: 'Criteria and requirements saved successfully!'
      });
      setIsEditingCriterias(false);
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message: 'Failed to save criteria data.'
      });
    } finally {
      setIsSubmitting(false);
      // Clear status message after a delay
      setTimeout(() => setSubmissionStatus({}), 3000);
    }
  };

  if (error) {
    return (
      <div className="w-full mx-auto grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Compétences</h2>
          <div className="text-center py-8 text-red-500">
            <p className="font-medium">Couldn't load component data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Critères</h2>
          <div className="text-center py-8 text-red-500">
            <p className="font-medium">Couldn't load component data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    const randomWidth = () => {
      const widths = ["w-16", "w-20", "w-24", "w-28", "w-32"];
      return widths[Math.floor(Math.random() * widths.length)];
    };

    return (
      <div className="w-full mx-auto grid grid-cols-2 gap-6 animate-pulse">
        {/* Skills loading skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Compétences</h2>

          <p className="text-black font-semibold mb-2">Secteur</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-10 ${randomWidth()} bg-gray-200 rounded-xl`}
              ></div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-24 h-8 bg-gray-200 rounded-md"></div>
            ))}
          </div>

          <div className="my-4">
            <div className="flex justify-between text-sm mb-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="relative w-full mb-2">
              <div className="w-full h-3 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-3 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 mb-2">Metier</p>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Criteria loading skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Critères</h2>

          <p className="text-gray-600 mb-2">Type de contrat</p>
          <div className="flex flex-wrap gap-4 mb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>

          <p className="text-gray-600 mb-2">Date de démarrage</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded-xl"></div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>

          <p className="text-gray-600 mb-2">Durée prévisionnelle</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded-xl"></div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>

          <p className="text-gray-600 mb-2">TJM ou salaire</p>
          <div className="flex gap-2 mb-4">
            <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto grid grid-cols-2 gap-6">
      {/* Skills Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compétences</h2>
          <Edit
            size={20}
            className="text-blue-800 cursor-pointer"
            onClick={() => setIsEditingSkills(!isEditingSkills)}
          />
        </div>

        {isEditingSkills ? (
          <div className="space-y-6">
            {/* Sector Selection */}
            <div>
              <p className="text-black font-semibold mb-1">Secteur <span className="text-gray-600 font-thin text-sm">(jusqu'à 3 secteurs)</span></p>
              <div className="flex flex-wrap gap-2 mb-8">
                {sectors.map((sector) => (
                  <button
                    key={sector.id}
                    type="button"
                    className={`
                      flex items-center px-3 py-2 border shadow rounded-xl space-x-2
                      ${formData.sectors.selected_sectors?.some(s => s.id === sector.id)
                        ? 'bg-[#215A96] text-white'
                        : 'border-black bg-gray-50 text-gray-700'
                      }
                      ${!formData.sectors.selected_sectors?.some(s => s.id === sector.id) &&
                        formData.sectors.selected_sectors?.length >= 3
                        ? 'opacity-50'
                        : ''
                      }
                    `}
                    onClick={() => toggleSector(sector.id)}
                    disabled={
                      !formData.sectors.selected_sectors?.some(s => s.id === sector.id) &&
                      formData.sectors.selected_sectors?.length >= 3
                    }
                  >
                    {sector.sector}{" "}
                    <span className="ml-2">
                      {formData.sectors.selected_sectors?.some(s => s.id === sector.id) ? "-" : "+"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected sectors display */}
            {formData.sectors.selected_sectors?.length > 0 && (
              <div className="flex justify-center mb-5">
                <div className="inline-flex border border-gray-300 rounded-[20px] overflow-hidden">
                  {formData.sectors.selected_sectors.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      className={`px-4 py-2 ${activeSector === sector.id
                        ? "bg-[#215A96] text-white"
                        : "bg-gray-50 text-gray-700"
                        } ${sector.id === formData.sectors.selected_sectors[0].id ? "rounded-l-[20px]" : ""} 
                        ${sector.id === formData.sectors.selected_sectors[formData.sectors.selected_sectors.length - 1].id ? "rounded-r-[20px]" : ""}`}
                      onClick={() => setActiveSector(sector.id)}
                    >
                      {sectors.find((s) => s.id === sector.id)?.sector}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seniority & Jobs */}
            {activeSector !== null && (
              <>
                {((activeSector) => {
                  const seniorityLevels = [
                    { level: 1, name: "Junior", description: "1 - 4 ans" },
                    { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
                    { level: 3, name: "Senior", description: "10 - 14 ans" },
                    { level: 4, name: "Lead", description: "15 - 19 ans" },
                    { level: 5, name: "Principal", description: "20+ ans" },
                  ];
                  const currentLevel = getSeniority(activeSector);
                  const currentSeniority = seniorityLevels.find(level => level.level === currentLevel);

                  return (
                    <div className="mb-5">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span className="font-medium">{currentSeniority?.name}</span>
                        <span>{currentSeniority?.description}</span>
                      </div>

                      <div
                        className="relative w-full h-8 mb-2 cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          const newValue = Math.min(5, Math.max(1, Math.round(percent * 5)));
                          if (newValue !== currentLevel) {
                            handleSeniorityChange(activeSector, newValue);
                          }
                        }}
                      >
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-xl transform -translate-y-1/2"></div>
                        <div
                          className="absolute top-1/2 left-0 h-2 bg-[#215A96] rounded-xl transform -translate-y-1/2"
                          style={{ width: `${(currentLevel - 1) * 25}%` }}
                        ></div>
                        <div
                          className="absolute top-1/2 w-5 h-5 bg-[#215A96] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md"
                          style={{ left: `${(currentLevel - 1) * 25}%` }}
                        ></div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={currentLevel}
                          onChange={(e) => handleSeniorityChange(activeSector, parseInt(e.target.value))}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        {seniorityLevels.map((level) => (
                          <span key={level.level}>{level.level}</span>
                        ))}
                      </div>
                    </div>
                  );
                })(activeSector)}
                <p className="text-gray-600 mb-1">Metier</p>
                {(() => {
                  const sector = sectors.find(s => s.id === activeSector);
                  if (!sector?.jobs) return null;

                  return (
                    <div className="space-y-2">
                      {sector.jobs.map(job => {
                        const selectedSkillCount = countSelectedSkillsForJob(activeSector, job.id);
                        const isSelected = isJobSelected(activeSector, job.id);
                        const hasSkills = !!(job.skills?.length);

                        return (
                          <div
                            key={job.id}
                            className="border rounded-xl overflow-hidden cursor-pointer"
                            onClick={() => toggleJob(activeSector, job.id)}
                          >
                            <div className={`flex items-center justify-between p-3 ${isSelected ? 'bg-blue-200' : 'bg-blue-50'}`}>
                              <div className="flex items-center">
                                <span className={`px-3 py-2 rounded-xl ${isSelected
                                  ? 'bg-[#215A96] text-white'
                                  : 'border border-gray-300 bg-white text-gray-700'
                                  }`}>
                                  {job.job}
                                </span>

                                {hasSkills && isSelected && (
                                  <div className="ml-3 flex flex-wrap space-x-1">
                                    {[...Array(Math.min(3, selectedSkillCount))].map((_, i) => (
                                      <div key={i} className="w-2 h-2 rounded-full bg-[#215A96]"></div>
                                    ))}
                                    {selectedSkillCount > 3 && (
                                      <span className="text-xs text-[#215A96] ml-1">+{selectedSkillCount - 3}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {hasSkills && isSelected && ((activeSector, jobId) => {
                              const sector = sectors.find(s => s.id === activeSector);
                              if (!sector) return null;

                              const job = sector.jobs?.find(j => j.id === jobId);
                              if (!job || !job.skills?.length) return null;

                              return (
                                <div className="ml-6 mt-2 mb-4">
                                  <div className="flex flex-wrap gap-2">
                                    {job.skills.map(skill => (
                                      <button
                                        key={skill.id}
                                        type="button"
                                        className={`px-3 py-1 text-sm border rounded-xl ${isSkillSelected(activeSector, jobId, skill.id)
                                          ? 'bg-[#215A96] text-white'
                                          : 'border-gray-300 bg-white text-gray-700'
                                          }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSkill(activeSector, jobId, skill.id);
                                        }}
                                      >
                                        {skill.skill}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })(activeSector, job.id)}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 rounded-xl"
                onClick={() => setIsEditingSkills(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-700 text-white rounded-xl"
                onClick={handleSaveSkills}
              >
                Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Read-only view for skills */}
            {formData.sectors.selected_sectors.length > 0 ? (
              <div className="space-y-4">

                {formData.sectors.selected_sectors.map(sector => {
                  const sectorData = sectors.find(s => s.id === sector.id);
                  return (
                    <div key={sector.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{sectorData?.sector}</h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Niveau:</span>
                          <span className="font-medium">
                            {["Junior", "Mid-Level", "Senior", "Lead", "Principal"][sector.seniority - 1]}
                          </span>
                        </div>
                      </div>

                      {sector.jobs.length > 0 && (
                        <div>
                          <p className="text-gray-600 mb-1">Métiers</p>
                          <div className="space-y-2">
                            {sector.jobs.map(job => {
                              const jobData = sectorData?.jobs?.find(j => j.id === job.id);
                              return (
                                <div key={job.id} className="pl-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-[#215A96] text-white px-3 py-1 rounded-xl">
                                      {jobData?.job}
                                    </span>
                                    {job.skills.length > 0 && (
                                      <span className="text-sm text-gray-500">
                                        ({job.skills.length} compétence{job.skills.length > 1 ? 's' : ''})
                                      </span>
                                    )}
                                  </div>

                                  {job.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pl-4">
                                      {job.skills.map(skillId => {
                                        const skill = jobData?.skills?.find(s => s.id === skillId);
                                        return (
                                          <span
                                            key={skillId}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                          >
                                            {skill?.skill}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Aucun secteur sélectionné</p>
            )}
          </>
        )}
      </div>

      {/* Criteria & Requirements Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Critères & Requirements</h2>
          <Edit
            size={20}
            className="text-blue-800 cursor-pointer"
            onClick={() => setIsEditingCriterias(!isEditingCriterias)}
          />
        </div>

        {isEditingCriterias ? (
          <div className="space-y-4">
            {/* Type de contrat */}
            <div>
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
                      checked={formData.criteria.contract_role === value}
                      onChange={() => onFormDataChange("criteria", "contract_role", value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Date de démarrage */}
            <div>
              <p className="text-gray-600 mb-2">Date de démarrage souhaitée</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full border p-2 rounded-xl"
                    value={formData.criteria.crit_start_date}
                    onChange={(e) => onFormDataChange("criteria", "crit_start_date", e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full border p-2 rounded-xl"
                    value={formData.criteria.crit_start_date_lastest}
                    onChange={(e) => onFormDataChange("criteria", "crit_start_date_lastest", e.target.value)}
                    placeholder="Au plus tard"
                  />
                </div>
              </div>
            </div>

            {/* Durée prévisionnelle */}
            <div>
              <p className="text-gray-600 mb-2">Durée prévisionnelle</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full border p-2 rounded-xl"
                    placeholder="jours"
                    value={formData.criteria.crit_duration}
                    onChange={(e) => {
                      const value = e.target.value;
                      onFormDataChange("criteria", "crit_duration", value === "" ? null : parseInt(value, 10));
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full border p-2 rounded-xl"
                    placeholder="Au plus tard"
                    value={formData.criteria.crit_duration_lastest}
                    onChange={(e) => {
                      const value = e.target.value;
                      onFormDataChange("criteria", "crit_duration_lastest", value === "" ? null : parseInt(value, 10));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* TJM ou salaire */}
            <div>
              <p className="text-gray-600 mb-2">TJM ou salaire cible</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="TJM ou salaire cible"
                  className="w-full border p-2 rounded-xl"
                  value={formData.criteria.crit_target_rate}
                  onChange={(e) => {
                    const value = e.target.value;
                    onFormDataChange("criteria", "crit_target_rate", value === "" ? null : parseInt(value, 10));
                  }}
                />
                <input
                  type="text"
                  placeholder="TJM ou salaire max"
                  className="w-full border p-2 rounded-xl"
                  value={formData.criteria.crit_max_rate}
                  onChange={(e) => {
                    const value = e.target.value;
                    onFormDataChange("criteria", "crit_max_rate", value === "" ? null : parseInt(value, 10));
                  }}
                />
              </div>
            </div>

            {/* Localisation */}
            <div>
              <p className="text-gray-600 mb-2">Localisation</p>
              <input
                className="w-full border p-2 rounded-xl mb-4"
                type="text"
                placeholder="Localisation"
                value={formData.criteria.crit_location}
                onChange={(e) => onFormDataChange("criteria", "crit_location", e.target.value)}
              />
            </div>

            {/* Télétravail */}
            <div>
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
                      checked={formData.criteria.crit_remote === value}
                      onChange={() => onFormDataChange("criteria", "crit_remote", value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Requirements Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600">Outils</p>
                <div className="flex items-center gap-1">
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
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.tools?.map((tool, index) => (
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
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">Habilitations</p>
                <div className="flex items-center gap-1">
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
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.authorizations?.map((auth, index) => (
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
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600">Langues</p>
                <div className="flex items-center gap-1">
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
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.languages?.map((lang, index) => (
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
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">Qualités Relationnelles</p>
                <div className="flex items-center gap-1">
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
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.qualities?.map((quality, index) => (
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
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 mr-2 bg-gray-200 rounded-xl"
                onClick={() => setIsEditingCriterias(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-700 text-white rounded-xl"
                onClick={handleSaveCriterias}
              >
                Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Read-only view for criteria */}
            <div>
              <p className="text-gray-600 mb-1">Type de contrat</p>
              <p className="text-gray-800">
                {formData.criteria.contract_role || "Non spécifié"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Date démarrage</p>
                <div className="flex gap-2">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                    {formData.criteria.crit_start_date || "Non spécifié"}
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                    {formData.criteria.crit_start_date_lastest || "Non spécifié"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Durée</p>
                <div className="flex gap-2">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                    {formData.criteria.crit_duration || "0"} jours
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                    {formData.criteria.crit_duration_lastest || "0"} jours
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">TJM/Salaire</p>
                <div className="flex gap-2">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                    {formData.criteria.crit_target_rate || "0"} €
                  </span>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                    {formData.criteria.crit_max_rate || "0"} €
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Localisation</p>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                  {formData.criteria.crit_location || "Non spécifié"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-1">Télétravail</p>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-xl">
                {formData.criteria.crit_remote ? "Oui" : "Non"}
              </span>
            </div>

            {/* Read-only view for requirements */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Outils</p>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.tools?.map((tool, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-xl">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Habilitations</p>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.authorizations?.map((auth, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-xl">
                      {auth}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Langues</p>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.languages?.map((lang, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-xl">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Qualités</p>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.qualities?.map((quality, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-xl">
                      {quality}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default SkillsAndCriterias;