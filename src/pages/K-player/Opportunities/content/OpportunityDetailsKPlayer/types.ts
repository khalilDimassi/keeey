export interface Skill {
    id: number;
    Name: string;
    seniority: number;
}

export interface Job {
    id: number;
    Name: string;
    skills: Skill[];
}

export interface Sector {
    id: number;
    Name: string;
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

export interface StarredCandidates {
    user_id: string;
    first_name: string;
    last_name: string;
    occupation: string;
    status: string;
    matching_scores: MatchPercentages;
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
    availability_match_percentage: number;
    rate_match_percentage: number;
    mobility_match_percentage: number;
    languages_match_percentage: number;
    tools_match_percentage: number;
    authorizations_match_percentage: number;
    qualities_match_percentage: number;
}

export interface EnhancedCandidate extends CandidateSuggestion {
    occupation?: string;
    status?: string;
    matching_scores?: MatchPercentages;
}


export interface OpportunityBasicInfo {
    title: string;
    announce_at: string;
    responded_at: string;
    start_at: string;
    duration: number;
    rate: number;
    description?: string;
    context?: string,
    mission?: string,
    candidat_profile?: string,
    certainty?: string,
    operational_manager?: string,
    status?: string,
    reference?: string,
    satisfaction?: number,
}

export interface MinimalSector {
    id: number;
    seniority: number;
    jobs: {
        id: number;
        skills: number[];
    }[];
}


export interface OpportunitySectors {
    selected_sectors: MinimalSector[];
}

export interface OpportunityCriteria {
    contract_roles: string[];
    opportunity_role?: string
    crit_start_date: string;
    crit_start_date_lastest: string;
    crit_duration: number;
    crit_duration_lastest: number;
    crit_target_rate: number;
    crit_max_rate: number;
    crit_location: string;
    crit_remote: boolean;
}

export interface OpportunityRequirements {
    tools: string[];
    authorizations: string[];
    languages: string[];
    qualities: string[];
}

export interface OpportunityFormData extends
    OpportunityBasicInfo,
    OpportunitySectors,
    OpportunityCriteria,
    OpportunityRequirements { }

