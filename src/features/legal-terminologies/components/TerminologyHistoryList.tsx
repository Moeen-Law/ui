import { Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatTerminologyDate, getTerminologyStatusLabel } from "../helpers";
import type { TerminologiesDatum } from "../types";

export interface TerminologyHistoryListProps {
    items: TerminologiesDatum[];
    selectedId?: string;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onSelect: (terminology: TerminologiesDatum) => void;
    onItemSelected?: () => void;
    listClassName?: string;
}

export default function TerminologyHistoryList({
    items,
    selectedId,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onSelect,
    onItemSelected,
    listClassName,
}: TerminologyHistoryListProps) {
    const { i18n, t } = useTranslation();

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            {items.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center">
                    <Search className="text-blue-500" />
                    <p className="text-sm text-muted-foreground">
                        {t("legalTerminologies.history.empty")}
                    </p>
                </div>
            ) : (
                <div
                    className={cn(
                        "flex min-h-0 flex-col gap-2 overflow-y-auto pe-1 admin-table-scrollbar",
                        listClassName
                    )}
                >
                    {items.map((item) => (
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
                                    {item.result?.term || item.input.terminology}
                                </span>
                               
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {formatTerminologyDate(item.createdAt)}
                            </span>
                        </button>
                    ))}
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
                        {t("legalTerminologies.history.loadMore")}
                    </Button>
                </>
            )}
        </div>
    );
}
