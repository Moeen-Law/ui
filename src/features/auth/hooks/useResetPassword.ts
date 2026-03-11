import { useState } from "react";
import type { ResetPasswordValues } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/shared/api";



export const useResetPassword = () => {
    const [isVerifying, setIsVerifying] = useState(true);
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

            await api.post("/auth/reset-password", {
                token,
                password: data.password,
            });
            
        } catch (error) {
            
        }
    };
}