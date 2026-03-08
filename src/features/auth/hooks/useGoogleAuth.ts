import api from "@/shared/api";
import { errorToastStyle } from "@/shared/constants";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import type { GoogleResponse } from "../types";



export const useGoogleAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleGoogleAuth = async () => {
        try {
            setLoading(true);
            const response = await api.get<GoogleResponse>("/auth/google");
            const { url } = response.data;
            window.location.href = url;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "something went wrong!", { style: errorToastStyle });
                return;
            }
            toast.error("something went wrong!", { style: errorToastStyle });
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        handleGoogleAuth
    }
}