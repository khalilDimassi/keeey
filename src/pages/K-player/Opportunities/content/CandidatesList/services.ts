// opportunityServices.ts
import axios from 'axios';
import { CandidateEnhancements, CandidateSuggestion } from './types';
import { getAuthHeader, getUserId } from '../../../../../utils/jwt';

export const fetchCandidateSuggestions = async (): Promise<CandidateSuggestion[]> => {
  const response = await axios.get<CandidateSuggestion[]>(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/candidates`
  );
  return response.data.map(candidate => ({
    ...candidate,
    jobs: candidate.jobs ?? [],
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
    jobs: candidate.jobs ?? [],
    totalMatchPercentage: 0
  }));
};

export const fetchCandidateEnhancements = async (opportunityId: string, candidateId: string): Promise<CandidateEnhancements> => {
  if (!opportunityId || opportunityId === "0" || opportunityId === "") {
    return {
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
      is_starred: false,
      is_validated: false,
    };
  }

  const response = await axios.get<CandidateEnhancements>(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/${candidateId}/matching`
  );
  return response.data;
};

export const fetchCandidateEnhancementsForUser = async (userId: string, candidateId: string): Promise<CandidateEnhancements> => {
  if (!userId || userId === "0" || userId === "") {
    return {
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
      is_starred: false,
      is_validated: false,
    };
  }

  const response = await axios.get<CandidateEnhancements>(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${userId}/${candidateId}/matching`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const fetchCandidatesWithMatchData = async (apiType: string, opportunityId?: string): Promise<CandidateSuggestion[]> => {
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
            matching: enhancements
          };
        } catch (error) {
          console.error(`Error fetching enhancements for candidate ${candidate.user_id}:`, error);
          return {
            ...candidate,
            matching: {
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
              is_starred: false,
              is_validated: false,
            }
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

export const starCandidate = async (opportunityId: string, userId: string): Promise<void> => {
  await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/${userId}/star`,
    {},
    { headers: getAuthHeader() }
  );
};

export const validateCandidateInterest = async (opportunityId: string, userId: string): Promise<void> => {
  await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/candidates/${userId}/validate`,
    {},
    { headers: getAuthHeader() }
  );
};

export const updateCandidateStatus = (candidates: CandidateSuggestion[], userId: string, updates: Partial<CandidateSuggestion>): CandidateSuggestion[] => {
  return candidates.map(candidate =>
    candidate.user_id === userId
      ? { ...candidate, ...updates }
      : candidate
  );
};


// --------------- Guest Services ---------------