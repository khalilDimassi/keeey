import { FC, useEffect, useState } from "react";
import { MinimalSector, Sector } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompetencesProps {
  sectors: Sector[];
  loading: boolean;
  error: string | null;
  initialSelections: MinimalSector[];
  onSelectionChange: (newData: MinimalSector[]) => void;
}

const Competences: FC<CompetencesProps> = ({
  sectors = [],
  loading,
  error,
  initialSelections,
  onSelectionChange,
}) => {
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const [sectorToDeactivate, setSectorToDeactivate] = useState<number | null>(null);

  useEffect(() => {
    if (initialSelections.length > 0 && !activeSector) {
      setActiveSector(initialSelections[0].id);
    } else if (initialSelections.length === 0) {
      setActiveSector(null);
    }
  }, [initialSelections]);

  const toggleSector = (sectorId: number) => {
    const isSelected = initialSelections.some(s => s.id === sectorId);
    if (isSelected) {
      setSectorToDeactivate(sectorId);
    } else {
      if (initialSelections.length < 3) {
        const newSector = {
          id: sectorId,
          seniority: 1,
          jobs: [],
        };
        onSelectionChange([...initialSelections, newSector]);
        setActiveSector(sectorId);
      }
    }
  };

  const confirmDeactivation = (confirm: boolean) => {
    if (confirm && sectorToDeactivate !== null) {
      const updatedSectors = initialSelections.filter(s => s.id !== sectorToDeactivate);
      onSelectionChange(updatedSectors);
      if (activeSector === sectorToDeactivate) {
        setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
      }
    }
    setSectorToDeactivate(null);
  };

  const handleSeniorityChange = (sectorId: number, value: number) => {
    const updatedSectors = initialSelections.map(sector =>
      sector.id === sectorId ? { ...sector, seniority: value } : sector
    );
    onSelectionChange(updatedSectors);
  };

  const toggleJob = (sectorId: number, jobId: number) => {
    const updatedSectors = initialSelections.map(sector => {
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

    onSelectionChange(updatedSectors);
  };

  const toggleSkill = (sectorId: number, jobId: number, skillId: number) => {
    const updatedSectors = initialSelections.map(sector => {
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

    onSelectionChange(updatedSectors);
  };

  // Count selected skills for a job
  const countSelectedSkillsForJob = (sectorId: number, jobId: number) => {
    const sector = initialSelections.find(s => s.id === sectorId);
    if (!sector) return 0;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.length : 0;
  };

  // Check if a job is selected
  const isJobSelected = (sectorId: number, jobId: number) => {
    const sector = initialSelections.find(s => s.id === sectorId);
    return sector ? sector.jobs.some(j => j.id === jobId) : false;
  };

  // Check if a skill is selected
  const isSkillSelected = (sectorId: number, jobId: number, skillId: number) => {
    const sector = initialSelections.find(s => s.id === sectorId);
    if (!sector) return false;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.includes(skillId) : false;
  };

  // Get seniority level for a sector
  const getSeniority = (sectorId: number) => {
    const sector = initialSelections.find(s => s.id === sectorId);
    return sector ? sector.seniority : 1;
  };

  const randomWidth = () => {
    const widths = ["w-16", "w-20", "w-24", "w-28", "w-32"];
    return widths[Math.floor(Math.random() * widths.length)];
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl"
        style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <h2 className="text-lg font-semibold mb-4">Compétences</h2>
        <div className="text-center py-8 text-red-500">
          <p className="font-medium">Couldn't load component data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl animate-pulse"
        style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <h2 className="text-lg font-semibold mb-4">Compétences</h2>

        {/* Skeleton for sectors */}
        <p className="text-black font-semibold mb-2">Secteur</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-10 ${randomWidth()} bg-gray-200 rounded-xl`}
            ></div>
          ))}
        </div>

        {/* Skeleton for selected sectors tabs */}
        <div className="flex gap-2 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-24 h-8 bg-gray-200 rounded-md"></div>
          ))}
        </div>

        {/* Skeleton for seniority */}
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

        {/* Skeleton for jobs */}
        <p className="text-gray-600 mb-2">Metier</p>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white  w-full"
    >
      {/* Secteur */}
      <p className="font-semibold mb-2">Secteur</p>
      <div className="flex flex-wrap gap-2 mb-5 w-full">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            type="button"
            className={`
        flex items-center px-3 py-2 border shadow rounded-xl space-x-2
        whitespace-nowrap flex-grow-0 flex-shrink-0
        ${initialSelections?.some(s => s.id === sector.id)
                ? 'bg-[#297280] text-white'
                : 'border-black bg-gray-50 text-gray-700'
              }
        ${!initialSelections?.some(s => s.id === sector.id) &&
                initialSelections?.length >= 3
                ? 'opacity-50'
                : ''
              }
      `}
            onClick={() => toggleSector(sector.id)}
            disabled={
              !initialSelections?.some(s => s.id === sector.id) &&
              initialSelections?.length >= 3
            }
          >
            {sector.sector}{" "}
            <span className="ml-2">
              {initialSelections?.some(s => s.id === sector.id) ? "-" : "+"}
            </span>
          </button>
        ))}
        {/* Add invisible filler items to prevent sparse last row */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`filler-${i}`} className="flex-grow h-0" />
        ))}
      </div>

      {/* Selected sectors display */}
      {initialSelections?.length > 0 && (
        <div
          className="justify-center items-center inline-flex border border-gray-300 rounded-md overflow-hidden mb-6"
          style={{ borderRadius: "20px" }}
        >
          {initialSelections.map((sector) => (
            <button
              key={sector.id}
              type="button"
              className={`px-4 py-2 ${activeSector === sector.id
                ? "bg-[#297280] text-white"
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
          {((activeSector) => {
            const seniorityLevels = [
              { level: 1, name: "Junior" },
              { level: 2, name: "Mid-Level" },
              { level: 3, name: "Senior" },
              { level: 4, name: "Lead" },
              { level: 5, name: "Principal" },
            ];

            // Convert between point value (0-21) and display level (1-5)
            const getDisplayLevel = (points: number) => {
              if (points <= 4) return 1;
              if (points <= 9) return 2;
              if (points <= 14) return 3;
              if (points <= 19) return 4;
              return 5;
            };

            const currentPoints = getSeniority(activeSector); // Now expects 0-21
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
                      className="p-1 text-gray-500 hover:text-[#297280] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" color="#297280" strokeWidth={5} />
                    </button>
                    <span className="font-medium">{currentSeniority?.name}</span>
                    <button
                      onClick={() => handlePointsChange(currentPoints + 1)}
                      disabled={currentPoints >= 21}
                      className="p-1 text-gray-500 hover:text-[#297280] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" color="#297280" strokeWidth={5} />
                    </button>
                  </div>
                  <span>{(currentPoints > 20) ? "20+" : currentPoints}</span>
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
                    className="absolute top-1/2 left-0 h-2 bg-[#297280] rounded-xl transform -translate-y-1/2"
                    style={{ width: `${(currentPoints / 21) * 100}%` }}
                  ></div>
                  <div
                    className="absolute top-1/2 w-5 h-5 bg-[#297280] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md transition-all duration-100"
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
                      className={currentDisplayLevel === level.level ? "font-bold text-[#297280]" : ""}
                    >
                      {level.level}
                    </span>
                  ))}
                </div>
              </div>
            );
          })(activeSector)}
          <br />
          <p className=" font-semibold mb-2">Metier</p>
          {(() => {
            const sector = sectors.find(s => s.id === activeSector);
            if (!sector?.jobs) return null;

            return (
              <div className="my-4 space-y-2">
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
                      <div className={`flex items-center justify-between p-3 ${isSelected ? 'bg-green-200' : 'bg-green-50'}`}>
                        <div className="flex items-center">
                          <span className={`px-3 py-2 rounded-xl ${isSelected
                            ? 'bg-[#297280] text-white'
                            : 'border border-gray-300 bg-white text-gray-700'
                            }`}>
                            {job.job}
                          </span>

                          {hasSkills && isSelected && (
                            <div className="ml-3 flex flex-wrap space-x-1">
                              {[...Array(Math.min(3, selectedSkillCount))].map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-[#297280]"></div>
                              ))}
                              {selectedSkillCount > 3 && (
                                <span className="text-xs text-[#297280] ml-1">+{selectedSkillCount - 3}</span>
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
                                    ? 'bg-[#297280] text-white'
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

      {sectorToDeactivate !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#297280] rounded-md p-6 max-w-md w-full shadow-xl">
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr ? Toutes les configurations du secteur seront perdues !
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => confirmDeactivation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeactivation(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove Sector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competences;

