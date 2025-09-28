import { OpportunityFormData } from "../content/OpportunityDetailsKPlayer/types";

export interface GuestOpportunity extends OpportunityFormData {
    id: number
    created_at: string
    expire_at: string
}