import axios, { AxiosResponse } from 'axios';
import { getAuthHeader, isAuthenticated } from '../../../utils/jwt';
import { ApiResponse, ApiUserResponse, MatchPercentages, MinimalSector, OpportunitiesSearchCriterias, Opportunity, OpportunityCompetences, OpportunityListItem, ResumeData, ResumeSearchingDetails, SectorSuggestionsResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserData = async (): Promise<ApiUserResponse> => {
    try {
        const response = await axios.get<ApiUserResponse>(
            `${API_BASE_URL}/api/v1/private/profile`,
            { headers: getAuthHeader() }
        );

        if (response.data) {
            if (response.data) {
                return response.data;
            }
            throw new Error('No user data received');
        }
        throw new Error('No user data received');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to load profile data'
            );
        }
        throw new Error('Failed to load profile data');
    }
}
export const updateUserData = async (formData: ApiUserResponse): Promise<void> => {
    try {
        const response = await axios.put<ApiResponse<void>>(
            `${API_BASE_URL}/api/v1/private/user-data`,
            formData,
            { headers: getAuthHeader() }
        );

        if (response.data.error) {
            throw new Error(response.data.error);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Failed to update profile');
        }
        throw new Error('Failed to update profile');
    }
}

export const fetchResumeData = async (): Promise<ResumeData> => {
    try {
        const response = await axios.get<ApiResponse<ResumeData>>(
            `${API_BASE_URL}/api/v1/private/resume/v3`,
            { headers: getAuthHeader() }
        );

        if (!response.data) {
            throw new Error('No resume data received');
        }

        const resumeData = response.data;
        return {
            personalInfo: {
                first_name: resumeData.personal_info?.first_name || '',
                last_name: resumeData.personal_info?.last_name || '',
                occupation: resumeData.personal_info?.occupation || '',
                email: resumeData.personal_info?.email || '',
                verified: resumeData.personal_info?.verified || false,
                phone: resumeData.personal_info?.phone || '',
                gender: resumeData.personal_info?.gender || '',
                img: resumeData.personal_info?.img || '',
                street: resumeData.personal_info?.street || '',
                zip_code: resumeData.personal_info?.zip_code || '',
                city: resumeData.personal_info?.city || '',
                birthdate: resumeData.personal_info?.birthdate || '',
                birthplace: resumeData.personal_info?.birthplace || '',
                driving_permit: resumeData.personal_info?.driving_permit || '',
                nationality: resumeData.personal_info?.nationality || '',
                linkedin: resumeData.personal_info?.linkedin || '',
                description: resumeData.personal_info?.description || '',
            },
            trainings: resumeData.trainings || [],
            experiences: resumeData.experiences || [],
            certifications: resumeData.certifications || [],
            interests: resumeData.interests || [],
            sectors: resumeData.sectors || [],
            projects: resumeData.projects || [],
            qualities: resumeData.qualities || [],
            languages: resumeData.languages || [],
            authorizations: resumeData.authorizations || [],
            tools: resumeData.tools || [],
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Failed to fetch resume data');
        }
        throw new Error('Failed to fetch resume data');
    }
}

export const fetchSectors = async (): Promise<SectorSuggestionsResponse> => {
    try {
        const response = await axios.get<SectorSuggestionsResponse>(
            `${API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch sectors:', error);
        throw new Error('Failed to fetch sectors. Please try again later.');
    }
};

export const fetchResumeSearchDetails = async (): Promise<ResumeSearchingDetails> => {
    try {
        const response = await axios.get<ResumeSearchingDetails>(
            `${API_BASE_URL}/api/v1/private/resume/search-criteria`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch resume search details:', error);
        throw error;
    }
};

export const saveSectors = async (selections: MinimalSector[]): Promise<void> => {
    await axios.put(
        `${API_BASE_URL}/api/v1/private/resume/skill/v5`,
        selections,
        {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
        }
    );
};

export const saveCriteria = async (criteria: OpportunitiesSearchCriterias): Promise<void> => {
    await axios.put(
        `${API_BASE_URL}/api/v1/private/resume/search-criteria`,
        criteria,
        {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            }
        }
    );
};

export const saveProfileImage = async (imageData: any, cropData: any) => {
    // Placeholder service call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Saving image:', { imageData, cropData });
            resolve({ success: true, url: imageData });
        }, 1000);
    });
};


export const fetchOpportunitiesList = async (candidateID?: string): Promise<OpportunityListItem[]> => {
    try {
        var response: AxiosResponse<OpportunityListItem[], any>
        if (isAuthenticated()) {
            response = await axios.get<OpportunityListItem[]>(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/list`,
                {
                    headers: {
                        ...getAuthHeader()
                    }
                }
            );
        } else {
            response = await axios.get<OpportunityListItem[]>(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/list`
            );
        }

        const data = response.data ?? [];
        const processedOpportunities = [];
        for (let i = 0; i < data.length; i++) {
            const opportunity = data[i];
            try {
                if (opportunity.opportunity_id && opportunity.opportunity_id != 0) {
                    const matchResponse = await axios.get<MatchPercentages>(
                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity.opportunity_id}/${candidateID}/matching`
                    );
                    opportunity.matching = matchResponse.data ?? null;
                } else {
                    opportunity.matching = null;
                }
                processedOpportunities.push(opportunity);
            } catch (error) {
                console.error(`Error fetching match percentages for opportunity ${opportunity.opportunity_id}:`, error);
                opportunity.matching = null;
                processedOpportunities.push(opportunity);
            }
        }

        // Then sort by matching percentage (highest first)
        processedOpportunities.sort((a, b) => {
            const aPercent = a.matching?.total_match_percentage || 0;
            const bPercent = b.matching?.total_match_percentage || 0;
            return bPercent - aPercent;
        });

        return processedOpportunities ?? [];
    } catch (error) {
        console.error("Failed to fetch opportunities list:", error);
        return [];
    }
};

export const fetchSavedOpportunityIds = async (): Promise<number[]> => {
    if (!isAuthenticated()) {
        return []
    }
    try {
        const response = await axios.get<number[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/saved-opportunities`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        return response.data ?? [];
    } catch (error) {
        console.error("Failed to saved opportunities id:", error);
        // Optionally, show an error message to the user 
        return []
    }
}

export const submitToOpportunity = async (opportunityId: number) => {
    if (!isAuthenticated()) {
        return
    }
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/submit?state=apply`,
            {},
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        if (response.status === 200) {
            console.log("Successfully submitted to opportunity:", opportunityId);
            // Optionally, update the UI or show a success message
        }
    } catch (error) {
        console.error("Failed to submit to opportunity:", error);
        // Optionally, show an error message to the user
    }
};

export const saveOpportunity = async (opportunityId: number) => {
    if (!isAuthenticated()) {
        return
    }
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/submit?state=save`,
            {},
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        if (response.status === 200) {
            // Optionally, update the UI or show a success message
        }
    } catch (error) {
        // Optionally, show an error message to the user
    }
};

export const fetchOpportunityDetails = async (opportunityId: number): Promise<Opportunity> => {
    const response = await axios.get<Opportunity>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}`
    );
    return response.data;
};

export const fetchOpportunityCompetences = async (opportunityId: number): Promise<OpportunityCompetences> => {
    const response = await axios.get<OpportunityCompetences>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/skills`
    );
    return response.data;
};