export interface OpportunityListItem {
    opportunity_id: number,
    title: string,
    created_at: string,
    contract_role: string,
    description: string,
    crit_location: string,
    crit_remote: boolean,
    matching: MatchPercentages | null,
    is_saved: boolean,
    is_applied: boolean
}

export interface MatchPercentages {
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

export interface Opportunity {
    opportunity_id: number;
    user_id: string;
    title: string;
    description: string;
    rate: number;
    responded_at: string;
    start_at: string;
    announce_at: string;
    contract_role: string;
    opportunity_role: string;
    status: string;
    satisfaction: number;
    duration: number;
    crit_start_date: string;
    crit_start_date_lastest: string;
    crit_forecast_date: string;
    crit_forecast_date_lastest: string;
    crit_location: string;
    crit_remote: boolean;
    crit_target_rate: number;
    crit_max_rate: number;
    created_at: string;
    updated_at: string;
}