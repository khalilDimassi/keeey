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

export interface CandidateJob {
    job: string;
    seniority: number;
}

export interface CandidateSector {
    sector_name: string;
    seniority: number;
    job_names: string[];
}

export interface Language {
    id: number;
    name: string;
}

export interface Tool {
    id: number;
    name: string;
}

export interface Quality {
    id: number;
    name: string;
}

export interface Training {
    id: number;
    name: string;
    description: string;
    organization: string;
    city: string;
    started_at: string;
    ended_at: string;
    present: boolean;
}

export interface Experience {
    id: number;
    title: string;
    description: string;
    employer: string;
    city: string;
    started_at: string;
    ended_at: string;
    present: boolean;
}


export interface Candidate {
    user_id: string;
    first_name: string;
    last_name: string;
    city: string;
    occupation: string;
    organization: string;
    years_experience: number;
    description: string;
    trainings: Training[];
    experiences: Experience[];
    contracts: string[];
    availability: string;
    tjm: number;
    salary: number;
    location: string;
    mobility: string;
    remote: boolean;
    sectors: CandidateSector[];
    languages: Language[];
    tools: Tool[];
    qualities: Quality[];

    calculatedExperience?: {
        sum: number;
        max: number;
    };
}

export interface CandidateSuggestion {
    user_id: string;
    first_name: string;
    last_name: string;
    rating: number;
    availability: string;
    jobs: CandidateJob[] | null;
    matching?: CandidateEnhancements;
    isStarred?: boolean;
    isValidated?: boolean;
}


export interface CandidateEnhancements {
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

    is_starred: boolean;
    is_validated: boolean;
}