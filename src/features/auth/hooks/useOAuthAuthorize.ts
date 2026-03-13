import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/auth";
import { useEffect, useState } from "react";


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
                setTimeout(() => navigate("/"), 3000);
            } else {
                setStatus("error");
            }
        };

        processAuth();
    }, [success, accessToken, navigate, setAccessToken]);


   return { status };
}