import { useTranslation } from "react-i18next";
import { FileText, Loader2, RefreshCw, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentTemplateSummary } from "../types";

interface DocumentTemplateGridProps {
    templates: DocumentTemplateSummary[];
    selectedTemplateId?: string;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    onSelectTemplate: (templateId: string) => void;
}

export default function DocumentTemplateGrid({
    templates,
    selectedTemplateId,
    isLoading,
    isError,
    onRetry,
    onSelectTemplate,
}: DocumentTemplateGridProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <FileText className="text-blue-500" />
                    {t("documentGeneration.templates.title")}
                </CardTitle>
                <CardDescription>
                    {t("documentGeneration.templates.description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="animate-spin" />
                        {t("documentGeneration.templates.loading")}
                    </div>
                ) : isError ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                        <p className="text-sm text-destructive">
                            {t("documentGeneration.templates.error")}
                        </p>
                        <Button type="button" variant="outline" onClick={onRetry}>
                            <RefreshCw />
                            {t("documentGeneration.error.retry")}
                        </Button>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center text-sm font-bold">
                        {t("documentGeneration.templates.empty")}
                    </div>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {templates.map((templateItem) => (
                            <button
                                key={templateItem.id}
                                type="button"
                                onClick={() => onSelectTemplate(templateItem.id)}
                                className={`min-w-0 cursor-pointer rounded-xl border p-4 text-start transition hover:border-blue-500/40 hover:bg-blue-500/10 ${
                                    selectedTemplateId === templateItem.id
                                        ? "border-blue-500/40 bg-blue-500/10"
                                        : "border-blue-500/15 bg-card"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                                        <ScrollText className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate font-black">
                                            {templateItem.name}
                                        </div>
                                        {templateItem.description ? (
                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                                {templateItem.description}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
