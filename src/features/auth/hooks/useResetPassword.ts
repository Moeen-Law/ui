import { useState } from "react";
import type { ResetPasswordValues } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/shared/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { errorToastStyle } from "@/shared/constants";
import { authService } from "../helpers";



export const useResetPassword = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");



    const resetPassword = async (data: ResetPasswordValues) => {
        try {
            setIsVerifying(true);
            setIsError(false);
            setIsSuccess(false);

            await api.patch(`${authService}/auth/password/reset`, {
                token,
                newPassword: data.password,
            });
            setIsSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(`خطأ اثناء تغيير كلمة المرور (${error.response?.status})`, { style: errorToastStyle });
                console.log(error.response?.data);
            } else {
                toast.error("حدث خطأ أثناء تغيير كلمة المرور", { style: errorToastStyle });
            }
            setIsError(true);
        } finally {
            setIsVerifying(false);
        }
    };


    return {
        isVerifying,
        isError,
        isSuccess,
        resetPassword,
    };
}