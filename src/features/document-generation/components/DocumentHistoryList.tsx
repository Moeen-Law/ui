import { useTranslation } from "react-i18next";
import { Calendar, FileText, History, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getDateLabel,
    getDocumentTemplateName,
} from "../helpers";
import type { DocumentTemplate, GeneratedDocument } from "../types";

export interface DocumentHistoryListProps {
    documents: GeneratedDocument[];
    templates: DocumentTemplate[];
    selectedId?: string;
    isLoading: boolean;
    isError: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onRetry: () => void;
    onSelect: (document: GeneratedDocument) => void;
    onItemSelected?: () => void;
}

export default function DocumentHistoryList({
    documents,
    templates,
    selectedId,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onRetry,
    onSelect,
    onItemSelected,
}: DocumentHistoryListProps) {
    const { t, i18n } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-blue-500/15 bg-blue-500/5 p-5 text-center">
                <Loader2 className="size-8 animate-spin text-blue-500" />
                <p className="text-sm font-bold">{t("documentGeneration.history.loading")}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center">
                <p className="text-sm font-bold text-destructive">
                    {t("documentGeneration.history.error")}
                </p>
                <Button type="button" variant="outline" onClick={onRetry}>
                    <RefreshCw />
                    {t("documentGeneration.error.retry")}
                </Button>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-5 text-center">
                <History className="size-8 text-blue-500" />
                <p className="text-sm font-bold">{t("documentGeneration.history.empty")}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pe-1">
            {documents.map((document) => {
                const isSelected = selectedId === document.id;
                const templateName = getDocumentTemplateName(document, templates);

                return (
                    <button
                        key={document.id}
                        type="button"
                        onClick={() => {
                            onSelect(document);
                            onItemSelected?.();
                        }}
                        className={`min-w-0 cursor-pointer rounded-xl border p-3 text-start transition hover:border-blue-500/40 hover:bg-blue-500/10 ${
                            isSelected
                                ? "border-blue-500/40 bg-blue-500/10"
                                : "border-blue-500/15 bg-card"
                        }`}
                    >
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-black">
                                    {templateName}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="size-3 shrink-0" />
                                    {getDateLabel(document.createdAt, i18n.language)}
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}

            {hasNextPage && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onLoadMore}
                    disabled={isFetchingNextPage}
                    className="cursor-pointer border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500"
                >
                    {isFetchingNextPage ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    {t("documentGeneration.history.loadMore")}
                </Button>
            )}
        </div>
    );
}
