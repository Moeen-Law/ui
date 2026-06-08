import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import ContractAnalysisSkeleton from "../components/ContractAnalysisSkeleton";
import ContractAnalysisContent from "../components/ContractAnalysisContent";

export default function ContractAnalysis() {
    const { t } = useTranslation();

    return (
        <ErrorBoundary message={t("contractAnalysis.error.boundary")}>
            <Suspense fallback={<ContractAnalysisSkeleton />}>
                <ContractAnalysisContent />
            </Suspense>
        </ErrorBoundary>
    );
}
