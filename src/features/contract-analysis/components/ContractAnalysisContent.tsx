import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clipboard, FileText, Home } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { uploadMessageFiles } from "@/features/chat/services";
import { getFeatureQuota, isQuotaExhausted, useDailyQuota } from "@/features/chat/hooks/useDailyQuota";
import DailyQuotaBadge from "@/features/chat/components/DailyQuotaBadge";
import type { ContractAnalysisInputFile, ContractAnalysisResponse } from "../types";
import { useContractAnalyses } from "../hooks/useContractAnalyses";
import { useCreateContractAnalysis } from "../hooks/useCreateContractAnalysis";
import { useOptionalContractAnalysis } from "../hooks/useOptionalContractAnalysis";
import ContractAnalysisErrorState from "./ContractAnalysisErrorState";
import ContractAnalysisHistoryDrawer from "./ContractAnalysisHistoryDrawer";
import ContractAnalysisHistoryStickyPanel from "./ContractAnalysisHistoryStickyPanel";
import ContractAnalysisLoadingState from "./ContractAnalysisLoadingState";
import ContractAnalysisResultCard from "./ContractAnalysisResultCard";
import ContractAnalysisUploadPanel from "./ContractAnalysisUploadPanel";

const createInputFile = (file: File): ContractAnalysisInputFile => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    status: "selected",
});

