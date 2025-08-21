import { getAuthHeader } from '../../../utils/jwt';
import { DetailedMission, Mission } from './types';
import axios from 'axios';

export const fetchMissionDetails = async (selectedMissionId: number) => {
    try {
        const response = await axios.get<DetailedMission>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions/${selectedMissionId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch mission details: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const fetchMissions = async () => {
    try {
        const response = await axios.get<Mission[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch missions: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const addMission = async (mission: Omit<DetailedMission, 'id'>) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions`, mission, { headers: getAuthHeader() });
    } catch (error) {
        throw new Error(`Failed to add mission: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const updateMission = async (mission: DetailedMission) => {
    try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions/${mission.id}`, mission, { headers: getAuthHeader() });
    } catch (error) {
        throw new Error(`Failed to update mission: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const deleteMission = async (missionId: number) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions/${missionId}`, { headers: getAuthHeader() });
    } catch (error) {
        throw new Error(`Failed to delete mission: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const requestInvoice = async (missionId: number) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions/${missionId}/requests/invoice`, { headers: getAuthHeader() });
    } catch (error) {
        throw new Error(`Failed to request invoice: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const requestCRA = async (missionId: number) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/missions/${missionId}/requests/cra`, { headers: getAuthHeader() });
    } catch (error) {
        throw new Error(`Failed to request CRA: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const fetchContacts = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch contacts: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const fetchCompanies = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/companies/names`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch companies: ${error instanceof Error ? error.message : String(error)}`);
    }
}