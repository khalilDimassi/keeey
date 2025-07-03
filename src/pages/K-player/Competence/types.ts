
export interface OpportunityFormData {
    selected_sectors: MinimalSector[];
    contract_roles: string[];
    crit_start_date: string;
    crit_start_date_lastest: string;
    crit_duration: number;
    crit_duration_lastest: number;
    crit_target_rate: number;
    crit_max_rate: number;
    crit_location: string;
    crit_remote: boolean;
    tools: string[];
    authorizations: string[];
    languages: string[];
    qualities: string[];
}

export interface MinimalSector {
    id: number;
    seniority: number;
    jobs: {
        id: number;
        skills: number[];
    }[];
}

export interface Skill {
    id: number;
    Name?: string;
    skill?: string;
    seniority: number;
}

export interface Job {
    id: number;
    Name?: string;
    job?: string;
    skills: Skill[];
}

export interface Sector {
    id: number;
    Name?: string;
    sector?: string;
    jobs: Job[];
}

export interface CandidateSkill {
    skill: string;
    seniority: number;
}

export interface CandidateSuggestion {
    user_id: string;
    first_name: string;
    last_name: string;
    rating: number;
    availability: string;
    skills: CandidateSkill[] | null;
    totalMatchPercentage?: number;
    isStarred?: boolean;
    isValidated?: boolean;
}

export interface MatchPercentages {
    total_match_percentage: number;
    skills_match_percentage: number;
    seniority_match_percentage: number;
    jobs_match_percentage: number;
    sectors_match_percentage: number;
    availability_match_percentage: number;
    rate_match_percentage: number;
    mobility_match_percentage: number;
    languages_match_percentage: number;
    tools_match_percentage: number;
    authorizations_match_percentage: number;
    qualities_match_percentage: number;
}

export interface CandidateEnhancements {
    total_match_percentage: number;
    is_starred: boolean;
    is_validated: boolean;
}