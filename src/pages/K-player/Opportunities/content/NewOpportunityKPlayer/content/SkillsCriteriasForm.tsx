import { Fragment, useState } from "react";
import { Job, OpportunityCriteria, OpportunityRequirements, OpportunitySectors, Sector } from "../../OpportunityDetailsKPlayer/types"
import { ChevronLeft, ChevronRight, PlusCircle, Trash2 } from "lucide-react";
import { JobButton, JobButtonColorScheme } from "../../../../../components/JobButton";

interface SkillsCriteriasFormProps {
  onChange: (data: OpportunitySectors | OpportunityCriteria | OpportunityRequirements) => void;
  sectors: Sector[];
  skillsData: OpportunitySectors;
  criteriasData: OpportunityCriteria;
  requirementsData: OpportunityRequirements;
  mainColor: string;
}

const SkillsCriteriasForm = ({ onChange, sectors, skillsData, criteriasData, requirementsData, mainColor }: SkillsCriteriasFormProps) => {
  const [formData, setFormData] = useState({
    sectors: {
      selected_sectors: skillsData.selected_sectors
    },
    criteria: {
      contract_roles: criteriasData.contract_roles,
      opportunity_role: criteriasData.opportunity_role,
      crit_start_date: criteriasData.crit_start_date,
      crit_start_date_lastest: criteriasData.crit_start_date_lastest,
      crit_duration: criteriasData.crit_duration,
      crit_duration_lastest: criteriasData.crit_duration_lastest,
      crit_target_rate: criteriasData.crit_target_rate,
      crit_max_rate: criteriasData.crit_max_rate,
      crit_location: criteriasData.crit_location,
      crit_remote: criteriasData.crit_remote,
    },
    requirements: {
      tools: requirementsData.tools,
      authorizations: requirementsData.authorizations,
      languages: requirementsData.languages,
      qualities: requirementsData.qualities
    },
  })
  const [inputValues, setInputValues] = useState({
    tool: "",
    authorization: "",
    language: "",
    quality: "",
  });

  const [activeSector, setActiveSector] = useState<number | null>(formData.sectors.selected_sectors.length > 0 ? formData.sectors.selected_sectors[0].id : null);
  const [sectorToDeactivate, setSectorToDeactivate] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [hoveredToggleButton, setHoveredToggleButton] = useState<number | null>(null);

  const onFormDataChange = (section: 'sectors' | 'criteria' | 'requirements', field: string, value: any) => {
    const newFormData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    };
    setFormData(newFormData);
    onChange(newFormData as any);
  };

  const toggleSector = (sectorId: number) => {
    const isSelected = formData.sectors.selected_sectors.some(s => s.id === sectorId);
    if (isSelected) {
      const sector = formData.sectors.selected_sectors.find(s => s.id === sectorId);
      if (sector && (sector.seniority > 1 || sector.jobs.length > 0)) {
        setSectorToDeactivate(sectorId);
      } else {
        removeSector(sectorId);
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

  const removeSector = (sectorId: number) => {
    const updatedSectors = formData.sectors.selected_sectors.filter(s => s.id !== sectorId);
    onFormDataChange("sectors", "selected_sectors", updatedSectors);
    if (activeSector === sectorId) {
      setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
    }
  };

  const confirmDeactivation = (confirm: boolean) => {
    if (confirm && sectorToDeactivate !== null) {
      removeSector(sectorToDeactivate);
    }
    setSectorToDeactivate(null);
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

  return (
    <div className="w-full p-6 grid grid-cols-2 gap-6">
      {/* Skills Section */}
      <div className="bg-white rounded-xl p-6 hover:shadow-xl">
        <h2 className="text-xl font-semibold">Compétences</h2>
        <p className="text-black font-semibold mb-1">Secteur <span className="text-gray-600 font-thin text-sm">(jusqu'à 3 secteurs)</span></p>
        {/* Sector Selection */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              type="button"
              className={`flex items-center px-3 py-2 border shadow rounded-xl space-x-2 whitespace-nowrap flex-grow-0 flex-shrink-0
                  ${formData.sectors.selected_sectors?.some(s => s.id === sector.id)
                  ? `bg-[${mainColor}] text-white border-[${mainColor}]`
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
              {sector.Name}{" "}
              <span className="ml-2">
                {formData.sectors.selected_sectors?.some(s => s.id === sector.id) ? "-" : "+"}
              </span>
            </button>
          ))}
          {/* Add invisible filler items to prevent sparse last row */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`sector-filler-${i}`} className="flex-grow h-0" />
          ))}
        </div>
        {/* Selected sectors display */}
        {formData.sectors.selected_sectors && formData.sectors.selected_sectors.length > 0 && (
          <div className="flex flex-row justify-center items-stretch overflow-hidden mb-6">
            {formData.sectors.selected_sectors.map((sector, index) => (
              <button
                key={sector.id}
                type="button"
                className={`
                  px-4 py-2 
                  border border-gray-300
                  ${index === 0 ? 'rounded-l-full' : 'border-l-0'} 
                  ${index === formData.sectors.selected_sectors.length - 1 ? 'rounded-r-full' : ''}
                  ${activeSector === sector.id
                    ? `bg-[${mainColor}] text-white border-[${mainColor}]`
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }
                `}
                onClick={() => {
                  setActiveSector(sector.id)
                  setExpandedJob(null)
                }}
              >
                {sectors.find((s) => s.id === sector.id)?.Name}
              </button>
            ))}
          </div>
        )}
        {/* Seniority & Jobs */}
        {activeSector !== null && (
          <>
            {((activeSector) => {
              const seniorityLevels = [
                { level: 1, name: "Junior" },
                { level: 2, name: "Mid-Level" },
                { level: 3, name: "Senior" },
                { level: 4, name: "Chef" },
                { level: 5, name: "Principal" },
              ];

              const getDisplayLevel = (points: number) => {
                if (points <= 4) return 1;
                if (points <= 9) return 2;
                if (points <= 14) return 3;
                if (points <= 19) return 4;
                return 5;
              };

              const currentPoints = getSeniority(activeSector);
              const currentDisplayLevel = getDisplayLevel(currentPoints);
              const currentSeniority = seniorityLevels.find(level => level.level === currentDisplayLevel);

              const handlePointsChange = (newPoints: number) => {
                const clamped = Math.min(21, Math.max(0, newPoints));
                handleSeniorityChange(activeSector, clamped);
              };

              return (
                <div className="my-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePointsChange(currentPoints - 1)}
                        disabled={currentPoints <= 0}
                        className={`p-1 text-gray-500 hover:text-[${mainColor}] disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={5} />
                      </button>
                      <span className="font-medium">{currentSeniority?.name}</span>
                      <button
                        onClick={() => handlePointsChange(currentPoints + 1)}
                        disabled={currentPoints >= 21}
                        className={`p-1 text-gray-500 hover:text-[${mainColor}] disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={5} />
                      </button>
                    </div>
                    <span>{(currentPoints > 20) ? "20+" : currentPoints} ans</span>
                  </div>

                  <div
                    className="relative w-full h-8 mb-2 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      const newValue = Math.min(21, Math.max(0, Math.round(percent * 21)));
                      handlePointsChange(newValue);
                    }}
                  >
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-xl transform -translate-y-1/2"></div>
                    <div
                      className={`absolute top-1/2 left-0 h-2 bg-[${mainColor}] rounded-xl transform -translate-y-1/2`}
                      style={{ width: `${(currentPoints / 21) * 100}%` }}
                    ></div>
                    <div
                      className={`absolute top-1/2 w-5 h-5 bg-[${mainColor}] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md transition-all duration-100`}
                      style={{ left: `${(currentPoints / 21) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="21"
                      value={currentPoints}
                      onChange={(e) => handlePointsChange(parseInt(e.target.value))}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    {seniorityLevels.map((level) => (
                      <span
                        key={level.level}
                        className={currentDisplayLevel === level.level ? `font-bold text-[${mainColor}]` : ""}
                      >
                        {level.level}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })(activeSector)}

            <div className="mb-6" />
            <div className="text-lg font-semibold mb-2 text-gray-800">Metier</div>
            {(() => {
              const sector = sectors.find(s => s.id === activeSector);
              if (!sector?.jobs) return null;

              return (
                <div className="my-4">
                  {/* Job buttons in flex wrap */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sector.jobs.map(job => {
                      const handleMainClick = (job: Job) => {
                        setExpandedJob(expandedJob === job.id ? null : job.id);
                      };

                      const handleToggleClick = (sector: number, jobId: number) => {
                        toggleJob(sector, jobId);
                      };

                      return (
                        <Fragment key={job.id}>
                          <JobButton
                            job={job}
                            isSelected={isJobSelected(activeSector, job.id)}
                            hasSkills={!!(job.skills?.length)}
                            selectedSkillCount={countSelectedSkillsForJob(activeSector, job.id)}
                            isToggleHovered={hoveredToggleButton === job.id}
                            colorScheme={JobButtonColorScheme.kplayer}
                            onMainClick={() => handleMainClick(job)}
                            onToggleClick={() => handleToggleClick(activeSector, job.id)}
                            onToggleMouseEnter={() => setHoveredToggleButton(job.id)}
                            onToggleMouseLeave={() => setHoveredToggleButton(null)}
                          />

                          {/* Skills dropdown - appears right after the selected job button */}
                          {expandedJob === job.id && (
                            <div className="basis-full">
                              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 my-2">
                                <div className="text-sm font-medium text-gray-700 mb-3 flex flex-row gap-1">
                                  Competances pour: <p className="font-bold">{job.Name}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills?.map(skill => (
                                    <button
                                      key={skill.id}
                                      type="button"
                                      className={`px-3 py-1 text-sm border rounded-xl ${isSkillSelected(activeSector, expandedJob, skill.id)
                                        ? `bg-[${mainColor}] text-white border-[${mainColor}]`
                                        : 'border-gray-300 bg-white text-gray-700'
                                        }`}
                                      onClick={() => toggleSkill(activeSector, expandedJob, skill.id)}
                                    >
                                      {skill.Name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </Fragment>
                      );
                    })}

                    {/* Add invisible filler items to prevent sparse last row */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={`job-filler-${i}`} className="flex-grow h-0" />
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}
        {/* deactivation popup */}
        {sectorToDeactivate !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" style={{ borderColor: mainColor, borderWidth: '1px' }}>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr ? Toutes les configurations du secteur seront perdues !
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => confirmDeactivation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={() => confirmDeactivation(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Criteria & Requirements Section */}
      <div className="bg-white rounded-xl p-6 hover:shadow-xl">
        <h2 className="text-xl font-semibold">Critères & Requirements</h2>
        <div className="grid grid-cols-1 gap-6">
          {/* Contract Type */}
          <div className="space-y-2">
            <p className="text-gray-600">Type de contrat proposé</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    type="checkbox"
                    name="contract"
                    checked={formData.criteria.contract_roles?.includes(value) || false}
                    onChange={() => {
                      const currentRoles = formData.criteria.contract_roles || [];
                      const newRoles = currentRoles.includes(value)
                        ? currentRoles.filter(role => role !== value)
                        : [...currentRoles, value];
                      onFormDataChange("criteria", "contract_roles", newRoles);
                    }}
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">Date de démarrage souhaitée</p>
              <input
                type="date"
                className="w-full border p-2 rounded-xl"
                value={formData.criteria.crit_start_date}
                onChange={(e) => onFormDataChange("criteria", "crit_start_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Au plus tard</p>
              <input
                type="date"
                className="w-full border p-2 rounded-xl"
                value={formData.criteria.crit_start_date_lastest}
                onChange={(e) => onFormDataChange("criteria", "crit_start_date_lastest", e.target.value)}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">Durée prévisionnelle</p>
              <input
                type="text"
                className="w-full border p-2 rounded-xl"
                placeholder="jours"
                value={formData.criteria.crit_duration ?? ''}
                onChange={(e) => onFormDataChange("criteria", "crit_duration", e.target.value === "" ? null : parseInt(e.target.value, 10))}
              />
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Durée max</p>
              <input
                type="text"
                className="w-full border p-2 rounded-xl"
                placeholder="jours"
                value={formData.criteria.crit_duration_lastest ?? ''}
                onChange={(e) => onFormDataChange("criteria", "crit_duration_lastest", e.target.value === "" ? null : parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">TJM</p>
              <input
                type="text"
                className="w-full border p-2 rounded-xl"
                placeholder="€/h"
                value={formData.criteria.crit_target_rate ?? ''}
                onChange={(e) => onFormDataChange("criteria", "crit_target_rate", e.target.value === "" ? null : parseInt(e.target.value, 10))}
              />
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Salaire cible</p>
              <input
                type="text"
                className="w-full border p-2 rounded-xl"
                placeholder="€/an"
                value={formData.criteria.crit_max_rate ?? ''}
                onChange={(e) => onFormDataChange("criteria", "crit_max_rate", e.target.value === "" ? null : parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          {/* Location & Remote Work*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600">Localisation</p>
              <input
                type="text"
                className="w-full border p-2 rounded-xl"
                placeholder="Ville, Pays"
                value={formData.criteria.crit_location}
                onChange={(e) => onFormDataChange("criteria", "crit_location", e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Télétravail</p>
              <div className="flex gap-4">
                {[{ value: true, label: "Oui" }, { value: false, label: "Non" }].map(({ value, label }) => (
                  <label key={label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="remote"
                      checked={formData.criteria.crit_remote === value}
                      onChange={() => onFormDataChange("criteria", "crit_remote", value)}
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "tool", label: "Outils", field: "tools" },
              { key: "authorization", label: "Habilitations", field: "authorizations" },
              { key: "language", label: "Langues", field: "languages" },
              { key: "quality", label: "Qualités Relationnelles", field: "qualities" },
            ].map(({ key, label, field }) => (
              <div key={key} className="space-y-2">
                <p className="text-gray-600">{label}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValues[key as keyof typeof inputValues]}
                    onChange={(e) => handleInputChange(key as keyof typeof inputValues, e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem(key as keyof typeof inputValues, field as keyof OpportunityRequirements)}
                    placeholder={`Ajouter ${/^[aeiou]/i.test(label) ? "un" : "une"} ${label.toLowerCase()}`}
                    className="flex-1 border p-2 rounded-xl"
                  />
                  <button
                    onClick={() => addItem(key as keyof typeof inputValues, field as keyof OpportunityRequirements)}
                    className={`p-2 ${inputValues[key as keyof typeof inputValues].trim() ? "text-blue-600" : "text-gray-400"}`}
                    disabled={!inputValues[key as keyof typeof inputValues].trim()}
                  >
                    <PlusCircle size={24} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requirements[field as keyof OpportunityRequirements]?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-xl px-3 py-1"
                      style={{ backgroundColor: mainColor, color: 'white' }}
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => removeItem(field as keyof OpportunityRequirements, item)}
                        className="hover:text-gray-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsCriteriasForm