import { getAuthHeader } from '../../../../utils/jwt';
import { ApiResponse, MinimalSector, OpportunitiesSearchCriterias, ResumeData, ResumeSearchingDetails, SectorSuggestionsResponse, UserData } from './types';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserData = async (): Promise<UserData> => {
    try {
        const response = await axios.get<ApiResponse<{ user: UserData }>>(
            `${API_BASE_URL}/api/v1/private/profile`,
            { headers: getAuthHeader() }
        );

        if (response.data?.user) {
            return response.data.user;
        }
        throw new Error('No user data received');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Failed to load profile data');
        }
        throw new Error('Failed to load profile data');
    }
}

export const updateUserData = async (formData: UserData): Promise<void> => {
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
            `${API_BASE_URL}/api/v1/private/resume/v2`,
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
                title: resumeData.personal_info?.title || '',
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
        `${API_BASE_URL}/api/v1/private/resume/skill/v4`,
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