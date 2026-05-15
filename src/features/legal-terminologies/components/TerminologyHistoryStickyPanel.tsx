import { History } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { TerminologiesDatum } from "../types";
import TerminologyHistoryList from "./TerminologyHistoryList";

interface TerminologyHistoryStickyPanelProps {
    items: TerminologiesDatum[];
    selectedId?: string;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onSelect: (terminology: TerminologiesDatum) => void;
}

export default function TerminologyHistoryStickyPanel({
    items,
    selectedId,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onSelect,
}: TerminologyHistoryStickyPanelProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5 lg:sticky lg:top-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <History className="text-blue-500" />
                    {t("legalTerminologies.history.title")}
                </CardTitle>
                <CardDescription>
                    {t("legalTerminologies.history.description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TerminologyHistoryList
                    items={items}
                    selectedId={selectedId}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    onLoadMore={onLoadMore}
                    onSelect={onSelect}
                    listClassName="max-h-[520px]"
                />
            </CardContent>
        </Card>
    );
}
