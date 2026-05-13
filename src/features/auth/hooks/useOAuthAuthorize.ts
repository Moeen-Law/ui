import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/auth";
import { useEffect, useState } from "react";
import { AUTH_REDIRECT_STORAGE_KEY, getSafeRedirectTarget } from "../helpers/redirect";


export const useOAuthAuthorize = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
    const { setAccessToken } = useAuthStore();
    
    const success = searchParams.get("success");
    const accessToken = searchParams.get("access_token");
    
    useEffect(() => {
        if (success === null && !accessToken) {
            navigate("/", { replace: true });
            return;
        }

        const processAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (success === "true" || accessToken) {
                if (accessToken) {
                    setAccessToken(accessToken);
                }
                setStatus("success");
                const redirectTarget = getSafeRedirectTarget(
                    sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY)
                );
                sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
                setTimeout(() => navigate(redirectTarget), 3000);
            } else {
                setStatus("error");
            }
        };

        processAuth();
    }, [success, accessToken, navigate, setAccessToken]);


   return { status };
}
