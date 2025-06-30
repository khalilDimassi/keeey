import { getAuthHeader, isAuthenticated } from "../../../../../../utils/jwt";
import { InterestedKPlayer, KPlayerListItem, MatchPercentages, OpportunityListItem } from "./types";
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

export const fetchInterestedKplayers = async (): Promise<KPlayerListItem[]> => {
    try {
        if (!isAuthenticated()) {
            return [];
        }

        const response = await axios.get<InterestedKPlayer[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/interested-clients`,
            {
                headers: {
                    ...getAuthHeader()
                }
            }
        );

        // Transform the data to only include what we need
        return response.data?.map(item => ({
            id: item.KPlayer.ID,
            organizationId: item.KPlayer.organization_id,
            role: item.KPlayer.player_role,
            firstName: item.User.first_name,
            lastName: item.User.last_name,
            email: item.User.email,
            phone: item.User.phone,
            gender: item.User.gender,
            occupation: item.User.occupation,
            createdAt: item.User.created_at
        })) || [];

    } catch (error) {
        console.error("Failed to fetch interested KPlayers:", error);
        return [];
    }
};
