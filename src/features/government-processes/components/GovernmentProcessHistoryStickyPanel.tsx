import { History } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { GovernmentProcessesRes } from "../types";
import GovernmentProcessHistoryList from "./GovernmentProcessHistoryList";

interface GovernmentProcessHistoryStickyPanelProps {
    items: GovernmentProcessesRes[];
    selectedId?: string;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onSelect: (process: GovernmentProcessesRes) => void;
}

export default function GovernmentProcessHistoryStickyPanel({
    items,
    selectedId,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onSelect,
}: GovernmentProcessHistoryStickyPanelProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <History className="text-blue-500" />
                    {t("governmentProcesses.history.title")}
                </CardTitle>
                <CardDescription>
                    {t("governmentProcesses.history.description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GovernmentProcessHistoryList
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
