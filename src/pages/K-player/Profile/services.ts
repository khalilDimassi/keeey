import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";
import { Profile, Organization } from "./types";


export const FetchProfile = async (): Promise<Profile> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch profile data: " + (error instanceof Error ? error.message : String(error)));
    }
};


export const FetchOrg = async (): Promise<Organization> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/organization`,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );

        return response.data;
    } catch (error) {
        if (error instanceof Error && /^[12]:/.test(error.message)) {
            throw error;
        }
        throw new Error(`3: Failed to fetch organization data: ${error instanceof Error ? error.message : String(error)}`);
    }
};



export const UpdateKplayerProfile = async (data: Partial<Profile['user']>) => {
    try {
        await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`,
            data,
            {
                headers: {
                    ...getAuthHeader(),
                },
            }
        );
    } catch (error) {
        throw new Error("3: Failed to update profile data: " + (error instanceof Error ? error.message : String(error)));
    }
}