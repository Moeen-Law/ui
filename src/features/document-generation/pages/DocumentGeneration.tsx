import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import DocumentGenerationContent from "../components/DocumentGenerationContent";
import DocumentGenerationSkeleton from "../components/DocumentGenerationSkeleton";

export default function DocumentGeneration() {
    const { t } = useTranslation();

    return (
        <ErrorBoundary message={t("documentGeneration.error.boundary")}>
            <Suspense fallback={<DocumentGenerationSkeleton />}>
                <DocumentGenerationContent />
            </Suspense>
        </ErrorBoundary>
    );
}
