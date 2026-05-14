import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import LegalTerminologySkeleton from "../components/LegalTerminologySkeleton";
import LegalTerminologiesContent from "../components/LegalTerminologiesContent";

export default function LegalTerminologies() {
    const { t } = useTranslation();

    return (
        <ErrorBoundary message={t("legalTerminologies.error.boundary")}>
            <Suspense fallback={<LegalTerminologySkeleton />}>
                <LegalTerminologiesContent />
            </Suspense>
        </ErrorBoundary>
    );
}
