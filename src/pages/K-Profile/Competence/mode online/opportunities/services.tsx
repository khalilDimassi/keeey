import { MatchPercentages, OpportunityListItem } from "./types";
import { getAuthHeader, isAuthenticated } from "../../../../../utils/jwt";
import axios, { AxiosResponse } from "axios";


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

        for (const opportunity of response.data) {
            try {
                if (opportunity.opportunity_id && opportunity.opportunity_id != 0) {
                    const matchResponse = await axios.get<MatchPercentages>(
                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity.opportunity_id}/${candidateID}/matching`
                    );

                    opportunity.matching = matchResponse.data ?? null;
                } else {
                    opportunity.matching = null
                }

            } catch (error) {
                console.error(`Error fetching match percentages for opportunity ${opportunity.opportunity_id}:`, error);
            }
        }

        return response.data ?? [];
    } catch (error) {
        console.error("Failed to fetch opportunities list:", error);
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