import { FC, KeyboardEvent, useEffect } from "react";
import { OpportunityFormData, Sector } from "../../types";
import BesoinSkills from "./BesoinSkills";
import BesoinCrit from "./BesoinCrit";

interface DefineVivierFormProps {
    sectors: Sector[];
    loading: boolean;
    error: string | null;
    formData: OpportunityFormData;
    onFormDataChange: <T extends keyof OpportunityFormData>(field: T, value: OpportunityFormData[T]) => void;
    setFormType: (formType: "REQUIREMENT" | "LIVEWELL") => void;
}

const DefineVivierForm: FC<DefineVivierFormProps> = ({ sectors, loading, error, formData, onFormDataChange, setFormType }) => {

    useEffect(() => {
        setFormType("LIVEWELL");
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    return (
        <div className="my-2 bg-gray-100 flex gap-6" onKeyDown={handleKeyDown}>
            <BesoinSkills
                formData={{ selected_sectors: formData.selected_sectors }}
                sectors={sectors}
                loading={loading}
                error={error}
                onFormDataChange={onFormDataChange}
            />

            <div className="flex flex-col w-1/2 gap-6">
                <BesoinCrit
                    formData={{
                        contract_roles: formData.contract_roles,
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
    );
};

export default DefineVivierForm;