import { CandidateSuggestion, MatchPercentages, EnhancedCandidate, Sector, StarredCandidates, OpportunityBasicInfo } from "./types";
import { getAuthHeader, getUserId } from "../../../../../utils/jwt";

import axios from "axios";

const fetchCandidateSuggestions = async (): Promise<CandidateSuggestion[]> => {
    const response = await axios.get<CandidateSuggestion[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/candidates`
    );
    return response.data.map(candidate => ({
        ...candidate,
        skills: candidate.skills ?? [],
        totalMatchPercentage: 0
    }));
};

const fetchSubmittedCandidates = async (opportunityId: string): Promise<CandidateSuggestion[]> => {
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

const fetchStarredCandidates = async (opportunityId: string): Promise<StarredCandidates[]> => {
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

const fetchCandidateMatchPercentage = async (
    opportunityId: string,
    candidateId: string
): Promise<MatchPercentages | null> => {
    if (!opportunityId || opportunityId === "0" || opportunityId === "") return null;

    const response = await axios.get<MatchPercentages>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/${candidateId}/matching`
    );
    return response.data;
};

const fetchCandidateMatchPercentageForUser = async (userId: string, candidateId: string): Promise<MatchPercentages | null> => {
    if (!userId || userId === "0" || userId === "") return null;

    const response = await axios.get<MatchPercentages>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${userId}/${candidateId}/matching`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const fetchCandidatesWithMatchData = async (apiType: string, opportunityId?: string): Promise<EnhancedCandidate[]> => {
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

export const fetchSectors = async (): Promise<Sector[]> => {
    const response = await axios.get<Sector[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
    );
    return response.data;
};

export const validateCandidateInterest = async (opportunityId: string, userId: string): Promise<void> => {
    await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/${userId}/validate`,
        {},
        { headers: getAuthHeader() }
    );
};

export const removeCandidateStar = async (opportunityId: string, userId: string): Promise<void> => {
    await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/${userId}/star`,
        {},
        { headers: getAuthHeader() }
    );
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