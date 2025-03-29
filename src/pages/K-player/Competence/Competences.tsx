import { FC, useEffect, useState } from "react";
import { OpportunityFormData, Sector } from "./CompetencesEtCriteres";

interface CompetencesProps {
  sectors: Sector[];
  loading: boolean;
  error: string | null;
  formData: OpportunityFormData;
  onFormDataChange: (newData: Partial<OpportunityFormData>) => void;
}

const Competences: FC<CompetencesProps> = ({
  sectors = [],
  loading,
  error,
  formData,
  onFormDataChange,
}) => {
  const [activeSector, setActiveSector] = useState<number | null>(null);

  // Initialize active sector when formData changes
  useEffect(() => {
    if (formData.selected_sectors && formData.selected_sectors.length > 0 && !activeSector) {
      setActiveSector(formData.selected_sectors[0].id);
    } else if (!formData.selected_sectors || formData.selected_sectors.length === 0) {
      setActiveSector(null);
    }
  }, [formData.selected_sectors]);

  const toggleSector = (sectorId: number) => {
    const isSelected = formData.selected_sectors.some(s => s.id === sectorId);

    if (isSelected) {
      // Remove sector
      const updatedSectors = formData.selected_sectors.filter(s => s.id !== sectorId);
      onFormDataChange({ selected_sectors: updatedSectors });

      // Update active sector if needed
      if (activeSector === sectorId) {
        setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
      }
    } else if (formData.selected_sectors.length < 3) {
      // Add new sector
      const newSector = {
        id: sectorId,
        seniority: 1,
        jobs: [],
      };
      onFormDataChange({
        selected_sectors: [...formData.selected_sectors, newSector],
      });
      setActiveSector(sectorId);
    }
  };

  const handleSeniorityChange = (sectorId: number, value: number) => {
    const updatedSectors = formData.selected_sectors.map(sector =>
      sector.id === sectorId ? { ...sector, seniority: value } : sector
    );
    onFormDataChange({ selected_sectors: updatedSectors });
  };

  const toggleJob = (sectorId: number, jobId: number) => {
    const updatedSectors = formData.selected_sectors.map(sector => {
      if (sector.id !== sectorId) return sector;

      const jobIndex = sector.jobs.findIndex(j => j.id === jobId);

      if (jobIndex >= 0) {
        // Remove job
        return {
          ...sector,
          jobs: sector.jobs.filter(j => j.id !== jobId),
        };
      } else {
        // Add new job
        return {
          ...sector,
          jobs: [...sector.jobs, { id: jobId, skills: [] }],
        };
      }
    });

    onFormDataChange({ selected_sectors: updatedSectors });
  };

  const toggleSkill = (sectorId: number, jobId: number, skillId: number) => {
    const updatedSectors = formData.selected_sectors.map(sector => {
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

    onFormDataChange({ selected_sectors: updatedSectors });
  };

  // Count selected skills for a job
  const countSelectedSkillsForJob = (sectorId: number, jobId: number) => {
    const sector = formData.selected_sectors.find(s => s.id === sectorId);
    if (!sector) return 0;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.length : 0;
  };

  // Check if a job is selected
  const isJobSelected = (sectorId: number, jobId: number) => {
    const sector = formData.selected_sectors.find(s => s.id === sectorId);
    return sector ? sector.jobs.some(j => j.id === jobId) : false;
  };

  // Check if a skill is selected
  const isSkillSelected = (sectorId: number, jobId: number, skillId: number) => {
    const sector = formData.selected_sectors.find(s => s.id === sectorId);
    if (!sector) return false;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.includes(skillId) : false;
  };

  // Get seniority level for a sector
  const getSeniority = (sectorId: number) => {
    const sector = formData.selected_sectors.find(s => s.id === sectorId);
    return sector ? sector.seniority : 1;
  };

  // Render skills for a job
  const renderSkills = (sectorId: number, jobId: number) => {
    const sector = sectors.find(s => s.id === sectorId);
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
              className={`px-3 py-1 text-sm border rounded-xl ${isSkillSelected(sectorId, jobId, skill.id)
                ? 'bg-[#215A96] text-white'
                : 'border-gray-300 bg-white text-gray-700'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSkill(sectorId, jobId, skill.id);
              }}
            >
              {skill.skill}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render jobs list with skills
  const renderJobs = (sectorId: number) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (!sector?.jobs) return null;

    return (
      <div className="my-4 space-y-2">
        {sector.jobs.map(job => {
          const selectedSkillCount = countSelectedSkillsForJob(sectorId, job.id);
          const isSelected = isJobSelected(sectorId, job.id);
          const hasSkills = !!(job.skills?.length);

          return (
            <div
              key={job.id}
              className="border rounded-xl overflow-hidden cursor-pointer"
              onClick={() => toggleJob(sectorId, job.id)}
            >
              <div className={`flex items-center justify-between p-3 ${isSelected ? 'bg-blue-200' : 'bg-blue-50'
                }`}>
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

              {hasSkills && isSelected && renderSkills(sectorId, job.id)}
            </div>
          );
        })}
      </div>
    );
  };

  // Render seniority slider
  const renderSenioritySlider = (sectorId: number) => {
    const seniorityLevels = [
      { level: 1, name: "Junior", description: "1 - 4 ans" },
      { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
      { level: 3, name: "Senior", description: "10 - 14 ans" },
      { level: 4, name: "Lead", description: "15 - 19 ans" },
      { level: 5, name: "Principal", description: "20+ ans" },
    ];
    const currentLevel = getSeniority(sectorId);
    const currentSeniority = seniorityLevels.find(level => level.level === currentLevel);

    return (
      <div className="my-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">{currentSeniority?.name}</span>
          <span>{currentSeniority?.description}</span>
        </div>

        <div className="relative w-full mb-2">
          <input
            type="range"
            min="1"
            max="5"
            value={currentLevel}
            onChange={(e) => handleSeniorityChange(sectorId, parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-xl appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #215A96 0%, #215A96 ${(currentLevel - 1) * 25
                }%, #e5e7eb ${(currentLevel - 1) * 25}%, #e5e7eb 100%)`,
            }}
          />

          <div className="flex justify-between w-full px-1 absolute top-3 left-0 right-0">
            {seniorityLevels.map((level) => (
              <div
                key={level.level}
                className={`w-2 h-2 rounded-full ${currentLevel >= level.level ? 'bg-[#215A96]' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {seniorityLevels.map((level) => (
            <span key={level.level}>{level.level}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl"
      style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
    >
      <h2 className="text-lg font-semibold mb-4">Compétences</h2>
      {/* Secteur */}
      <p className="text-black font-semibold mb-2">Secteur</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Couldn't load sectors: {error}</div>
        ) : (
          <>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                type="button"
                className={`
                  flex items-center px-3 py-2 border shadow rounded-xl space-x-2
                  ${formData.selected_sectors?.some(s => s.id === sector.id)
                    ? 'bg-[#215A96] text-white'
                    : 'border-black bg-gray-50 text-gray-700'
                  }
                  ${!formData.selected_sectors?.some(s => s.id === sector.id) &&
                    formData.selected_sectors?.length >= 3
                    ? 'opacity-50'
                    : ''
                  }
                `}
                onClick={() => toggleSector(sector.id)}
                disabled={
                  !formData.selected_sectors?.some(s => s.id === sector.id) &&
                  formData.selected_sectors?.length >= 3
                }
              >
                {sector.sector}{" "}
                <span className="ml-2">
                  {formData.selected_sectors?.some(s => s.id === sector.id) ? "-" : "+"}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Selected sectors display */}
      {formData.selected_sectors?.length > 0 && (
        <div
          className="justify-center items-center inline-flex border border-gray-300 rounded-md overflow-hidden mb-6"
          style={{ borderRadius: "20px" }}
        >
          {formData.selected_sectors.map((sector) => (
            <button
              key={sector.id}
              type="button"
              className={`px-4 py-2 ${activeSector === sector.id
                ? "bg-[#215A96] text-white"
                : "border-black bg-gray-50 text-gray-700"
                }`}
              onClick={() => setActiveSector(sector.id)}
            >
              {sectors.find((s) => s.id === sector.id)?.sector}
            </button>
          ))}
        </div>
      )}

      {/* Seniority & Jobs */}
      {activeSector !== null && (
        <>
          {renderSenioritySlider(activeSector)}
          <br />
          <p className="text-gray-600 mb-2">Metier</p>
          {renderJobs(activeSector)}
        </>
      )}
    </div>
  );
};

export default Competences;