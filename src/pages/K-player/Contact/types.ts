export type contactRole =
    | "INTERNAL-CONTACT"
    | "EXTERNAL-CONTACT"
    | "CONSULTANT";

export type contactStatus =
    | "REGISTERED"
    | "NOT-REGISTERED"
    | "CONTACTED"
    | "ACCEPTED"
    | "REJECTED"
    | "IN-MISSION"
    | "MISSION-HK"
    | "SEARCHING"
    | "ARCHIVE";

export interface contact {
    id: number;
    gender: string;
    first_name: string;
    last_name: string;
    occupation: string;
    company: string;
    email: string;
    phone: string;
    ongoing_projects: number;
    role: contactRole;
    status: contactStatus;
}

