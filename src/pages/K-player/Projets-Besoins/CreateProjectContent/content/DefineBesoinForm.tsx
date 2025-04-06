import { FC, KeyboardEvent } from "react";
import { OpportunityFormData, Sector } from "../../types";
import BesoinInfo from "./BesoinInfo";
import BesoinSkills from "./BesoinSkills";
import BesoinCrit from "./BesoinCrit";


interface DefineBesoinFormProps {
    sectors: Sector[];
    loading: boolean;
    error: string | null;
    formData: OpportunityFormData;
    onFormDataChange: <T extends keyof OpportunityFormData>(field: T, value: OpportunityFormData[T]) => void;
}

const DefineBesoinForm: FC<DefineBesoinFormProps> = ({ sectors, loading, error, formData, onFormDataChange }) => {

    // Prevent form submission on Enter key
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    return (
        <div onKeyDown={handleKeyDown}>
            {/* Basic Info Section */}
            <BesoinInfo
                formData={{
                    title: formData.title,
                    announceDate: formData.announceDate,
                    responseDate: formData.responseDate,
                    startDate: formData.startDate,
                    duration: formData.duration,
                    targetRate: formData.targetRate
                }}
                onFormDataChange={onFormDataChange}
            />

            <div className="my-2 bg-gray-100 flex gap-6">
                {/* Skills Section */}
                <BesoinSkills
                    formData={{ selected_sectors: formData.selected_sectors }}
                    sectors={sectors}
                    loading={loading}
                    error={error}
                    onFormDataChange={onFormDataChange}
                />

                <div className="flex flex-col gap-6">
                    {/* Criteria Section */}
                    <BesoinCrit
                        formData={{
                            contract_role: formData.contract_role,
                            crit_start_date: formData.crit_start_date,
                            crit_start_date_lastest: formData.crit_start_date_lastest,
                            crit_duration: formData.crit_duration,
                            crit_duration_lastest: formData.crit_duration_lastest,
                            crit_target_rate: formData.crit_target_rate,
                            crit_max_rate: formData.crit_max_rate,
                            crit_location: formData.crit_location,
                            crit_remote: formData.crit_remote,
                            tools: formData.tools,
                            authorizations: formData.authorizations,
                            languages: formData.languages,
                            qualities: formData.qualities,
                        }}
                        onFormDataChange={onFormDataChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DefineBesoinForm;