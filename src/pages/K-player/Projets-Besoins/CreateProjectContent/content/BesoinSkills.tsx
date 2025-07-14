import { FC, Fragment, useEffect, useState } from "react";
import { Job, OpportunitySectors, Sector } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JobButton, JobButtonColorScheme } from "../../../../K-Profile/Competence/content/SectorsAndCriteriasContent/JobButton";

interface BesoinSkillsProps {
    sectors: Sector[];
    loading: boolean;
    error: string | null;
    formData: OpportunitySectors;
    onFormDataChange: (field: keyof OpportunitySectors, value: any) => void;
}

const BesoinSkills: FC<BesoinSkillsProps> = ({
    sectors,
    loading,
    error,
    formData,
    onFormDataChange,
}) => {
    const [activeSector, setActiveSector] = useState<number | null>(null);
    const [sectorToDeactivate, setSectorToDeactivate] = useState<number | null>(null);
    const [expandedJob, setExpandedJob] = useState<number | null>(null);
    const [hoveredToggleButton, setHoveredToggleButton] = useState<number | null>(null);


    useEffect(() => {
        if (formData.selected_sectors && formData.selected_sectors.length > 0) {
            if (!activeSector || !formData.selected_sectors.some(s => s.id === activeSector)) {
                setActiveSector(formData.selected_sectors[0].id);
            }
        } else {
            setActiveSector(null);
        }
    }, [formData.selected_sectors, activeSector]);

    const toggleSector = (sectorId: number) => {
        const isSelected = formData.selected_sectors.some(s => s.id === sectorId);
        if (isSelected) {
            setSectorToDeactivate(sectorId);
        } else {
            if (formData.selected_sectors.length < 3) {
                const newSector = {
                    id: sectorId,
                    seniority: 1,
                    jobs: [],
                };
                onFormDataChange("selected_sectors", [...formData.selected_sectors, newSector]);
                setActiveSector(sectorId);
            }
        }
    };

    const confirmDeactivation = (confirm: boolean) => {
        if (confirm && sectorToDeactivate !== null) {
            const updatedSectors = formData.selected_sectors.filter(s => s.id !== sectorToDeactivate);
            onFormDataChange("selected_sectors", updatedSectors);
            if (activeSector === sectorToDeactivate) {
                setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
            }
        }
        setSectorToDeactivate(null);
    };

    const handleSeniorityChange = (sectorId: number, value: number) => {
        const updatedSectors = formData.selected_sectors.map(sector =>
            sector.id === sectorId ? { ...sector, seniority: value } : sector
        );
        onFormDataChange("selected_sectors", updatedSectors);
    };

    const toggleJob = (sectorId: number, jobId: number) => {
        const updatedSectors = formData.selected_sectors.map(sector => {
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

        onFormDataChange("selected_sectors", updatedSectors);
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

        onFormDataChange("selected_sectors", updatedSectors);
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

    // Check if sector is selected
    const isSectorSelected = (sectorId: number) => {
        return formData.selected_sectors.some(s => s.id === sectorId);
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
            className="w-full max-w-3xl p-6 flex flex-col gap-2 rounded-xl bg-white shadow-[0_0_4px_1px_rgba(17,53,93,0.41)]"
        >
            <h2 className="text-lg font-semibold mb-1">Compétences</h2>
            {/* Secteur */}
            <p className="text-black font-semibold mb-1">Secteur <span className="text-gray-600 font-thin text-sm">(jusqu'à 3 secteurs)</span></p>
            <div className="flex flex-wrap gap-2 mb-8">
                {sectors.map((sector) => (
                    <button
                        key={sector.id}
                        type="button"
                        className={`flex items-center px-3 py-2 border shadow rounded-xl space-x-2 whitespace-nowrap flex-grow-0 flex-shrink-0
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
                        {sector.Name}{" "}
                        <span className="ml-2">
                            {formData.selected_sectors?.some(s => s.id === sector.id) ? "-" : "+"}
                        </span>
                    </button>
                ))}
                {/* Add invisible filler items to prevent sparse last row */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`sector-filler-${i}`} className="flex-grow h-0" />
                ))}
            </div>

            {/* Selected sectors display */}
            {formData.selected_sectors && formData.selected_sectors.length > 0 && (
                <div className="flex flex-row justify-center items-stretch overflow-hidden mb-6">
                    {formData.selected_sectors.map((sector, index) => (
                        <button
                            key={sector.id}
                            type="button"
                            className={`
                  px-4 py-2 
                  border border-gray-300
                  ${index === 0 ? 'rounded-l-full' : 'border-l-0'} 
                  ${index === formData.selected_sectors.length - 1 ? 'rounded-r-full' : ''}
                  ${activeSector === sector.id
                                    ? "bg-[#215A96] text-white border-[#215A96]"
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
                                            className="p-1 text-gray-500 hover:text-[#215A96] disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-4 w-4" color="#215A96" strokeWidth={5} />
                                        </button>
                                        <span className="font-medium">{currentSeniority?.name}</span>
                                        <button
                                            onClick={() => handlePointsChange(currentPoints + 1)}
                                            disabled={currentPoints >= 21}
                                            className="p-1 text-gray-500 hover:text-[#215A96] disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-4 w-4" color="#215A96" strokeWidth={5} />
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
                                        className="absolute top-1/2 left-0 h-2 bg-[#215A96] rounded-xl transform -translate-y-1/2"
                                        style={{ width: `${(currentPoints / 21) * 100}%` }}
                                    ></div>
                                    <div
                                        className="absolute top-1/2 w-5 h-5 bg-[#215A96] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-md transition-all duration-100"
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
                                            className={currentDisplayLevel === level.level ? "font-bold text-[#215A96]" : ""}
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
                                                                            ? 'bg-[#215A96] text-white'
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
                    <div className="bg-white border border-[#215A96] rounded-2xl p-6 max-w-md w-full shadow-xl">
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
        </div >
    );
};


export default BesoinSkills;