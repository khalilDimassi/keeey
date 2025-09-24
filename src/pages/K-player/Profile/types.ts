export type Role = "ADMIN" | "REGULAR" | "-"

export interface Profile {
    profile: {
        ID: string
        player_role: Role
    }
    user: {
        ID: string
        organiztion_id: number
        first_name: string
        last_name: string
        phone: string
        email: string
        gender: string
        occupation: string
        pfp: string
    }
}

export interface Organization {
    ID: number
    name: string
    sector: string
    address: string
    effective: string
    siret: string
    role: string
    img: string
}

export interface OrgMember {
    ID: string
    first_name: string
    last_name: string
    email: string
    phone: string
    gender: string
    occupation: string
    pfp: string
    email_verified: boolean
}


// GUEST -- 
export const fakeProfile: Profile = {
    profile: {
        ID: "cb6e25d8-0d4e-4bbd-b7c5-5b75b89289dc",
        player_role: "REGULAR" as Role,
    },
    user: {
        ID: "cb6e25d8-0d4e-4bbd-b7c5-5b75b89289dc",
        organiztion_id: 999,
        first_name: "Jean",
        last_name: "Dupont",
        phone: "+33 6 12 34 56 78",
        email: "jean.dupont@example.fr",
        gender: "Homme",
        occupation: "Développeur Web",
        pfp: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
};

export const fakeOrg: Organization = {
    ID: 1,
    name: "Entreprise Innovante",
    sector: "Technologie",
    address: "12 Rue de la République, Paris",
    effective: "45 employés",
    siret: "123 456 789 00012",
    role: "Membre",
    img: "https://placehold.co/200x100?text=Logo+Entreprise",
};

export const fakeMembers: OrgMember[] = [
    {
        ID: "m1",
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@example.fr",
        phone: "+33 6 12 34 56 78",
        gender: "male",
        occupation: "Développeur Web",
        pfp: "https://randomuser.me/api/portraits/men/32.jpg",
        email_verified: true,
    },
    {
        ID: "m2",
        first_name: "Claire",
        last_name: "Martin",
        email: "claire.martin@example.fr",
        phone: "+33 6 98 76 54 32",
        gender: "female",
        occupation: "Designer UX",
        pfp: "https://randomuser.me/api/portraits/women/45.jpg",
        email_verified: false,
    },
    {
        ID: "m3",
        first_name: "Antoine",
        last_name: "Bernard",
        email: "antoine.bernard@example.fr",
        phone: "+33 7 22 33 44 55",
        gender: "male",
        occupation: "Chef de projet (Admin)",
        pfp: "https://randomuser.me/api/portraits/men/12.jpg",
        email_verified: true,
    },
];