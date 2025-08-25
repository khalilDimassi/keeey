import { getAuthHeader } from "../../../utils/jwt";
import { contact, contactRole } from "./types";

import axios from "axios";

export const fetchContacts = async () => {
    try {
        const response = await axios.get<contact[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch contacts: ' + (error instanceof Error ? error.message : String(error)));
    }
};

export const addContact = async (contact_role: contactRole, data?: contact) => {
    try {
        if (!data) {
            throw new Error("Missing referral data.");
        } else if (contact_role !== "INTERNAL-CONTACT" && contact_role !== "EXTERNAL-CONTACT" && contact_role !== "CONSULTANT") {
            throw new Error("Invalid contact role");
        }

        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contact_role}`,
            data,
            { headers: getAuthHeader() }
        );
        if (response.data.message.includes("User already exists")) {
            alert("L'adresse e-mail du contact existe déjà dans la base de données. Lien création avec les données d'origine. Contact ajouté dans la liste de references.");
        }
    } catch (error: any) {
        throw error || new Error("Failed to create contact: " + (error instanceof Error ? error.message : String(error)));
    }
};

export const updateContact = async (id: number, data: contact) => {
    try {
        const response = await axios.put<contact>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${id}`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to update contact: ' + (error instanceof Error ? error.message : String(error)));
    }
}

export const deleteContact = async (id: number) => {
    try {
        const response = await axios.delete<contact>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${id}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete contact: ' + (error instanceof Error ? error.message : String(error)));
    }
};