export default function ContractAnalysisContent() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { analysisId } = useParams<{ analysisId?: string }>();
    const [selectedFiles, setSelectedFiles] = useState<ContractAnalysisInputFile[]>([]);
    const [localSelectedResult, setLocalSelectedResult] = useState<ContractAnalysisResponse | null>(null);
    const [requestError, setRequestError] = useState<string | undefined>();
    const [isUploading, setIsUploading] = useState(false);
    const {
        quota: dailyQuota,
        isLoading: isQuotaLoading,
        isError: isQuotaError,
    } = useDailyQuota();
    const docAnalysisQuota = getFeatureQuota(dailyQuota, "doc_analysis");
    const docAnalysisQuotaExhausted = isQuotaExhausted(docAnalysisQuota);

    const {
        analyses,
        fetchNextPage,
        hasNextPage,
        isLoading: isLoadingHistory,
        isFetchingNextPage,
        isError: isHistoryError,
        refetch: refetchHistory,
    } = useContractAnalyses();
    const {
        analysis: loadedAnalysis,
        isLoading: isLoadingDetail,
        isError: isDetailError,
        error: detailError,
        refetch: refetchDetail,
    } = useOptionalContractAnalysis(analysisId);
    const { analyzeContractAsync, isPending } = useCreateContractAnalysis();

    const selectedResult = loadedAnalysis ?? localSelectedResult;
    const selectedId = selectedResult?.id ?? analysisId;
    const sourceCount = selectedResult?.result.sources?.length ?? 0;
    const selectedFileCount = selectedFiles.length;
    const isBusy = isUploading || isPending;
    const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;
    const shouldShowResultLoading = isLoadingDetail || (isPending && !isUploading);
    const detailErrorMessage = detailError instanceof Error ? detailError.message : undefined;

    const stats = useMemo(
        () => [
            {
                label: t("contractAnalysis.stats.history"),
                value: analyses.length,
            },
            {
                label: t("contractAnalysis.stats.files"),
                value: selectedResult?.input.files_ids?.length ?? selectedFileCount,
            },
            {
                label: t("contractAnalysis.stats.sources"),
                value: sourceCount,
            },
        ],
        [analyses.length, selectedFileCount, selectedResult?.input.files_ids?.length, sourceCount, t]
    );

    const handleSelectFiles = useCallback((files: File[]) => {
        setSelectedFiles((currentFiles) => {
            const existing = new Set(
                currentFiles.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)
            );
            const nextFiles = files
                .filter((file) => !existing.has(`${file.name}-${file.size}-${file.lastModified}`))
                .map(createInputFile);

            return [...currentFiles, ...nextFiles];
        });
        setRequestError(undefined);
    }, []);

    const handleRemoveFile = useCallback((id: string) => {
        setSelectedFiles((currentFiles) => currentFiles.filter((item) => item.id !== id));
        setRequestError(undefined);
    }, []);

    const handleClearFiles = useCallback(() => {
        setSelectedFiles([]);
        setRequestError(undefined);
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (selectedFiles.length === 0 || isBusy || docAnalysisQuotaExhausted) return;

        setRequestError(undefined);

        try {
            setIsUploading(true);
            setSelectedFiles((currentFiles) =>
                currentFiles.map((item) => ({ ...item, status: "uploading" }))
            );
            const filesIds = await uploadMessageFiles(selectedFiles.map((item) => item.file));
            setIsUploading(false);

            const analysis = await analyzeContractAsync(filesIds);
            setLocalSelectedResult(analysis);
            setSelectedFiles([]);

            if (analysis.id) {
                navigate(`/contract-analysis/${analysis.id}`, { replace: true });
            }
        } catch (error) {
            setIsUploading(false);
            setSelectedFiles((currentFiles) =>
                currentFiles.map((item) => ({ ...item, status: "error" }))
            );
            const message =
                error instanceof Error
                    ? error.message
                    : t("contractAnalysis.error.description");
            setRequestError(message);
        }
    }, [analyzeContractAsync, docAnalysisQuotaExhausted, isBusy, navigate, selectedFiles, t]);

    const handleSelectHistory = useCallback((analysis: ContractAnalysisResponse) => {
        setRequestError(undefined);
        setLocalSelectedResult(null);
        navigate(`/contract-analysis/${analysis.id}`);
    }, [navigate]);

    return (
        <div className="min-h-dvh w-full overflow-x-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:gap-6 md:px-8 md:py-8">
                <header className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:gap-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                            <Link to="/chat">
                                <BackIcon data-icon="inline-start" />
                                {t("contractAnalysis.header.backToChat")}
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                                <Link to="/" aria-label={t("chat.ui.home")}>
                                    <Home data-icon="inline-start" />
                                </Link>
                            </Button>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
                        <div className="flex min-w-0 flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10 md:size-12">
                                    <FileText />
                                </div>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                    <Clipboard data-icon="inline-start" />
                                    {t("contractAnalysis.header.badge")}
                                </Badge>
                                <DailyQuotaBadge
                                    quota={docAnalysisQuota}
                                    isLoading={isQuotaLoading}
                                    isError={isQuotaError}
                                />
                            </div>
                            <div className="flex max-w-3xl flex-col gap-3">
                                <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
                                    {t("contractAnalysis.header.title")}
                                </h1>
                                <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
                                    {t("contractAnalysis.header.description")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 shadow-lg shadow-blue-500/5"
                                >
                                    <div className="text-2xl font-black text-blue-500">{stat.value}</div>
                                    <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="grid min-w-0 grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="flex min-w-0 flex-col gap-5">
                        <div className="lg:hidden">
                            <ContractAnalysisHistoryDrawer
                                items={analyses}
                                selectedId={selectedId}
                                hasNextPage={!!hasNextPage}
                                isLoading={isLoadingHistory}
                                isFetchingNextPage={isFetchingNextPage}
                                isError={isHistoryError}
                                onLoadMore={() => fetchNextPage()}
                                onRetry={() => void refetchHistory()}
                                onSelect={handleSelectHistory}
                            />
                        </div>

                        <ContractAnalysisUploadPanel
                            selectedFiles={selectedFiles}
                            isBusy={isBusy}
                            isUploading={isUploading}
                            isAnalyzing={isPending}
                            requestError={requestError}
                            quota={docAnalysisQuota}
                            isQuotaLoading={isQuotaLoading}
                            isQuotaError={isQuotaError}
                            onSelectFiles={handleSelectFiles}
                            onRemoveFile={handleRemoveFile}
                            onClearFiles={handleClearFiles}
                            onAnalyze={handleAnalyze}
                        />

                        {shouldShowResultLoading ? (
                            <ContractAnalysisLoadingState />
                        ) : isDetailError ? (
                            <ContractAnalysisErrorState
                                message={detailErrorMessage}
                                onRetry={() => void refetchDetail()}
                            />
                        ) : selectedResult ? (
                            <ContractAnalysisResultCard analysis={selectedResult} />
                        ) : requestError ? (
                            <ContractAnalysisErrorState
                                message={requestError}
                                onRetry={selectedFiles.length > 0 ? handleAnalyze : undefined}
                            />
                        ) : (
                            <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-blue-500/20 bg-card/80 p-8 text-center shadow-xl shadow-blue-500/5">
                                <FileText className="size-10 text-blue-500" />
                                <div className="max-w-md text-base font-black">
                                    {t("contractAnalysis.empty.title")}
                                </div>
                                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                    {t("contractAnalysis.empty.description")}
                                </p>
                            </div>
                        )}
                    </section>

                    <aside className="hidden min-w-0 lg:block">
                        <ContractAnalysisHistoryStickyPanel
                            items={analyses}
                            selectedId={selectedId}
                            hasNextPage={!!hasNextPage}
                            isLoading={isLoadingHistory}
                            isFetchingNextPage={isFetchingNextPage}
                            isError={isHistoryError}
                            onLoadMore={() => fetchNextPage()}
                            onRetry={() => void refetchHistory()}
                            onSelect={handleSelectHistory}
                        />
                    </aside>
                </main>
            </div>
        </div>
    );
}
