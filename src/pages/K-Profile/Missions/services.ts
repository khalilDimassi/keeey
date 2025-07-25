import { DetailedMission, Mission } from './types';
import axios from 'axios';

export const fetchMissionDetails = async (selectedMissionId: number) => {
    try {
        const response = await axios.get<DetailedMission>(`${import.meta.env.VITE_API_BASE_URL}/missions/${selectedMissionId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch mission details: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const fetchMissions = async () => {
    try {
        const response = await axios.get<Mission[]>(`${import.meta.env.VITE_API_BASE_URL}/missions`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch missions: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const addMission = async (mission: Omit<DetailedMission, 'id'>) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/missions`, mission);
    } catch (error) {
        throw new Error(`Failed to add mission: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const updateMission = async (mission: DetailedMission) => {
    try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/missions/${mission.id}`, mission);
    } catch (error) {
        throw new Error(`Failed to update mission: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const deleteMission = async (missionId: number) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/missions/${missionId}`);
    } catch (error) {
        throw new Error(`Failed to delete mission: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const requestInvoice = async (missionId: number) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/missions/${missionId}/invoice`);
    } catch (error) {
        throw new Error(`Failed to request invoice: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export const requestCRA = async (missionId: number) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/missions/${missionId}/cra`);
    } catch (error) {
        throw new Error(`Failed to request CRA: ${error instanceof Error ? error.message : String(error)}`);
    }
}