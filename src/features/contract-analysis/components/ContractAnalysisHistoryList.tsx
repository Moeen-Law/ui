import { AlertCircle, FileText, Loader2, RotateCcw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContractAnalysisResponse } from "../types";
import { formatContractAnalysisDate } from "../helpers";

export interface ContractAnalysisHistoryListProps {
    items: ContractAnalysisResponse[];
    selectedId?: string;
    hasNextPage: boolean;
    isLoading?: boolean;
    isFetchingNextPage: boolean;
    isError?: boolean;
    onLoadMore: () => void;
    onRetry?: () => void;
    onSelect: (analysis: ContractAnalysisResponse) => void;
    onItemSelected?: () => void;
    listClassName?: string;
}

export default function ContractAnalysisHistoryList({
    items,
    selectedId,
    hasNextPage,
    isLoading = false,
    isFetchingNextPage,
    isError = false,
    onLoadMore,
    onRetry,
    onSelect,
    onItemSelected,
    listClassName,
}: ContractAnalysisHistoryListProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            {isLoading ? (
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                </div>
            ) : isError ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
                    <AlertCircle className="text-destructive" />
                    <p className="text-sm leading-6 text-muted-foreground">
                        {t("contractAnalysis.error.history")}
                    </p>
                    {onRetry && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={onRetry}
                        >
                            <RotateCcw data-icon="inline-start" />
                            {t("contractAnalysis.error.retry")}
                        </Button>
                    )}
                </div>
            ) : items.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center">
                    <Search className="text-blue-500" />
                    <p className="text-sm text-muted-foreground">
                        {t("contractAnalysis.history.empty")}
                    </p>
                </div>
            ) : (
                <div
                    className={cn(
                        "flex min-h-0 flex-col gap-2 overflow-y-auto pe-1 admin-table-scrollbar",
                        listClassName
                    )}
                >
                    {items.map((item) => {
                        const filesCount = item.input.files_ids?.length ?? 0;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    onSelect(item);
                                    onItemSelected?.();
                                }}
                                className={cn(
                                    "group flex w-full cursor-pointer flex-col gap-2 rounded-xl border p-3 text-start transition-all hover:border-blue-500/40 hover:bg-blue-500/5",
                                    selectedId === item.id
                                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                                        : "border-border bg-background"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="line-clamp-2 min-w-0 break-words text-sm font-bold leading-6">
                                        {t("contractAnalysis.history.itemTitle", {
                                            count: filesCount,
                                        })}
                                    </span>
                                </div>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <FileText className="size-3.5" />
                                    {formatContractAnalysisDate(item.createdAt)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {hasNextPage && (
                <>
                    <Separator />
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                        onClick={onLoadMore}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage && (
                            <Loader2 data-icon="inline-start" className="animate-spin" />
                        )}
                        {t("contractAnalysis.history.loadMore")}
                    </Button>
                </>
            )}
        </div>
    );
}
