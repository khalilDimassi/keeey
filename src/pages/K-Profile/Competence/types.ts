export interface CompanyInfo {
    name: string;
    address: string;
    siret: string;
}

export interface UserData {
    gender: string;
    first_name: string;
    last_name: string;
    email: string;
    occupation: string;
    phone: string;
    address: string;
    zip: string;
}


export interface PersonalData {
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    gender: string;
    img: string;
    street: string;
    zip_code: string;
    city: string;
    birthdate: string;
    birthplace: string;
    driving_permit: string;
    nationality: string;
    linked_in: string;
    description: string;
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

export interface Certification {
    id: number;
    name: string;
    description: string;
    started_at: string;
    ended_at: string;
    present: boolean;
}

export interface Interest {
    id: number;
    name: string;
}

export interface Skill {
    id: number;
    name?: string;
    skill?: string;
    seniority: number;
}

export interface Job {
    id: number;
    name?: string;
    job?: string;
    skills: Skill[];
}

export interface Sector {
    id: number;
    name?: string;
    sector?: string;
    jobs: Job[];
}

export interface Project {
    id: number;
    name: string;
    description: string;
}

export interface Quality {
    id: number;
    name: string;
}

export interface Language {
    id: number;
    name: string;
    level: number;
}

export interface Authorization {
    id: number;
    name: string;
}

export interface Tool {
    id: number;
    name: string;
}

export interface ResumeData {
    personalInfo: PersonalData;
    trainings: Training[];
    experiences: Experience[];
    certifications: Certification[];
    interests: Interest[];
    sectors: Sector[];
    projects: Project[];
    qualities: Quality[];
    languages: Language[];
    authorizations: Authorization[];
    tools: Tool[];
}

export interface ApiResponse<T> {
    error?: string;
    status: number;

    profile?: T;
    user?: UserData;

    personal_info?: PersonalData;
    trainings?: Training[];
    experiences?: Experience[];
    certifications?: Certification[];
    interests?: Interest[];
    sectors?: Sector[];
    projects?: Project[];
    qualities?: Quality[];
    languages?: Language[];
    authorizations?: Authorization[];
    tools?: Tool[];
}

export type OpportunitiesSearchCriterias = {
    contract_roles?: string[];
    organization_roles?: string[];
    crit_daily_rate?: number;
    crit_yearly_rate?: number;
    crit_mobility?: string;
    crit_location?: string;
    crit_distance?: string;
    availability?: string;
};

export interface MinimalSector {
    id: number;
    seniority: number;
    jobs: {
        id: number;
        skills: number[];
    }[];
}

export interface TagsState {
    [key: string]: boolean;
}

export interface CriteriaFormData {
    location: string;
    contractTags: TagsState;
    companyTags: TagsState;
    mobility: TagsState;
    distanceValue: number;
    transportMode: string;
    availability: string;
    crit_daily_rate?: number;
    crit_yearly_rate?: number;
}

export interface ResumeSearchingDetails {
    selected_sectors: MinimalSector[];
    contract_roles?: string[];
    organization_roles?: string[];
    crit_daily_rate?: number;
    crit_yearly_rate?: number;
    crit_mobility?: string;
    crit_location?: string;
    crit_distance?: string;
    availability?: string;
}

export interface SectorSuggestionsResponse extends Array<Sector> { }