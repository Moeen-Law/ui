import { useState } from "react";
import type { SignUpResponse, SignUpValues } from "../types";
import api from "@/shared/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { errorToastStyle, successToastStyle } from "@/shared/constants";

export const useSignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignUp = async (data: SignUpValues) => {
        try {
            setLoading(true);
            const response = await api.post<SignUpResponse>("/auth/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            toast.success("تم التسجيل بنجاح برجاء انتظار التحقق من البريد الالكتروني", { style: successToastStyle });
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "حدث خطأ", { style: errorToastStyle });
                return
            }
            toast.error("حدث خطأ", { style: errorToastStyle });

        }
        finally {
            setLoading(false);
        }
    }

    return { loading, handleSignUp }
}