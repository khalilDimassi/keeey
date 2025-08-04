import { getAuthHeader, getUserId } from "../../../utils/jwt";

import axios from "axios";
import { OpportunityFormData, CandidateSuggestion } from "./content/OpportunityDetailsKPlayer/types";
import { Opportunity } from "./types";

export const fetchOpportunities = async (filter: 'personal' | 'organization' | 'network'): Promise<Opportunity[]> => {
    try {

        const response = await axios.get<Opportunity[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${filter}/list`,
            { headers: { ...getAuthHeader() } }
        );

        return response.data ?? [];
    } catch (err) {
        let errorMessage = 'Error fetching Opportunities. Please try again later.';

        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message ||
                err.message ||
                errorMessage;
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }

        console.error('Error fetching Opportunities:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const submitOpportunity = async (formData: OpportunityFormData, formType: string) => {
    try {
        const payload = {
            title: formData.title,
            announce_at: formData.announce_at,
            responded_at: formData.responded_at,
            start_at: formData.start_at,
            duration: formData.duration || 0,
            rate: formData.rate || 0,
            opportunity_role: formType,
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
            auths: formData.authorizations,
            quals: formData.qualities,
            langs: formData.languages.map(lang => ({
                name: lang,
                level: 1
            })),
            skills: formData.selected_sectors.flatMap(sector =>
                sector.jobs?.flatMap(job =>
                    job.skills?.map(skill => ({
                        id: skill,
                        seniority: sector.seniority,
                    })) || []
                ) || []
            ),
        };

        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/v2`,
            payload,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );

        return { data: response.data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to save opportunity"
        };
    }
};

export const saveAndSearchOpportunities = async (formData: OpportunityFormData): Promise<{ searchResults?: any; error?: string; }> => {
    try {
        // Save operation
        await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${getUserId()}/v2`,
            formData,
            { headers: getAuthHeader() }
        );

        // Search operation
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/search`,
            formData,
            { headers: getAuthHeader() }
        );

        return { searchResults: response.data };
    } catch (error) {
        console.error('Opportunity operation failed:', error);
        return { error: 'Failed to save/search. Please try again.' };
    }
};

export const starCandidate = async (
    opportunityId: string,
    userId: string
): Promise<void> => {
    await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/${userId}/star`,
        {},
        { headers: getAuthHeader() }
    );
};

export const updateCandidateStatus = (
    candidates: CandidateSuggestion[],
    userId: string,
    updates: Partial<CandidateSuggestion>
): CandidateSuggestion[] => {
    return candidates.map(candidate =>
        candidate.user_id === userId
            ? { ...candidate, ...updates }
            : candidate
    );
}; 