import { OpportunityFormData } from "./content/OpportunityDetailsKPlayer/types";

export interface KProfile {
    first_name: string;
    last_name: string;
    user_id: string;
}

export interface Opportunity {
    id: number;
    opportunity_id: number;
    title: string;
    reference: string;
    start_at: string;
    status: string;
    opportunity_role: string;

    first_name: string;
    last_name: string;
    user_id: string;
    kprofiles: KProfile[];
    date: string;
    participants: string[];
    source: string;
}

export interface MatchPercentages {
    status?: string;
    is_applied?: boolean;
    is_saved?: boolean;
    is_starred?: boolean;
    is_validated?: boolean;
    total_match_percentage: number;
    skills_match_percentage: number;
    seniority_match_percentage: number;
    jobs_match_percentage: number;
    sectors_match_percentage: number;
    contract_role_match_percentage?: number;
    organization_role_match_percentage?: number;
    availability_match_percentage: number;
    rate_match_percentage: number;
    mobility_match_percentage: number;
    languages_match_percentage?: number;
    tools_match_percentage?: number;
    authorizations_match_percentage?: number;
    qualities_match_percentage?: number;
}

export interface GuestOpportunity extends OpportunityFormData {
    id: number
    created_at: string
    expire_at: string
}

export interface GuestOpportunitySession {
    matchings: Array<{ opportunity_id: number, candidate_id: string; matching_result: MatchPercentages }>;
    created_at: string;
    expire_at: string;
}

export interface GuestOpportunitySessionResponse {
    token: string;
    data: GuestOpportunitySession
}
