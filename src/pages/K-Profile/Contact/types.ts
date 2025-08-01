export interface contactFetch {
    ID: number;
    user_id: string;
    status: string;
    is_request_sent: boolean;
    role: string;
    gender: string;
    last_name: string;
    first_name: string;
    occupation: string;
    company: string;
    email: string;
    phone: string;
    note: string;
    recommendation: string;
    nbrProjects: number;
    nbrMissions: number;
    nbrDays: number;
    satisfaction: number;
}

export interface contactCreate {
    gender: string;
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    occupation: string;
    phone?: string;
    notes?: string;
    request_reference?: boolean;
}