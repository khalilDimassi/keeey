export type contactRole = "INTERNAL-CONTACT" | "EXTERNAL-CONTACT";

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
}

