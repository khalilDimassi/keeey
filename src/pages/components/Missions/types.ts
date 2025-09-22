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
    id?: number;
    mission_id: number;
    status: missionStatus;
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



// examples
// Example mission
export const exampleMission: Mission = {
    id: 1,
    status: "ONGOING",
    company: "TechCorp",
    contact: "John Doe",
    title: "Backend Developer",
    start: "2025-01-01",
    end: "2025-06-30",
    rate: "500€/day",
    satisfaction: 4,
};

// Example invoice
export const exampleInvoice: Invoice = {
    id: 101,
    mission_id: 1,
    status: "COMPLETED",
    year: "2025",
    month: "05",
    days: 20,
    costs: 200,
    description: "May development work",
    gap: 2,
    amountHT: 10000,
};

// Example detailed mission
export const exampleDetailedMission: DetailedMission = {
    ...exampleMission,
    invoices: [exampleInvoice],
};

// Example contact
export const exampleContact: Contact = {
    id: 10,
    first_name: "Alice",
    last_name: "Smith",
    status: "REGISTERED",
};

// Example company
export const exampleCompany: Company = {
    id: 5,
    name: "TechCorp",
};
