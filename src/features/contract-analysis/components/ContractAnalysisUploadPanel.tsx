import { useRef, type ChangeEvent } from "react";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import DailyQuotaBadge from "@/features/chat/components/DailyQuotaBadge";
import QuotaNotice from "@/features/chat/components/QuotaNotice";
import type { Quota } from "@/features/chat/types";
import { isQuotaExhausted, isQuotaLow } from "@/features/chat/hooks/useDailyQuota";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ContractAnalysisInputFile } from "../types";
import { formatFileSize } from "../helpers";

interface ContractAnalysisUploadPanelProps {
    selectedFiles: ContractAnalysisInputFile[];
    isBusy: boolean;
    isUploading: boolean;
    isAnalyzing: boolean;
    requestError?: string;
    quota?: Quota;
    isQuotaLoading?: boolean;
    isQuotaError?: boolean;
    onSelectFiles: (files: File[]) => void;
    onRemoveFile: (id: string) => void;
    onClearFiles: () => void;
    onAnalyze: () => void;
}

export default function ContractAnalysisUploadPanel({
    selectedFiles,
    isBusy,
    isUploading,
    isAnalyzing,
    requestError,
    quota,
    isQuotaLoading,
    isQuotaError,
    onSelectFiles,
    onRemoveFile,
    onClearFiles,
    onAnalyze,
}: ContractAnalysisUploadPanelProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const quotaExhausted = isQuotaExhausted(quota);
    const showQuotaNotice = isQuotaLow(quota) || quotaExhausted;

    const handleSelectFiles = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length > 0) {
            onSelectFiles(files);
        }
        event.target.value = "";
    };

    return (
        <Card className="border-blue-500/20 bg-card/95 shadow-2xl shadow-blue-500/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <Upload className="text-blue-500" />
                    {t("contractAnalysis.upload.title")}
                </CardTitle>
                <CardDescription>
                    {t("contractAnalysis.upload.description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <button
                    type="button"
                    disabled={isBusy || quotaExhausted}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-52 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 px-4 py-8 text-center transition hover:border-blue-500 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                        <Upload />
                    </span>
                    <span className="max-w-xs text-sm font-bold">
                        {t("contractAnalysis.upload.choose")}
                    </span>
                    <span className="max-w-xs text-xs leading-5 text-muted-foreground">
                        {t("contractAnalysis.upload.hint")}
                    </span>
                </button>

                <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleSelectFiles}
                    disabled={isBusy || quotaExhausted}
                />

                {selectedFiles.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold">
                                {t("contractAnalysis.upload.selectedCount", {
                                    count: selectedFiles.length,
                                })}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer disabled:cursor-not-allowed"
                                onClick={onClearFiles}
                                disabled={isBusy}
                            >
                                {t("contractAnalysis.upload.clear")}
                            </Button>
                        </div>

                        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pe-1 admin-table-scrollbar">
                            {selectedFiles.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-muted/40 p-3"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                                        {item.status === "uploading" ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            <FileText className="size-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-bold">{item.file.name}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {item.file.type || "application/octet-stream"} - {formatFileSize(item.file.size)}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-pointer disabled:cursor-not-allowed"
                                        onClick={() => onRemoveFile(item.id)}
                                        disabled={isBusy}
                                        aria-label={t("contractAnalysis.upload.remove")}
                                    >
                                        <X />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {requestError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm leading-6 text-destructive">
                        {requestError}
                    </div>
                )}

                <DailyQuotaBadge
                    quota={quota}
                    isLoading={isQuotaLoading}
                    isError={isQuotaError}
                    className="w-fit"
                />

                {showQuotaNotice ? (
                    <QuotaNotice quota={quota} kind="doc_analysis" />
                ) : null}

                <Button
                    type="button"
                    onClick={onAnalyze}
                    disabled={selectedFiles.length === 0 || isBusy || quotaExhausted}
                    className="h-10 w-full cursor-pointer border-blue-600 bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/35 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed dark:border-blue-500 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
                >
                    {isBusy ? (
                        <Loader2 data-icon="inline-start" className="animate-spin text-amber-200" />
                    ) : (
                        <CheckCircle2 data-icon="inline-start" className="text-amber-200" />
                    )}
                    {isUploading
                        ? t("contractAnalysis.upload.uploading")
                        : isAnalyzing
                            ? t("contractAnalysis.upload.analyzing")
                            : t("contractAnalysis.upload.submit")}
                </Button>
            </CardContent>
        </Card>
    );
}
