import { Opportunity, Enhancements, OpportunityBase, OpportunityCompetences } from './types';
import { getAuthHeader, getUserId, isAuthenticated } from '../../../utils/jwt';
import axios, { AxiosResponse } from 'axios';


export const fetchOpportunitiesEnhancements = async (opportunity_id: number): Promise<Enhancements> => {
    try {
        const User_id = getUserId();

        const response: AxiosResponse<Enhancements> = await axios.get<Enhancements>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity_id}/${User_id}/matching`);
        return response.data;
    } catch (error) {
        console.error('Error fetching opportunities enhancements:', error);
        throw error;
    }
};

export const fetchOpportunities = async (): Promise<OpportunityBase[]> => {
    try {
        const response: AxiosResponse<OpportunityBase[]> = await axios.get<OpportunityBase[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/list`, {
            headers: { ...getAuthHeader() },
        });

        if (isAuthenticated()) {
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].enhancements = await fetchOpportunitiesEnhancements(response.data[i].opportunity_id);
            }
        }

        response.data.sort((a, b) => b.enhancements?.total_match_percentage! - a.enhancements?.total_match_percentage!);

        return response.data;
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
    }
};

export const fetchOpportunityDetails = async (opportunity_id: number): Promise<Opportunity> => {
    try {
        const details: AxiosResponse<Opportunity> = await axios.get<Opportunity>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity_id}`);
        const competences: AxiosResponse<OpportunityCompetences> = await axios.get<OpportunityCompetences>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity_id}/skills`);

        details.data.sectors = competences.data.sectors;
        details.data.jobs = competences.data.jobs;
        details.data.languages = competences.data.languages;
        details.data.tools = competences.data.tools;
        details.data.qualities = competences.data.qualities;

        return details.data;
    } catch (error) {
        console.error('Error fetching opportunity details:', error);
        throw error;
    }
}

export const saveOpportunity = async (opportunity_id: number) => {
    try {
        await axios.post<Opportunity>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}/submit?state=save`, null,
            {
                headers: { ...getAuthHeader() },
            });
    } catch (error) {
        console.error('Error saving opportunity:', error);
        throw error;
    }
};

export const applyOpportunity = async (opportunity_id: number) => {
    try {
        await axios.post<Opportunity>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}/submit?state=apply`, null, {
            headers: { ...getAuthHeader() },
        });
    } catch (error) {
        console.error('Error applying opportunity:', error);
        throw error;
    }
};