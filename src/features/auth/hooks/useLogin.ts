import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse, LoginValues } from "../types";
import api from "@/shared/api";
import { toast } from "sonner";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { AxiosError } from "axios";
import useAuthStore from "../store/auth";


export const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setAccessToken  } = useAuthStore();

    const handleLogin = async (data: LoginValues) => {
        setLoading(true);
        try {
            const response = await api.post<LoginResponse>("/auth/login", data);
            toast.success("Login successful!", { style: successToastStyle });
            setAccessToken(response.data.accessToken);
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message, { style: errorToastStyle });
                return
            }
            toast.error("Something went wrong", { style: errorToastStyle });

        }
        finally {
            setLoading(false);
        }
    }

    return { handleLogin, loading }
}