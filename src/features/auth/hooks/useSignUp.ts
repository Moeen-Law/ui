import { useState } from "react";
import type { SignUpResponse, SignUpValues } from "../types";
import api from "@/shared/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { authService } from "../helpers";
import i18n from "@/lib/i18n";

export const useSignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    

    const handleSignUp = async (data: SignUpValues) => {
        try {
            setLoading(true);
            await api.post<SignUpResponse>(`${authService}/auth/register`, {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            toast.success(i18n.t("toast.signupSuccess"), { style: successToastStyle });
            

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

    return { loading, handleSignUp }
}