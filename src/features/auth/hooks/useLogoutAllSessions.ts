import { useMutation } from "@tanstack/react-query";
import i18n from "@/lib/i18n";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { logoutAll } from "../services";
import useAuthStore from "../store/auth";

export const useLogoutAllSessions = () => {
    const navigate = useNavigate();
    const { removeAccessToken } = useAuthStore();

    return useMutation({
        mutationFn: logoutAll,
        onSuccess: () => {
            toast.success(i18n.t("auth.sessions.logoutAllSuccess"), {
                style: successToastStyle,
            });
            removeAccessToken();
            useAuthStore.persist.clearStorage();
            navigate("/");
        },
        onError: () => {
            toast.error(i18n.t("auth.sessions.logoutAllFailed"), {
                style: errorToastStyle,
            });
        },
    });
};
