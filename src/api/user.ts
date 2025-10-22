import { apiFetch } from "../utils/api";

interface PasswordData {
  currentPassword?: string;
  newPassword?: string;
}

interface EmailOtpData {
  otp: string;
}

interface NewEmailData {
  newEmail: string;
}

interface ConfirmEmailChangeData {
  newEmail: string;
  otp: string;
}

export const verifyPassword = async (data: { currentPassword: string }) => {
  try {
    return await apiFetch("/api/account/verify-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (data: PasswordData) => {
  try {
    return await apiFetch("/api/account/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw error;
  }
};

export const requestEmailChangeOtp = async () => {
  try {
    return await apiFetch("/api/account/email-change/request", {
      method: "POST",
    });
  } catch (error: any) {
    throw error;
  }
};

export const verifyCurrentEmailOtp = async (data: EmailOtpData) => {
  try {
    return await apiFetch("/api/account/email-change/verify-current", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw error;
  }
};

export const sendNewEmailOtp = async (data: NewEmailData) => {
  try {
    return await apiFetch("/api/account/email-change/send-new-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw error;
  }
};

export const confirmEmailChange = async (data: ConfirmEmailChangeData) => {
  try {
    return await apiFetch("/api/account/email-change/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw error;
  }
};
