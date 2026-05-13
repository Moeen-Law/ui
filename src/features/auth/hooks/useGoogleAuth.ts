import api from "@/shared/api";
import { errorToastStyle } from "@/shared/constants";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import type { GoogleResponse } from "../types";
import { authService } from "../helpers";
import i18n from "@/lib/i18n";
import { useSearchParams } from "react-router-dom";
import { AUTH_REDIRECT_STORAGE_KEY, getSafeRedirectTarget } from "../helpers/redirect";



export const useGoogleAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    const handleGoogleAuth = async () => {
        try { 
            setLoading(true);
            const redirectTarget = getSafeRedirectTarget(searchParams.get("redirect"));
            if (redirectTarget !== "/") {
                sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, redirectTarget);
            } else {
                sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
            }
            const response = await api.get<GoogleResponse>(`${authService}/auth/google`);
            const { url } = response.data;
            window.location.href = url;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || i18n.t("toast.defaultError"), { style: errorToastStyle });
                return;
            }
            toast.error(i18n.t("toast.defaultError"), { style: errorToastStyle });
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        handleGoogleAuth
    }
}
