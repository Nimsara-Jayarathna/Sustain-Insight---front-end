import { apiFetch } from '../utils/api';

// --- Type Definition ---
interface PasswordData {
  currentPassword?: string;
  newPassword?: string;
}

// --- NEW FUNCTION for verification ---
export const verifyPassword = async (passwordData: { currentPassword: string }) => {
  try {
    const response = await apiFetch('/api/account/verify-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

// --- EXISTING FUNCTION for changing the password ---
export const changePassword = async (passwordData: PasswordData) => {
  try {
    const response = await apiFetch('/api/account/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};
