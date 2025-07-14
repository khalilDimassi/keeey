import { Opportunity, OpportunityUpdatePayload, Enhancements } from './types';
import { getAuthHeader, getUserId } from '../../../utils/jwt';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/v1/private";

export const fetchCandidateMatchPercentage = async (
    opportunityId: number,
    userId: string
): Promise<Enhancements | null> => {
    if (!opportunityId || opportunityId === 0) return null;

    const response = await axios.get<Enhancements>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/${userId}/matching`
    );
    return response.data;
};


export const fetchOpportunities = async (): Promise<Opportunity[]> => {
    try {
        const response = await axios.get<Opportunity[]>(`${API_BASE_URL}/opportunities/saved-opportunities`
            , { headers: { ...getAuthHeader() } }
        );

        if (response.data.length == 0) {
            return [];
        }

        const userId = await getUserId();

        for (let index = 0; index < response.data.length; index++) {
            const opportunity = response.data[index];
            try {
                if (userId) {
                    const enhancements = await fetchCandidateMatchPercentage(opportunity.id, userId);
                    response.data[index].enhancements = enhancements;
                }
            } catch (error) {
                console.error(error);
            }
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(error.response.data);
        }
        throw new Error('An unknown error occurred while fetching opportunities');
    }
};

export const fetchOpportunityDetails = async (id: number): Promise<Opportunity> => {
    try {
        const response = await axios.get<Opportunity>(`${API_BASE_URL}/opportunities/${id}`,
            { headers: { ...getAuthHeader() } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(error.response.data);
        }
        throw new Error('An unknown error occurred while fetching opportunity details');
    }
};

export const updateOpportunityStatus = async (id: number, payload: OpportunityUpdatePayload): Promise<Opportunity> => {
    try {
        const response = await axios.patch<Opportunity>(
            `${API_BASE_URL}/opportunities/${id}/status`,
            payload,
            { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(error.response.data);
        }
        throw new Error('An unknown error occurred while updating opportunity status');
    }
};

export const deleteOpportunity = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/opportunities/${id}`
            , { headers: { ...getAuthHeader() } }
        );
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(error.response.data);
        }
        throw new Error('An unknown error occurred while deleting opportunity');
    }
};

export const submitOpportunity = async (id: number): Promise<Opportunity> => {
    try {
        const response = await axios.put<Opportunity>(`${API_BASE_URL}/opportunities/${id}/submit`
            , {}, { headers: { ...getAuthHeader() } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(error.response.data);
        }
        throw new Error('An unknown error occurred while submitting opportunity');
    }
}; 