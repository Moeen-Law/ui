import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import GovernmentProcessesContent from "../components/GovernmentProcessesContent";
import GovernmentProcessSkeleton from "../components/GovernmentProcessSkeleton";

export default function GovernmentProcesses() {
    const { t } = useTranslation();

    return (
        <ErrorBoundary
            message={t("governmentProcesses.error.boundary")}
        >
            <Suspense fallback={<GovernmentProcessSkeleton />}>
                <GovernmentProcessesContent />
            </Suspense>
        </ErrorBoundary>
    );
}
