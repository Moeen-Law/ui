import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "@/lib/i18n";
import { errorToastStyle, successToastStyle } from "@/shared/constants";
import { toast } from "sonner";
import { sessionLogout } from "../services";
import { userSessionKeys } from "./useUserSessions";

export const useLogoutSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sessionLogout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userSessionKeys.all });
            toast.success(i18n.t("auth.sessions.logoutSessionSuccess"), {
                style: successToastStyle,
            });
        },
        onError: () => {
            toast.error(i18n.t("auth.sessions.logoutSessionFailed"), {
                style: errorToastStyle,
            });
        },
    });
};
