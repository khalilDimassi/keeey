import axios from "axios";
import { getAuthHeader } from "../../../../utils/jwt";
import { contactFetch, contactCreate } from "./types";

export const loadContacts = async (type: string): Promise<[contactFetch[] | null, string | null]> => {
    try {
        const response = await axios.get<contactFetch[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${type}`,
            { headers: getAuthHeader() }
        );
        return [response.data, null];
    } catch (error) {
        console.error(error);
        return [null, 'Failed to load contacts: ' + (error instanceof Error ? error.message : String(error))];
    }
};

export const createContact = async (contact_role: string, data?: contactCreate) => {
    try {
        if (contact_role === "REFERRAL") {
            if (!data) {
                throw new Error("Missing referral data.");
            }
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/REFERRAL`,
                data,
                { headers: getAuthHeader() }
            );
        } else if (contact_role === "SPONSOR") {
            throw new Error("Sponsor contact submission not yet implemented.");
        } else {
            throw new Error("Invalid contact role");
        }
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message
            || error.message
            || "Erreur inconnue lors de l'ajout du contact.";

        console.error(errorMessage);
    }
};