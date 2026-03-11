import api from "@/shared/api";
import { AxiosError } from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { VerifyEmailResponse } from "../types";

export const useVerifyEmail = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const verifyEmail = async () => {
        if (!token) {
            setError("رمز التحقق مفقود");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await api.post<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
            setSuccess(true);
        } catch (err: unknown) {
            setSuccess(false);

            if (err instanceof AxiosError) {
                const message = err.response?.data.message || "حدث خطأ أثناء التحقق من البريد الإلكتروني";
                setError(message);
                return;
            }
            setError("حدث خطأ أثناء التحقق من البريد الإلكتروني");
        } finally {
            setLoading(false);
        }
    };

    return { verifyEmail, loading, error, success, token };
}