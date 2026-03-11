import { useState } from "react";
import type { ResetPasswordValues } from "../types";
import { useNavigate } from "react-router-dom";
import api from "@/shared/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { errorToastStyle } from "@/shared/constants";



export const useResetPassword = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    


    const resetPassword = async (data: ResetPasswordValues) => {
        try {
            setIsVerifying(true);
            setIsError(false);
            setIsSuccess(false);

            await api.post("/auth/reset-password", {
                confirmPassword: data.confirmPassword,
                password: data.password,
            });
            navigate("/login");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(`خطأ اثناء ارسال رابط تغيير كلمة المرور (${error.response?.status})`, { style: errorToastStyle });
            } else {
                toast.error("حدث خطأ أثناء تغيير كلمة المرور", { style: errorToastStyle });
            }
            return false;
        }
    };


    return {
        isVerifying,
        isError,
        isSuccess,
        resetPassword,
    };
}