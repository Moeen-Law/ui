import { useCallback, useMemo, useState } from "react";
import { Clipboard, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TaskErrorState, TaskHistoryCard, TaskHistoryDrawer, TaskHistoryList, TaskWorkspaceHeader, TaskWorkspaceShell } from "@/shared/components/task-workspace";
import { uploadMessageFiles } from "@/features/chat/services";
import { getFeatureQuota, isQuotaExhausted, useDailyQuota } from "@/features/chat/hooks/useDailyQuota";
import DailyQuotaBadge from "@/shared/components/DailyQuotaBadge";
import type { ContractAnalysisInputFile, ContractAnalysisResponse } from "../types";
import { useContractAnalyses } from "../hooks/useContractAnalyses";
import { useCreateContractAnalysis } from "../hooks/useCreateContractAnalysis";
import { useOptionalContractAnalysis } from "../hooks/useOptionalContractAnalysis";
import ContractAnalysisLoadingState from "./ContractAnalysisLoadingState";
import ContractAnalysisResultCard from "./ContractAnalysisResultCard";
import ContractAnalysisUploadPanel from "./ContractAnalysisUploadPanel";
import { formatContractAnalysisDate } from "../helpers";

const createInputFile = (file: File): ContractAnalysisInputFile => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    status: "selected",
});

export default function ContractAnalysisContent() {
    const { t } = useTranslation();
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

    const historyLabels = { empty: t("contractAnalysis.history.empty"), error: t("contractAnalysis.error.history"), retry: t("contractAnalysis.error.retry"), loadMore: t("contractAnalysis.history.loadMore") };
    const renderHistory = (onItemSelected?: () => void, listClassName?: string) => <TaskHistoryList items={analyses} getItemId={(item) => item.id} selectedId={selectedId} renderItem={(item) => <><span className="line-clamp-2 min-w-0 break-words text-sm font-bold leading-6">{t("contractAnalysis.history.itemTitle", { count: item.input.files_ids?.length ?? 0 })}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><FileText className="size-3.5" />{formatContractAnalysisDate(item.createdAt)}</span></>} onSelect={handleSelectHistory} onItemSelected={onItemSelected} isLoading={isLoadingHistory} isError={isHistoryError} hasNextPage={!!hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={() => fetchNextPage()} onRetry={() => void refetchHistory()} labels={historyLabels} listClassName={listClassName} />;
    const historyTitle = t("contractAnalysis.history.title");
    const historyDescription = t("contractAnalysis.history.description");

    return (
        <TaskWorkspaceShell
            header={<TaskWorkspaceHeader icon={FileText} badgeIcon={Clipboard} badgeLabel={t("contractAnalysis.header.badge")} title={t("contractAnalysis.header.title")} description={t("contractAnalysis.header.description")} backLabel={t("contractAnalysis.header.backToChat")} stats={stats} statsColumns={3} statsWidth="420px" supplementaryBadge={<DailyQuotaBadge quota={docAnalysisQuota} isLoading={isQuotaLoading} isError={isQuotaError} />} />}
            mobileHistory={<TaskHistoryDrawer title={historyTitle} description={historyDescription} count={analyses.length} renderContent={(close) => renderHistory(close, "min-h-0 flex-1 overscroll-contain")} />}
            desktopHistory={<TaskHistoryCard title={historyTitle} description={historyDescription}>{renderHistory(undefined, "max-h-[520px]")}</TaskHistoryCard>}
        >
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
                            <TaskErrorState
                                title={t("contractAnalysis.error.title")}
                                description={detailErrorMessage || t("contractAnalysis.error.description")}
                                retryLabel={t("contractAnalysis.error.retry")}
                                onRetry={() => void refetchDetail()}
                            />
                        ) : selectedResult ? (
                            <ContractAnalysisResultCard analysis={selectedResult} />
                        ) : requestError ? (
                            <TaskErrorState
                                title={t("contractAnalysis.error.title")}
                                description={requestError}
                                retryLabel={t("contractAnalysis.error.retry")}
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
        </TaskWorkspaceShell>
    );
}
