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

export type missionStatus =
    | "ONGOING"
    | "COMPLETED";

export interface Mission {
    id: number;
    status: missionStatus;
    company: string;
    contact: string;
    title: string;
    start: string;
    end: string;
    rate: string;
    satisfaction: number;
}

export interface Invoice {
    id: number;
    status: string;
    year: string;
    month: string;
    days: number;
    costs: number;
    description: string;
    gap: number;
    amountHT: number;
}

export interface DetailedMission extends Mission {
    invoices: Invoice[];
}

export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    status: contactStatus
}

export interface Company {
    id: number;
    name: string;
}