import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import useAuthStore from "../store/auth";
import OAuthProcessing from "../components/OAuthProcessing";
import OAuthSuccess from "../components/OAuthSuccess";
import OAuthError from "../components/OAuthError";

export default function OAuthAuthorize() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const success = searchParams.get("success");
    const accessToken = searchParams.get("accessToken");
    const { setAccessToken } = useAuthStore();

    const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

    useEffect(() => {
        if (success === null) {
            navigate("/", { replace: true });
            return;
        }

        const processAuth = async () => {
            // Artificial delay for modern feel
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (success === "true") {
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


    const renderContent = () => {
        switch (status) {
            case "processing":
                return <OAuthProcessing />
            case "success":
                return <OAuthSuccess />
            case "error":
                return <OAuthError />
        }
    };

    return (
        <AuthLayout
            title={status === "error" ? "خطأ في المصادقة" : "مصادقة جوجل"}
            subtitle={status === "error" ? "فشل الاتصال" : "نقوم بالتحقق من بياناتك"}
        >
            <div className="relative overflow-hidden min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}
