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

export const guestContactsExamples: contactFetch[] = [
    {
        ID: 1,
        user_id: "guest",
        status: "Actif",
        is_request_sent: false,
        role: "REFERRAL",
        gender: "male",
        last_name: "Dupont",
        first_name: "Jean",
        occupation: "Développeur Web",
        company: "Freelance",
        email: "jean.dupont@example.com",
        phone: "+33 6 12 34 56 78",
        note: "Disponible pour des missions courtes.",
        recommendation: "Travail soigné et rapide.",
        nbrProjects: 3,
        nbrMissions: 5,
        nbrDays: 60,
        satisfaction: 92,
    },
    {
        ID: 2,
        user_id: "guest",
        status: "En attente",
        is_request_sent: true,
        role: "REFERRAL",
        gender: "female",
        last_name: "Martin",
        first_name: "Sophie",
        occupation: "Consultante RH",
        company: "RH Conseil",
        email: "sophie.martin@example.com",
        phone: "+33 6 98 76 54 32",
        note: "Disponible à partir du mois prochain.",
        recommendation: "Excellente communicatrice.",
        nbrProjects: 5,
        nbrMissions: 2,
        nbrDays: 30,
        satisfaction: 88,
    },
    {
        ID: 3,
        user_id: "guest",
        status: "Actif",
        is_request_sent: false,
        role: "SPONSOR",
        gender: "male",
        last_name: "Benali",
        first_name: "Karim",
        occupation: "Chef de Projet",
        company: "TechTunisie",
        email: "karim.benali@example.com",
        phone: "+216 22 123 456",
        note: "Peut parrainer de nouveaux consultants.",
        recommendation: "Leader expérimenté.",
        nbrProjects: 8,
        nbrMissions: 10,
        nbrDays: 120,
        satisfaction: 95,
    },
];
