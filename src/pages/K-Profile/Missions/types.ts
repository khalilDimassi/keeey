export interface Mission {
    id: number;
    status: string;
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