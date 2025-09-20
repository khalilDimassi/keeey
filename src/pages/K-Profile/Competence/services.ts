import axios from 'axios';
import { getAuthHeader, getGuestToken, loadGuestData, saveGuestData, saveGuestToken } from '../../../utils/jwt';
import { ApiResponse, ApiUserResponse, GuestData, MinimalSector, OpportunitiesSearchCriterias, ResumeData, ResumeSearchingDetails, SectorSuggestionsResponse } from './types';
import { useState, useEffect } from 'react';
import { BaseMatchPercentages } from '../Bookmarks/types';

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
			console.info('Saving image:', { imageData, cropData });
			resolve({ success: true, url: imageData });
		}, 1000);
	});
};

export interface GuestSessionResponse {
	matchings: Array<{
		opportunity_id: number;
		matching_result: BaseMatchPercentages;
	}>;
	token: string;
	id: string;
	created_at: string;
	expire_at: string;
}

export const fetchUpdateGuestData = async (): Promise<GuestData> => {
	try {
		const stored = loadGuestData();

		const response = await axios.post<GuestData>(
			`${API_BASE_URL}/api/v1/public/session-data`,
			{
				resume: stored.resume ?? {},
				profile: stored.profile ?? {},
			},
			{ headers: getGuestToken() }
		);

		if (
			response.data.token &&
			response.data.token !== getGuestToken()["Authorization"].split(" ")[1]
		) {
			console.info("Guest token refreshed:", response.data.token);
			saveGuestToken(response.data.token);
		}

		const merged: GuestData = {
			resume: stored.resume ?? { sectors: [], languages: [], authorizations: [], tools: [], qualities: [] },
			profile: stored.profile ?? {
				contract_roles: [],
				organization_roles: [],
				crit_daily_rate: 0,
				crit_yearly_rate: 0,
				crit_mobility: "",
				crit_location: "",
				crit_distance: "",
				availability: "IMMEDIATE",
			},
			token: response.data.token,
			id: response.data.id,
			created_at: response.data.created_at,
			expire_at: response.data.expire_at,
		};

		// Save only local fields back to storage
		saveGuestData({ resume: merged.resume, profile: merged.profile });

		return merged;
	} catch (err) {
		console.error("Failed to fetch guest data:", err);
		throw err;
	}
};

export const updateGuestData = async () => {
	try {
		const data = loadGuestData();

		const response = await axios.put<GuestData>(
			`${API_BASE_URL}/api/v1/public/session-data`,
			{
				resume: data.resume ?? {},
				profile: data.profile ?? {},
			},
			{ headers: getGuestToken() }
		);


		if (
			response.data.token &&
			response.data.token !== getGuestToken()["Authorization"].split(" ")[1]
		) {
			console.info("Guest token refreshed:", response.data.token);
			saveGuestToken(response.data.token);
		}

		const merged: GuestData = {
			resume: data.resume ?? { sectors: [], languages: [], authorizations: [], tools: [], qualities: [] },
			profile: data.profile ?? {
				contract_roles: [],
				organization_roles: [],
				crit_daily_rate: 0,
				crit_yearly_rate: 0,
				crit_mobility: "",
				crit_location: "",
				crit_distance: "",
				availability: "IMMEDIATE",
			},
			token: response.data.token,
			id: response.data.id,
			created_at: response.data.created_at,
			expire_at: response.data.expire_at,
		};

		// Save only local fields back to storage
		saveGuestData({ resume: merged.resume, profile: merged.profile });

		return merged;
	} catch (err) {
		console.error("Failed to update guest data:", err);
		throw err;
	}
}

export const fetchGuestMatches = async (): Promise<GuestSessionResponse> => {
	try {
		const stored = loadGuestData();

		const response = await axios.post<GuestSessionResponse>(
			`${API_BASE_URL}/api/v1/public/session-data`,
			{
				resume: stored.resume ?? {},
				profile: stored.profile ?? {},
			},
			{ headers: getGuestToken() }
		);

		return response.data;
	} catch (error) {
		console.error('Failed to fetch guest matches:', error);
		throw error;
	}
}