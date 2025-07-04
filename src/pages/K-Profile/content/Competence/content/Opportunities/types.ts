export interface OpportunityListItem {
    opportunity_id: number,
    title: string,
    created_at: string,
    contract_roles: string[],
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

export interface OpportunityCompetences {
    sectors: string[];
    jobs: string[];
    languages: string[];
    tools: string[];
    qualities: string[];
}

export interface Opportunity {
    opportunity_id: number;
    user_id: string;
    title: string;
    description: string;
    context: string;
    mission: string;
    candidate_profile: string;
    rate: number;
    responded_at: string;
    start_at: string;
    announce_at: string;
    contract_roles: string[];
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

export interface KPlayer {
    ID: string;
    organization_id: number;
    player_role: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    ID: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_role: string;
    gender: string;
    occupation: string;
    created_at: string;
    updated_at: string;
}

export interface InterestedKPlayer {
    KPlayer: KPlayer;
    User: User;
}

export interface KPlayerListItem {
    id: string;
    organizationId: number;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    occupation: string;
    createdAt: string;
}