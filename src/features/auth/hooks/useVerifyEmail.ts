import api from "@/shared/api";
import { AxiosError } from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { VerifyEmailResponse } from "../types";
import { authService } from "../helpers";
import i18n from "@/lib/i18n";

export const useVerifyEmail = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const verifyEmail = async () => {
        if (!token) {
            setError(i18n.t("auth.verifyTokenMissing"));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await api.post<VerifyEmailResponse>(`${authService}/auth/verify-email?token=${token}`);
            setSuccess(true);
        } catch (err: unknown) {
            setSuccess(false);

            if (err instanceof AxiosError) {
                const message = err.response?.data.message || i18n.t("auth.verifyError");
                setError(message);
                return;
            }
            setError(i18n.t("auth.verifyError"));
        } finally {
            setLoading(false);
        }
    };

    return { verifyEmail, loading, error, success, token };
}