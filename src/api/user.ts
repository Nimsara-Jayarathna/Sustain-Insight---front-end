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
    return apiFetch("/api/account/verify-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
};

export const changePassword = async (data: PasswordData) => {
    return apiFetch("/api/account/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
};

export const requestEmailChangeOtp = async () => {
    return apiFetch("/api/account/email-change/request", {
      method: "POST",
    });
};

export const verifyCurrentEmailOtp = async (data: EmailOtpData) => {
    return apiFetch("/api/account/email-change/verify-current", {
      method: "POST",
      body: JSON.stringify(data),
    });
};

export const sendNewEmailOtp = async (data: NewEmailData) => {
    return apiFetch("/api/account/email-change/send-new-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
};

export const confirmEmailChange = async (data: ConfirmEmailChangeData) => {
    return apiFetch<{ token?: string; email?: string }>("/api/account/email-change/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
};
