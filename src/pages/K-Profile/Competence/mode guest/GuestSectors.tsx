import { Fragment, useEffect, useState } from "react";
import { Job, MinimalSector, Sector } from "../types"
import { Check, ChevronLeft, ChevronRight, LoaderIcon } from "lucide-react";
import { JobButton, JobButtonColorScheme } from "../../../components/JobButton";


interface GuestSectorsProps {
  sectors: Sector[],
  guestSelection: MinimalSector[],
  updateGuestData: (change: { section: 'sectors'; data: MinimalSector[] }) => void
  onSave: () => void
  loading: boolean;
}

const GuestSectors = ({ sectors, guestSelection, updateGuestData, onSave, loading }: GuestSectorsProps) => {
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const [sectorToDeactivate, setSectorToDeactivate] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [hoveredToggleButton, setHoveredToggleButton] = useState<number | null>(null);

  useEffect(() => {
    if (guestSelection.length > 0 && !activeSector) {
      setActiveSector(guestSelection[0].id);
    } else if (guestSelection.length === 0) {
      setActiveSector(null);
    }
  }, [guestSelection]);

  const toggleSector = (sectorId: number) => {
    const isSelected = guestSelection.some(s => s.id === sectorId);
    if (isSelected) {
      setSectorToDeactivate(sectorId);
    } else {
      if (guestSelection.length < 3) {
        const newSector = {
          id: sectorId,
          seniority: 1,
          jobs: [],
        };
        updateGuestData({ section: 'sectors', data: [...guestSelection, newSector] });
        setActiveSector(sectorId);
      }
    }
  };

  const confirmDeactivation = (confirm: boolean) => {
    if (confirm && sectorToDeactivate !== null) {
      const updatedSectors = guestSelection.filter(s => s.id !== sectorToDeactivate);
      updateGuestData({ section: 'sectors', data: updatedSectors });
      if (activeSector === sectorToDeactivate) {
        setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
      }
    }
    setSectorToDeactivate(null);
  };

  const handleSeniorityChange = (sectorId: number, value: number) => {
    const updatedSectors = guestSelection.map(sector =>
      sector.id === sectorId ? { ...sector, seniority: value } : sector
    );
    updateGuestData({ section: 'sectors', data: updatedSectors });
  };

  const toggleJob = (sectorId: number, jobId: number) => {
    const updatedSectors = guestSelection.map(sector => {
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

    updateGuestData({ section: 'sectors', data: updatedSectors });
  };

  const toggleSkill = (sectorId: number, jobId: number, skillId: number) => {
    const updatedSectors = guestSelection.map(sector => {
      if (sector.id !== sectorId) return sector;

      const jobIndex = sector.jobs.findIndex(j => j.id === jobId);
      let updatedJobs;

      if (jobIndex === -1) {
        updatedJobs = [
          ...sector.jobs,
          { id: jobId, skills: [skillId] }
        ];
      } else {
        updatedJobs = sector.jobs.map(job => {
          if (job.id !== jobId) return job;

          const skillIndex = job.skills.indexOf(skillId);
          return {
            ...job,
            skills:
              skillIndex >= 0
                ? job.skills.filter(id => id !== skillId)
                : [...job.skills, skillId],
          };
        });
      }

      return { ...sector, jobs: updatedJobs };
    });

    updateGuestData({ section: 'sectors', data: updatedSectors });
  };

  // Count selected skills for a job
  const countSelectedSkillsForJob = (sectorId: number, jobId: number) => {
    const sector = guestSelection.find(s => s.id === sectorId);
    if (!sector) return 0;

    const job = sector?.jobs?.find(j => j.id === jobId) ?? null;
    return job ? job.skills?.length : 0;
  };

  // Check if a job is selected
  const isJobSelected = (sectorId: number, jobId: number) => {
    const sector = guestSelection?.find(s => s.id === sectorId) ?? null;
    return sector?.jobs?.some(j => j.id === jobId) ?? false;
  };

  // Check if a skill is selected
  const isSkillSelected = (sectorId: number, jobId: number, skillId: number) => {
    const sector = guestSelection.find(s => s.id === sectorId);
    if (!sector) return false;

    const job = sector.jobs.find(j => j.id === jobId);
    return job ? job.skills.includes(skillId) : false;
  };

  // Get seniority level for a sector
  const getSeniority = (sectorId: number) => {
    const sector = guestSelection.find(s => s.id === sectorId);
    return sector ? sector.seniority : 1;
  };

  return (
    <div
      className="bg-white w-full p-8 ml-[-4px] rounded-b-xl shadow-[4px_4px_6px_1px_rgba(0,0,0,0.1)]"
    >
      {/* Secteur */}
      <div className="flex flex-row justify-between">
        <p className="text-lg font-semibold mb-2 text-gray-800">Secteur</p>
        <button
          type="button"
          title="Modifications détectées. Cliquez pour enregistrer!"
          className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          onClick={onSave}>
          {loading ? <LoaderIcon className="w-5 h-5 text-gray-700 animate-spin" /> : <Check className="w-5 h-5 text-green-700" />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-5 w-full">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            type="button"
            className={`flex items-center px-3 py-2 border shadow rounded-xl space-x-2 whitespace-nowrap flex-grow-0 flex-shrink-0
                  ${guestSelection?.some(s => s.id === sector.id)
                ? 'bg-[#297280] text-white'
                : 'border-black bg-gray-50 text-gray-700'
              }
                  ${!guestSelection?.some(s => s.id === sector.id) &&
                guestSelection?.length >= 3
                ? 'opacity-50'
                : ''
              }
                `}
            onClick={() => toggleSector(sector.id)}
            disabled={
              !guestSelection?.some(s => s.id === sector.id) &&
              guestSelection?.length >= 3
            }
          >
            {sector.Name}{" "}
            <span className="ml-2">
              {guestSelection?.some(s => s.id === sector.id) ? "-" : "+"}
            </span>
          </button>
        ))}
        {/* Add invisible filler items to prevent sparse last row */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`sector-filler-${i}`} className="flex-grow h-0" />
        ))}
      </div>

      {/* Selected sectors display */}
      {guestSelection?.length > 0 && (
        <div className="flex flex-row justify-center items-stretch overflow-hidden mb-6">
          {guestSelection.map((sector, index) => (
            <button
              key={sector.id}
              type="button"
              className={`
                px-4 py-2 
                border border-gray-300
                ${index === 0 ? 'rounded-l-full' : 'border-l-0'} 
                ${index === guestSelection.length - 1 ? 'rounded-r-full' : ''}
                ${activeSector === sector.id
                  ? "bg-[#297280] text-white border-[#297280]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }
              `}
              onClick={() => setActiveSector(sector.id)}
            >
              {sectors.find((s) => s.id === sector.id)?.Name}
            </button>
          ))}
        </div>
      )}

      {/* Active Sector, Seniority & Jobs */}
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
                          colorScheme={JobButtonColorScheme.kprofile}
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
                                Competances pour: <p className="font-bold">{job.job}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {job.skills?.map(skill => (
                                  <button
                                    key={skill.id}
                                    type="button"
                                    className={`px-3 py-1 text-sm border rounded-xl ${isSkillSelected(activeSector, expandedJob, skill.id)
                                      ? 'bg-[#297280] text-white'
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

      {sectorToDeactivate !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#297280] rounded-2xl p-6 max-w-md w-full shadow-xl">
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr ? Toutes les configurations du secteur seront perdues !
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => confirmDeactivation(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeactivation(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove Sector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestSectors