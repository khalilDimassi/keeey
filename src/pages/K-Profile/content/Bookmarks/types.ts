export interface Opportunity {
    id: string;
    company: string;
    title: string;
    start_date: string;
    duration: string;
    location: string;
    enhancements: Enhancements | null;
    comment: string;
    status: OpportunityStatus;
}

export interface Enhancements {
    is_starred: boolean;
    is_validated: boolean;
    is_applied: boolean;
    is_saved: boolean;

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

export type OpportunityStatus =
    | "OPEN"
    | "PENDING"
    | "ACCEPTED"
    | "ONGOING"
    | "CONCLUDED"
    | "REJECTED"
    | "CLOSED"

export interface OpportunityUpdatePayload {
    status?: OpportunityStatus;
    comment?: string;
}