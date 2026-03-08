import { useState } from "react";
import type { SignUpResponse, SignUpValues } from "../types";
import api from "@/shared/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { errorToastStyle , successToastStyle } from "@/shared/constants";

export const useSignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSignUp = async (data: SignUpValues) => {
        try {
            setLoading(true);
            const response = await api.post<SignUpResponse>("/auth/register", {
                name: data.name,
                firstName: "moeen",
                lastName: "moeen",
                email: data.email,
                password: data.password, 
            });
            toast.success(response?.data?.message || "Registration successful!" , {style: successToastStyle});
            navigate("/");

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message , {style: errorToastStyle});
                return
            }
            toast.error("Something went wrong" , {style: errorToastStyle});

        }
        finally {
            setLoading(false);
        }
    }

    return { loading , handleSignUp }
}