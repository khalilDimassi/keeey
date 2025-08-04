export type OpportunityStatus =
    | "OPEN"
    | "PENDING"
    | "ACCEPTED"
    | "ONGOING"
    | "CONCLUDED"
    | "REJECTED"
    | "CLOSED";

export type OpportunityTabs =
    | "ALL"
    | "CONTACTS"
    | "CLIENTS"
    | "INTERACTED";

// Base match percentage interface to avoid repetition
export interface BaseMatchPercentages {
    total_match_percentage: number;
    jobs_match_percentage: number;
    seniority_match_percentage: number;
    availability_match_percentage: number;
    rate_match_percentage: number;
    mobility_match_percentage: number;
    languages_match_percentage: number;
    tools_match_percentage: number;
    authorizations_match_percentage: number;
    qualities_match_percentage: number;
}

export interface Enhancements extends BaseMatchPercentages {
    kprofile_id: string;
    status: OpportunityStatus;
    is_starred: boolean;
    is_validated: boolean;
    is_applied: boolean;
    is_saved: boolean;
}

export interface OpportunityCompetences {
    sectors: string[];
    jobs: string[];
    languages: string[];
    tools: string[];
    qualities: string[];
}

// Common opportunity properties
export interface OpportunityBase {
    opportunity_id: number;
    title: string;
    description: string;
    contract_roles: string[];
    crit_location: string;
    crit_remote: boolean;
    created_at: string;
    client_id: string;
    contact_id: number;
    enhancements: Enhancements | null;
}

export interface Opportunity extends OpportunityBase, OpportunityCompetences {
    user_id: string;
    organization: string;
    context: string;
    mission: string;
    candidate_profile: string;
    rate: number;
    responded_at: string;
    start_at: string;
    announce_at: string;
    opportunity_role: string;
    status: OpportunityStatus;
    satisfaction: number;
    duration: number;
    crit_start_date: string;
    crit_start_date_lastest: string;
    crit_forecast_date: string;
    crit_forecast_date_lastest: string;
    crit_target_rate: number;
    crit_max_rate: number;
    updated_at: string;

    company?: string;
    comment?: string;
};