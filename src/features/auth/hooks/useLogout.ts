import api from "@/shared/api";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "../store/auth";
import { authService } from "../helpers";
import i18n from "@/lib/i18n";


export const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { removeAccessToken } = useAuthStore();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await api.post(`${authService}/auth/logout`);
            toast.success(i18n.t("toast.logoutSuccess"), { style: successToastStyle });
            removeAccessToken();
            useAuthStore.persist.clearStorage();
            navigate("/");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || i18n.t("toast.logoutFailed"), { style: errorToastStyle });
                return;
            }
            toast.error(i18n.t("toast.logoutFailed"), { style: errorToastStyle });
        }
        finally {
            setLoading(false);
        }
    }

    return { loading, handleLogout }
}