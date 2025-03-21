import { OpportunityListItem } from "./types";
import { getAuthHeader } from "../../../../../utils/jwt";
import axios from "axios";


export const fetchOpportunitiesList = async (): Promise<OpportunityListItem[]> => {
    try {
        const response = await axios.get<OpportunityListItem[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/list`
        );

        return response.data ?? [];
    } catch (error) {
        console.error("Failed to fetch opportunities list:", error);
        // Optionally, show an error message to the user
        return [];
    }
};

export const fetchSavedOpportunityIds = async (): Promise<number[]> => {
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
            console.log("Successfully saved opportunity:", opportunityId);
            // Optionally, update the UI or show a success message
        }
    } catch (error) {
        console.error("Failed to save opportunity:", error);
        // Optionally, show an error message to the user
    }
};