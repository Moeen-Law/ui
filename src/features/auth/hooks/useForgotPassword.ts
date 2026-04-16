import api from "@/shared/api";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import type { ForgotPasswordResponse } from "../types";
import { toast } from "sonner";
import { successToastStyle, errorToastStyle } from "@/shared/constants";
import { authService } from "../helpers";
import i18n from "@/lib/i18n";

const COOLDOWN_KEY = "forgot-password-cooldown";
const COOLDOWN_SECONDS = 90;

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    
    useEffect(() => {
        const savedTime = localStorage.getItem(COOLDOWN_KEY);
        if (savedTime) {
            const timeLeft = Math.ceil((parseInt(savedTime) - Date.now()) / 1000);
            if (timeLeft > 0) {
                setCooldown(timeLeft);
            } else {
                localStorage.removeItem(COOLDOWN_KEY);
            }
        }
    }, []);

    
    useEffect(() => {
        if (cooldown <= 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    localStorage.removeItem(COOLDOWN_KEY);
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);
 
    const forgotPassword = async (email: string) => {
        if (cooldown > 0) return;

        try {
            setLoading(true);
            await api.post<ForgotPasswordResponse>(`${authService}/auth/password/forgot`, { email });

            toast.success(i18n.t("toast.forgotPasswordSuccess"), { style: successToastStyle });

            // Set cooldown
            const expiryTime = Date.now() + COOLDOWN_SECONDS * 1000;
            localStorage.setItem(COOLDOWN_KEY, expiryTime.toString());
            setCooldown(COOLDOWN_SECONDS);

            return true;
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(i18n.t("toast.forgotPasswordFailedStatus", { status: err.response?.status }), { style: errorToastStyle });
                console.log(err.response?.data);
            } else {
                toast.error(i18n.t("toast.resetPasswordFailed"), { style: errorToastStyle });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    
    return { loading ,forgotPassword ,cooldown};
};