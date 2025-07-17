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