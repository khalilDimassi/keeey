// opportunityServices.ts
import axios from 'axios';
import { CandidateEnhancements, CandidateSuggestion, MatchPercentages, OpportunityFormData, Sector } from './types';
import { getAuthHeader, getUserId } from '../../../utils/jwt';

export const fetchSectors = async (): Promise<Sector[]> => {
    const response = await axios.get<Sector[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
    );
    return response.data;
};

export const fetchUserOpportunityData = async (): Promise<OpportunityFormData> => {
    const response = await axios.get<OpportunityFormData>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/default-search`,
        {
            headers: getAuthHeader(),
        }
    );
    return response.data;
};

export const fetchInitialSectorsCriterias = async (): Promise<{
    sectors: Sector[];
    formData: OpportunityFormData;
}> => {
    try {
        const [sectors, formData] = await Promise.all([
            fetchSectors(),
            fetchUserOpportunityData(),
        ]);
        return { sectors, formData };
    } catch (error) {
        console.error('Failed to fetch initial data:', error);
        throw new Error('Failed to fetch initial data. Please try again later.');
    }
};

export const saveOpportunityCriteria = async (formData: OpportunityFormData): Promise<void> => {
    await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${getUserId()}/v2`,
        formData,
        {
            headers: getAuthHeader(),
        }
    );
};

export const searchOpportunities = async (formData: OpportunityFormData): Promise<any> => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/search`,
        formData,
        {
            headers: getAuthHeader(),
        }
    );
    return response.data;
};

export const saveAndSearchOpportunities = async (formData: OpportunityFormData): Promise<{
    searchResults?: any;
    error?: string;
}> => {
    try {
        await saveOpportunityCriteria(formData);
        const searchResults = await searchOpportunities(formData);

        return { searchResults };
    } catch (error) {
        console.error('Opportunity operation failed:', error);
        return { error: 'Failed to save/search. Please try again.' };
    }
};

export const fetchCandidateSuggestions = async (): Promise<CandidateSuggestion[]> => {
    const response = await axios.get<CandidateSuggestion[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/candidates`
    );
    return response.data.map(candidate => ({
        ...candidate,
        skills: candidate.skills ?? [],
        totalMatchPercentage: 0
    }));
};

export const fetchSubmittedCandidates = async (opportunityId: string): Promise<CandidateSuggestion[]> => {
    const response = await axios.get<CandidateSuggestion[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/submitted`,
        { headers: getAuthHeader() }
    );
    return response.data.map(candidate => ({
        ...candidate,
        skills: candidate.skills ?? [],
        totalMatchPercentage: 0
    }));
};

export const fetchCandidateEnhancements = async (
    opportunityId: string,
    candidateId: string
): Promise<CandidateEnhancements> => {
    if (!opportunityId || opportunityId === "0" || opportunityId === "") {
        return {
            total_match_percentage: 0,
            is_starred: false,
            is_validated: false
        };
    }

    const response = await axios.get<CandidateEnhancements>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/${candidateId}/matching`
    );
    return response.data;
};

export const fetchCandidateEnhancementsForUser = async (
    userId: string,
    candidateId: string
): Promise<CandidateEnhancements> => {
    if (!userId || userId === "0" || userId === "") {
        return {
            total_match_percentage: 0,
            is_starred: false,
            is_validated: false
        };
    }

    const response = await axios.get<CandidateEnhancements>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${userId}/${candidateId}/matching`,
        { headers: getAuthHeader() }
    );
    return response.data;
};
export const fetchCandidatesWithMatchData = async (
    apiType: string,
    opportunityId?: string
): Promise<CandidateSuggestion[]> => {
    try {
        const candidates = apiType === "SUBMITTED" && opportunityId
            ? await fetchSubmittedCandidates(opportunityId)
            : await fetchCandidateSuggestions();

        const userId = getUserId() ?? "";

        const enhancedCandidates = await Promise.all(
            candidates.map(async candidate => {
                try {
                    const enhancements = opportunityId
                        ? await fetchCandidateEnhancements(opportunityId, candidate.user_id)
                        : await fetchCandidateEnhancementsForUser(userId, candidate.user_id);

                    return {
                        ...candidate,
                        totalMatchPercentage: Math.round(enhancements.total_match_percentage),
                        isStarred: enhancements.is_starred,
                        isValidated: enhancements.is_validated
                    };
                } catch (error) {
                    console.error(`Error fetching enhancements for candidate ${candidate.user_id}:`, error);
                    return {
                        ...candidate,
                        totalMatchPercentage: 0,
                        isStarred: false,
                        isValidated: false
                    };
                }
            })
        );

        return enhancedCandidates;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed to fetch candidates: " + error.message);
        } else {
            throw new Error("Failed to fetch candidates: An unknown error occurred.");
        }
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

export const validateCandidateInterest = async (
    opportunityId: string,
    userId: string
): Promise<void> => {
    await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/${userId}/validate`,
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
