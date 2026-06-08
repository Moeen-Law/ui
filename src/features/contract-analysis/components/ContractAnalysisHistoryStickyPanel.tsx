import { History } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ContractAnalysisResponse } from "../types";
import ContractAnalysisHistoryList from "./ContractAnalysisHistoryList";

interface ContractAnalysisHistoryStickyPanelProps {
    items: ContractAnalysisResponse[];
    selectedId?: string;
    hasNextPage: boolean;
    isLoading?: boolean;
    isFetchingNextPage: boolean;
    isError?: boolean;
    onLoadMore: () => void;
    onRetry?: () => void;
    onSelect: (analysis: ContractAnalysisResponse) => void;
}

export default function ContractAnalysisHistoryStickyPanel({
    items,
    selectedId,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    onLoadMore,
    onRetry,
    onSelect,
}: ContractAnalysisHistoryStickyPanelProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5 lg:sticky lg:top-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <History className="text-blue-500" />
                    {t("contractAnalysis.history.title")}
                </CardTitle>
                <CardDescription>
                    {t("contractAnalysis.history.description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ContractAnalysisHistoryList
                    items={items}
                    selectedId={selectedId}
                    hasNextPage={hasNextPage}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    isError={isError}
                    onLoadMore={onLoadMore}
                    onRetry={onRetry}
                    onSelect={onSelect}
                    listClassName="max-h-[520px]"
                />
            </CardContent>
        </Card>
    );
}
