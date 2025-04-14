import axios from "axios";
import { getAuthHeader, getUserId } from "../../../utils/jwt";
import { CandidateSuggestion, EnhancedCandidate, MatchPercentages, Opportunity, OpportunityBasicInfo, OpportunityFormData, Sector, StarredCandidates } from "./types";

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

export const submitOpportunity = async (formData: OpportunityFormData) => {
    try {
        const payload = {

            title: formData.title,
            announce_at: formData.announce_date,
            responded_at: formData.response_date,
            start_at: formData.startDate,
            duration: formData.duration || 0,
            rate: formData.rate || 0,
            opportunity_role: "REQUIREMENT",
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

export const fetchStarredCandidates = async (opportunityId: string): Promise<StarredCandidates[]> => {
    const response = await axios.get<StarredCandidates[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/starred`,
        { headers: getAuthHeader() }
    );
    if (response.data === null) {
        return [];
    }
    return response.data.map(candidate => ({
        ...candidate
    }));
};

export const fetchCandidateMatchPercentage = async (
    opportunityId: string,
    candidateId: string
): Promise<MatchPercentages | null> => {
    if (!opportunityId || opportunityId === "0" || opportunityId === "") return null;

    const response = await axios.get<MatchPercentages>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/${candidateId}/matching`
    );
    return response.data;
};

export const fetchCandidateMatchPercentageForUser = async (
    userId: string,
    candidateId: string
): Promise<MatchPercentages | null> => {
    if (!userId || userId === "0" || userId === "") return null;

    const response = await axios.get<MatchPercentages>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${userId}/${candidateId}/matching`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const fetchCandidatesWithMatchData = async (
    apiType: string,
    opportunityId?: string
): Promise<EnhancedCandidate[]> => {
    try {
        let candidates: CandidateSuggestion[] | StarredCandidates[];

        switch (apiType) {
            case "SUBMITTED":
                candidates = await fetchSubmittedCandidates(opportunityId ?? "");
                break;
            case "STARRED":
                candidates = await fetchStarredCandidates(opportunityId ?? "");
                break;
            default:
                candidates = await fetchCandidateSuggestions();
                break;
        }
        const userId = getUserId() ?? "";

        const enhancedCandidates = await Promise.all(
            candidates.map(async candidate => {
                const baseCandidate: Omit<EnhancedCandidate, 'totalMatchPercentage'> = {
                    user_id: candidate.user_id,
                    first_name: candidate.first_name,
                    last_name: candidate.last_name,
                    rating: 0,
                    availability: "",
                    skills: [],
                    ...(apiType === "STARRED" && {
                        occupation: (candidate as StarredCandidates).occupation,
                        status: (candidate as StarredCandidates).status,
                        matching_scores: (candidate as StarredCandidates).matching_scores,
                        rating: 0,
                        availability: "",
                        skills: [],
                    }),
                    ...(apiType !== "STARRED" && {
                        rating: (candidate as CandidateSuggestion).rating ?? 0,
                        availability: (candidate as CandidateSuggestion).availability,
                        skills: (candidate as CandidateSuggestion).skills ?? [],
                    }),
                };
                try {

                    const DEFAULT_MATCH_PERCENTAGES = {
                        total_match_percentage: 0,
                        skills_match_percentage: 0,
                        seniority_match_percentage: 0,
                        jobs_match_percentage: 0,
                        sectors_match_percentage: 0,
                        availability_match_percentage: 0,
                        rate_match_percentage: 0,
                        mobility_match_percentage: 0,
                        languages_match_percentage: 0,
                        tools_match_percentage: 0,
                        authorizations_match_percentage: 0,
                        qualities_match_percentage: 0,
                    }

                    let matchPercentages: MatchPercentages = { ...DEFAULT_MATCH_PERCENTAGES };

                    switch (apiType) {
                        case "STARRED":
                            if (opportunityId !== undefined) {
                                matchPercentages = await fetchCandidateMatchPercentage(opportunityId, candidate.user_id) ?? { ...DEFAULT_MATCH_PERCENTAGES };
                            }
                            break;
                        case "SUBMITTED":
                            if (opportunityId !== undefined) {
                                matchPercentages = await fetchCandidateMatchPercentage(opportunityId, candidate.user_id) ?? { ...DEFAULT_MATCH_PERCENTAGES };
                            }
                            break;
                        default:
                            matchPercentages = await fetchCandidateMatchPercentageForUser(userId, candidate.user_id) ?? { ...DEFAULT_MATCH_PERCENTAGES };
                            break;
                    }
                    return {
                        ...baseCandidate,
                        totalMatchPercentage: matchPercentages.total_match_percentage ?? 0,
                        matching_scores: matchPercentages,
                        rating: baseCandidate.rating ?? 0
                    };
                } catch (error) {
                    console.error(`Error fetching match for candidate ${candidate.user_id}:`, error);
                    return {
                        user_id: candidate.user_id,
                        first_name: candidate.first_name,
                        last_name: candidate.last_name,
                        rating: 0,
                        availability: "",
                        skills: [],
                        totalMatchPercentage: 0,
                        ...(apiType === "STARRED" && {
                            occupation: (candidate as StarredCandidates).occupation,
                            status: (candidate as StarredCandidates).status,
                            matching_scores: (candidate as StarredCandidates).matching_scores
                        })
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

export const fetchSectors = async (): Promise<Sector[]> => {
    const response = await axios.get<Sector[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
    );
    return response.data;
};

export const updateOpportunityBasicInfo = async (updatePayload: Partial<OpportunityBasicInfo>, opportunity_id: string) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}/v2`,
            updatePayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Failed updating opportunity General Information: " + error.message);
        } else {
            throw new Error("Failed updating opportunity General Information: An unknown error occurred.");
        }
    }
};