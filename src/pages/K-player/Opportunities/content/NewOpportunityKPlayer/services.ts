import { OpportunityBasicInfo, OpportunitySectors, OpportunityCriteria, OpportunityRequirements } from "../OpportunityDetailsKPlayer/types";

export const createFullOpportunity = async (generalIndormation: OpportunityBasicInfo | null, skills: OpportunitySectors | null, criterias: OpportunityCriteria | null, requirements: OpportunityRequirements | null, diffusion: any) => {
    const response = await fetch('http://localhost:3000/kplayer/opportunities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            general_indormation: generalIndormation,
            skills: skills,
            criterias: criterias,
            requirements: requirements,
            diffusion: diffusion,
        }),
    });
    return response.json();
};