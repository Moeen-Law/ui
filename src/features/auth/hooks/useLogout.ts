import api from "@/shared/api";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "../store/auth";


export const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { removeAccessToken } = useAuthStore();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await api.post("/auth/logout");
            toast.success("تم تسجيل الخروج بنجاح", { style: successToastStyle });
            removeAccessToken();
            useAuthStore.persist.clearStorage();
            navigate("/");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "حدث خطأ ما", { style: errorToastStyle });
                return;
            }
            toast.error("حدث خطأ ما", { style: errorToastStyle });
        }
        finally {
            setLoading(false);
        }
    }

    return { loading, handleLogout }
}