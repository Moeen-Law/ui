import { History, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { TerminologiesDatum } from "../types";
import { formatTerminologyDate, getTerminologyStatusLabel } from "../helpers";
import { useTranslation } from "react-i18next";

interface TerminologyHistoryPanelProps {
    items: TerminologiesDatum[];
    selectedId?: string;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onSelect: (terminology: TerminologiesDatum) => void;
}

export default function TerminologyHistoryPanel({
    items,
    selectedId,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onSelect,
}: TerminologyHistoryPanelProps) {
    const { i18n, t } = useTranslation();

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
            <CardContent className="flex flex-col gap-4">
                {items.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center">
                        <Search className="text-blue-500" />
                        <p className="text-sm text-muted-foreground">
                            {t("legalTerminologies.history.empty")}
                        </p>
                    </div>
                ) : (
                    <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pe-1 admin-table-scrollbar">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelect(item)}
                                className={cn(
                                    "group flex w-full cursor-pointer flex-col gap-2 rounded-xl border p-3 text-start transition-all hover:border-blue-500/40 hover:bg-blue-500/5",
                                    selectedId === item.id
                                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                                        : "border-border bg-background"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="line-clamp-2 text-sm font-bold leading-6">
                                        {item.result?.term || item.input.terminology}
                                    </span>
                                    <Badge
                                        variant={item.status === "completed" ? "secondary" : "outline"}
                                        className={item.status === "completed" ? "bg-blue-500/10 text-blue-500" : undefined}
                                    >
                                        {getTerminologyStatusLabel(item.status, t, i18n)}
                                    </Badge>
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
                            className="border-blue-500/20 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
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
            </CardContent>
        </Card>
    );
}
