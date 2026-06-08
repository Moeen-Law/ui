import { useTranslation } from "react-i18next";
import { Download, ExternalLink, FileCheck2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    formatFileSize,
    getDateLabel,
    getDocumentTemplateName,
} from "../helpers";
import type { DocumentTemplate, GeneratedDocument } from "../types";

interface GeneratedDocumentCardProps {
    document: GeneratedDocument;
    templates: DocumentTemplate[];
    onRefresh: () => void;
}

export default function GeneratedDocumentCard({
    document,
    templates,
    onRefresh,
}: GeneratedDocumentCardProps) {
    const { t, i18n } = useTranslation();
    const file = document.generatedFile;
    const downloadUrl = file?.downloadUrl;
    const templateName = getDocumentTemplateName(document, templates);
    const fileMeta = [file?.contentType, formatFileSize(file?.size)].filter(Boolean).join(" - ");
    const fileDetails = (
        <>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-bold text-muted-foreground">
                        {t("documentGeneration.result.file")}
                    </div>
                    <div className="mt-1 break-words font-black">
                        {file?.originalName ?? t("documentGeneration.result.fileUnavailable")}
                    </div>
                </div>
                {downloadUrl ? (
                    <ExternalLink className="mt-1 size-4 shrink-0 text-blue-500" />
                ) : null}
            </div>
            {fileMeta ? (
                <div className="mt-1 text-xs text-muted-foreground">
                    {fileMeta}
                </div>
            ) : null}
        </>
    );

    return (
        <Card className="overflow-hidden border-blue-500/15 shadow-xl shadow-blue-500/5">
            <CardContent className="grid gap-5 p-0">
                <div className="grid gap-5 border-b border-blue-500/10 bg-blue-500/5 p-5 sm:grid-cols-[1fr_auto] sm:items-center md:p-6">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                            <FileCheck2 />
                        </div>
                        <div className="min-w-0">
                            <h2 className="break-words text-xl font-black">
                                {t("documentGeneration.result.title")}
                            </h2>
                            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                                {templateName}
                            </p>
                        </div>
                    </div>

                    {downloadUrl ? (
                        <Button asChild className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 sm:w-auto">
                            <a href={downloadUrl} download>
                                <Download />
                                {t("documentGeneration.result.download")}
                            </a>
                        </Button>
                    ) : null}
                </div>

                <div className="grid gap-4 p-5 pt-0 md:p-6 md:pt-0">
                    {downloadUrl ? (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl border border-blue-500/15 bg-card p-4 transition hover:border-blue-500/35 hover:bg-blue-500/5"
                        >
                            {fileDetails}
                        </a>
                    ) : (
                        <div className="rounded-xl border border-blue-500/15 bg-card p-4">
                            {fileDetails}
                        </div>
                    )}

                    <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">
                        <div className="text-xs font-bold text-muted-foreground">
                            {t("documentGeneration.result.createdAt")}
                        </div>
                        <div className="mt-1 font-black">
                            {getDateLabel(document.createdAt, i18n.language)}
                        </div>
                    </div>

                    {!downloadUrl ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                            <p className="text-sm text-destructive">
                                {t("documentGeneration.result.downloadUnavailable")}
                            </p>
                            <Button type="button" variant="outline" onClick={onRefresh}>
                                <RefreshCw />
                                {t("documentGeneration.result.refresh")}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
