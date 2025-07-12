export interface CompanyInfo {
    name: string;
    address: string;
    siret: string;
}

export interface ProfileData {
    id?: string;
    title?: string;
    description?: string;
    nationality?: string;
    birthplace?: string;
    birthdate?: string;
    driving_permit?: string;
    fr_work_permit?: string;
    linked_in?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserData {
    ID?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    user_role?: string;
    gender?: string;
    occupation?: string;
    address?: string;
    city?: string;
    zip?: string;
    email_verified?: boolean;
    verification_token?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiUserResponse {
    profile: ProfileData;
    user: UserData;
}


export interface PersonalData {
    first_name: string;
    last_name: string;
    occupation: string;
    email: string;
    verified: boolean;
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
    linkedin: string;
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

export interface Namedsectors {
    sector: string;
    seniority: number;
    jobs: {
        job: string;
        skills: string[];
    }[];
}

export interface ResumeData {
    personalInfo: PersonalData;
    trainings: Training[];
    experiences: Experience[];
    certifications: Certification[];
    interests: Interest[];
    sectors: Namedsectors[];
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
    sectors?: Namedsectors[];
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
    crit_daily_rate: number;
    crit_yearly_rate: number;
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