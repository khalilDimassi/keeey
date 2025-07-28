import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";
import { contactFetch, contactCreate } from "./types";

export const loadContacts = async (): Promise<[contactFetch[] | null, string | null]> => {
    try {
        const response = await axios.get<contactFetch[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts`,
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
        if (!data) {
            throw new Error("Missing referral data.");
        }
        if (contact_role === "REFERRAL" || contact_role === "SPONSOR") {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contact_role}`,
                data,
                { headers: getAuthHeader() }
            );
        } else {
            throw new Error("Invalid contact role");
        }
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message
            || error.message
            || "Erreur inconnue lors de l'ajout du contact.";

        return errorMessage;
    }
};

export const updateContact = async (contact_id: number, data?: contactFetch) => {
    try {
        if (contact_id !== 0 && contact_id) {
            if (!data) {
                throw new Error("Missing referral data.");
            }
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contact_id}`,
                data,
                { headers: getAuthHeader() }
            );
        } else {
            throw new Error("Invalid contact id");
        }
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message
            || error.message
            || "Erreur inconnue lors de la mise à jour du contact.";

        return errorMessage;
    }
};

export const deleteContact = async (contact_id: number) => {
    try {
        if (contact_id !== 0 && contact_id) {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contact_id}`,
                { headers: getAuthHeader() }
            );
        } else {
            throw new Error("Invalid contact id");
        }
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message
            || error.message
            || "Erreur inconnue lors de la suppression du contact.";

        return errorMessage;
    }
};