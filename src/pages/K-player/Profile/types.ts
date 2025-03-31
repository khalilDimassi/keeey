
export interface Profile {
    profile: {
        ID: string
        organiztion_id: number
        player_role: string
    }
    user: {
        ID: string
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