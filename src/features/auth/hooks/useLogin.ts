import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse, LoginValues } from "../types";
import api from "@/shared/api";
import { toast } from "sonner";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { AxiosError } from "axios";
import useAuthStore from "../store/auth";
import { authService } from "../helpers";
import i18n from "@/lib/i18n";


export const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setAccessToken  } = useAuthStore();

    const handleLogin = async (data: LoginValues) => {
        setLoading(true);
        try {
            const response = await api.post<LoginResponse>(`${authService}/auth/login`, data);
            toast.success(i18n.t("toast.loginSuccess"), { style: successToastStyle });
            setAccessToken(response.data.accessToken);
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || i18n.t("toast.defaultError"), { style: errorToastStyle });
                return
            }
            toast.error(i18n.t("toast.defaultError"), { style: errorToastStyle });

        }
        finally {
            setLoading(false);
        }
    }

    return { handleLogin, loading }
}