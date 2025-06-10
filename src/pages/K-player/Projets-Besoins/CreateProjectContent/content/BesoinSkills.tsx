import { FC, useEffect, useState } from "react";
import { OpportunitySectors, Sector } from "../../types";

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
            const updatedSectors = formData.selected_sectors.filter(s => s.id !== sectorId);
            onFormDataChange("selected_sectors", updatedSectors);

            if (activeSector === sectorId) {
                setActiveSector(updatedSectors.length > 0 ? updatedSectors[0].id : null);
            }
        } else if (formData.selected_sectors.length < 3) {
            const newSector = {
                id: sectorId,
                seniority: 1,
                jobs: [],
            };
            onFormDataChange(
                "selected_sectors",
                [...formData.selected_sectors, newSector]
            );
            setActiveSector(sectorId);
        }
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

    const countSelectedSkillsForJob = (sectorId: number, jobId: number) => {
        const sector = formData.selected_sectors.find(s => s.id === sectorId);
        if (!sector) return 0;

        const job = sector.jobs.find(j => j.id === jobId);
        return job ? job.skills.length : 0;
    };

    const isJobSelected = (sectorId: number, jobId: number) => {
        const sector = formData.selected_sectors.find(s => s.id === sectorId);
        return sector ? sector.jobs.some(j => j.id === jobId) : false;
    };

    const isSkillSelected = (sectorId: number, jobId: number, skillId: number) => {
        const sector = formData.selected_sectors.find(s => s.id === sectorId);
        if (!sector) return false;

        const job = sector.jobs.find(j => j.id === jobId);
        return job ? job.skills.includes(skillId) : false;
    };

    const getSeniority = (sectorId: number) => {
        const sector = formData.selected_sectors.find(s => s.id === sectorId);
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
            className="w-full max-w-3xl p-6 flex flex-col gap-2 rounded-xl bg-white shadow-[0_0_4px_1px_rgba(17,53,93,0.41)]"
        >
            <h2 className="text-lg font-semibold mb-1">Compétences</h2>
            {/* Secteur */}
            <p className="text-black font-semibold mb-1">Secteur <span className="text-gray-600 font-thin text-sm">(jusqu'à 3 secteurs)</span></p>
            <div className="flex flex-wrap gap-2 mb-8">
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
            </div>

            {/* Selected sectors display */}
            {
                formData.selected_sectors?.length > 0 && (
                    <div className="flex justify-center mb-5">
                        <div className="inline-flex border border-gray-300 rounded-[20px] overflow-hidden">
                            {formData.selected_sectors.map((sector) => (
                                <button
                                    key={sector.id}
                                    type="button"
                                    className={`px-4 py-2 ${activeSector === sector.id
                                        ? "bg-[#215A96] text-white"
                                        : "bg-gray-50 text-gray-700"
                                        } ${sector.id === formData.selected_sectors[0].id ? "rounded-l-[20px]" : ""} 
            ${sector.id === formData.selected_sectors[formData.selected_sectors.length - 1].id ? "rounded-r-[20px]" : ""}`}
                                    onClick={() => setActiveSector(sector.id)}
                                >
                                    {sectors.find((s) => s.id === sector.id)?.sector}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
            {/* Seniority & Jobs */}
            {
                activeSector !== null && (
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
                )
            }
        </div >
    );
};


export default BesoinSkills;