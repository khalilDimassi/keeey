import { getAuthHeader, getUserId, isAuthenticated } from "../../../utils/jwt";

import axios from "axios";
import { alertesSettings, confidalitySettings, PasswordChangePayload } from "./types";


export const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('All fields are required');
  }
  if (newPassword !== confirmPassword) {
    throw new Error('New password and confirmation do not match');
  }
  if (newPassword === currentPassword) {
    throw new Error('New password must be different from current password');
  }
  try {
    const payload: PasswordChangePayload = {
      current_password: currentPassword,
      new_password: newPassword,
    };
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/password`,
      payload,
      { headers: getAuthHeader() }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while changing password');
  }
};

export const loadAlertesSettings = async (): Promise<alertesSettings> => {
  try {
    const response = await axios.get<alertesSettings>(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/alertes-settings`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while loading alertes settings');
  }
}

export const updateAlertesSettings = async (data: alertesSettings): Promise<void> => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/alertes-settings`,
      data,
      { headers: getAuthHeader() }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while updating alertes settings');
  }
}

export const loadConfidalitySettings = async (): Promise<confidalitySettings> => {
  try {
    const response = await axios.get<confidalitySettings>(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/confidality-settings`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while loading confidality settings');
  }
}

export const updateConfidalitySettings = async (data: confidalitySettings): Promise<void> => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/confidality-settings`,
      data,
      { headers: getAuthHeader() }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while updating confidality settings');
  }
}

export const sendSupportTicket = async (subject: string, content: string): Promise<void> => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/support-tickets`,
      { subject, content, user_id: (isAuthenticated() ? getUserId() : null), source: 'REGISTRED K-PROFILE' },
      { headers: getAuthHeader() }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while sending support ticket');
  }
}