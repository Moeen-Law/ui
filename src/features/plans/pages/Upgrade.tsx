import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import UpgradeContent from "../components/UpgradeContent";
import { PricingSkeleton } from "@/features/landing/components/pricing/PricingSkeleton";

export default function Upgrade() {
    const { t } = useTranslation();

    return (
        <ErrorBoundary message={t("upgrade.error.boundary")}>
            <Suspense fallback={<PricingSkeleton />}>
                <UpgradeContent />
            </Suspense>
        </ErrorBoundary>
    );
}
