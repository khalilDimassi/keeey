import { getAuthHeader } from "../../../../../utils/jwt";
import { OpportunityBasicInfo, OpportunitySectors, OpportunityCriteria, OpportunityRequirements } from "../OpportunityDetailsKPlayer/types";
import axios from "axios";

export const createFullOpportunity = async (GeneralInformation: OpportunityBasicInfo | null, Skills: OpportunitySectors | null, Criterias: OpportunityCriteria | null, Requirements: OpportunityRequirements | null, Diffusion: any) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/new/v2`,
        { GeneralInformation, Criterias, Skills, Requirements, Diffusion },
        { headers: getAuthHeader() }
    );

    return response.data;
};