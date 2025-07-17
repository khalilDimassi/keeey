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

export const addContact = async (role: contactRole, data: contact) => {
    try {
        const response = await axios.post<contact>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${role}`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to add contact: ' + (error instanceof Error ? error.message : String(error)));
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