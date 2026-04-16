import { AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import OAuthProcessing from "../components/OAuthProcessing";
import OAuthSuccess from "../components/OAuthSuccess";
import OAuthError from "../components/OAuthError";
import { useOAuthAuthorize } from "../hooks/useOAuthAuthorize";
import { useTranslation } from "react-i18next";

export default function OAuthAuthorize() {
    const { t } = useTranslation();

    const { status } = useOAuthAuthorize();

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
            title={status === "error" ? t("auth.authError") : t("auth.authorizedTitle")}
            subtitle={status === "error" ? t("auth.verificationFailed") : t("auth.oauthProcessing")}
        >
            <div className="relative overflow-hidden min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}
