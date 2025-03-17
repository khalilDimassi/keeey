// Parent Component
import React from "react";
import axios from "axios";
import { getAuthHeader } from "../../../../utils/jwt";
import BesoinInfo from "./BesoinInfo";
import BesoinSkills from "./BesoinSkills";
import BesoinCrit from "./BesoinCrit";
import BesoinDoc from "./BesoinDoc";

export interface Job {
    id: number;
    job: string;
}

export interface Sector {
    id: number;
    sector: string;
    jobs: Job[];
}

interface DefineBesoinFormProps {
    sectors: Sector[];
    loading: boolean;
    error: string | null;
}

const DefineBesoinForm: React.FC<DefineBesoinFormProps> = ({ sectors, loading, error }) => {
    const [formData, setFormData] = React.useState({
        // General Information
        title: "",
        announcetDate: "",
        responseDate: "",
        startDate: "",
        duration: "",
        targetRate: "",

        // Skills
        selectedSectors: [] as number[],
        activeSector: null as number | null,
        seniority: {} as { [key: number]: number },
        selectedJobs: {} as { [key: number]: number[] },
        tools: [] as string[],
        authorizations: [] as string[],
        languages: [] as string[],
        qualities: [] as string[],

        // Criteria
        selectedContract: "CDI",
        critStartDate: "",
        critStartDateLatest: "",
        critDuration: "",
        critDurationLatest: "",
        critTargetRate: "",
        critMaxRate: "",
        critLocation: "",
        remoteWork: "Non",
    });

    const [submitStatus, setSubmitStatus] = React.useState<{ loading: boolean, error: string | null }>({
        loading: false,
        error: null
    });

    // Handler for updating any field in formData
    const updateFormData = (_section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Special handlers for more complex updates
    const toggleSector = (sectorId: number) => {
        setFormData(prev => {
            if (prev.selectedSectors.includes(sectorId)) {
                // Remove sector
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
                // Add sector
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
        setFormData(prev => ({
            ...prev,
            seniority: { ...prev.seniority, [sectorId]: value }
        }));
    };

    const toggleJob = (sectorId: number, jobId: number) => {
        setFormData(prev => {
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
        if (item.trim() !== "" && !formData[listName].includes(item)) {
            setFormData(prev => ({
                ...prev,
                [listName]: [...prev[listName], item]
            }));
        }
    };

    const removeItem = (listName: "tools" | "authorizations" | "languages" | "qualities", item: string) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter(i => i !== item)
        }));
    };

    const prepareDataForSubmission = () => {
        const jobs = [];
        for (const sectorId of formData.selectedSectors) {
            const jobsInSector = formData.selectedJobs[sectorId] || [];
            for (const jobId of jobsInSector) {
                jobs.push({
                    id: jobId,
                    seniority: formData.seniority[sectorId] || 1
                });
            }
        }

        const langs = formData.languages.map(lang => ({
            name: lang,
            level: 1
        }));

        return {
            title: formData.title,
            announce_at: formData.announcetDate,
            responded_at: formData.responseDate,
            start_at: formData.startDate,
            duration: parseInt(formData.duration) || 0,
            rate: parseFloat(formData.targetRate) || 0,
            opportunity_role: "REQUIREMENT",
            contract_role: formData.selectedContract,

            crit_start_date: formData.critStartDate,
            crit_start_date_lastest: formData.critStartDateLatest,
            crit_target_rate: parseFloat(formData.critTargetRate) || 0,
            crit_max_rate: parseFloat(formData.critMaxRate) || 0,
            crit_location: formData.critLocation,
            crit_remote: formData.remoteWork === "Oui",

            jobs: jobs,
            tools: formData.tools,
            auths: formData.authorizations,
            langs: langs,
            quals: formData.qualities,
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
            // Success handling could go here (e.g., redirect or show success message)
        } catch (error) {
            setSubmitStatus({ loading: false, error: "Failed to create opportunity" });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <BesoinInfo
                formData={formData}
                updateFormData={updateFormData}
            />

            <div className="my-2 bg-gray-100 flex gap-6">
                <BesoinSkills
                    formData={formData}
                    sectors={sectors}
                    loading={loading}
                    error={error}
                    toggleSector={toggleSector}
                    handleSeniorityChange={handleSeniorityChange}
                    toggleJob={toggleJob}
                    addItem={addItem}
                    removeItem={removeItem}
                    setActiveSector={(sectorId) => updateFormData("skills", "activeSector", sectorId)}
                />

                <div className="flex flex-col w-1/2 gap-6">
                    <BesoinCrit
                        formData={formData}
                        updateFormData={updateFormData}
                    />

                    <BesoinDoc />
                </div>
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
};

export default DefineBesoinForm;