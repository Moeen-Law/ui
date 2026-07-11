import { useMemo, useState } from "react";
import { Building2, ClipboardList, Landmark } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
    TaskErrorState,
    TaskExampleEmptyState,
    TaskHistoryCard,
    TaskHistoryDrawer,
    TaskHistoryList,
    TaskPromptPanel,
    TaskWorkspaceHeader,
    TaskWorkspaceShell,
} from "@/shared/components/task-workspace";
import {
    useCreateGovernmentProcess,
    useGovernmentProcesses,
} from "../hooks";
import { formatGovernmentProcessDate, historyToGovernmentProcessResponse } from "../helpers";
import type { GovernmentProcessesRes } from "../types";
import GovernmentProcessLoadingState from "./GovernmentProcessLoadingState";
import GovernmentProcessResultCard from "./GovernmentProcessResultCard";

export default function GovernmentProcessesContent() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [selectedResult, setSelectedResult] = useState<GovernmentProcessesRes | null>(null);
    const [requestError, setRequestError] = useState<string | undefined>();

    const {
        processes,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGovernmentProcesses();
    const {
        createGovernmentProcessAsync,
        isPending,
    } = useCreateGovernmentProcess();

    const selectedId = selectedResult?.id;
    const trimmedQuery = query.trim();
    const recentCount = processes.length;

    const stats = useMemo(
        () => [
            {
                label: t("governmentProcesses.stats.history"),
                value: recentCount,
            },
            {
                label: t("governmentProcesses.stats.sources"),
                value: selectedResult?.result.sources?.length ?? 0,
            },
        ],
        [recentCount, selectedResult?.result.sources?.length, t]
    );

    const handleSubmit = async () => {
        if (trimmedQuery.length < 2 || isPending) return;

        setRequestError(undefined);
        try {
            const response = await createGovernmentProcessAsync(trimmedQuery);
            setSelectedResult(response);
            setQuery("");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : t("governmentProcesses.error.description");
            setRequestError(message);
            toast.error(message);
        }
    };

    const handleSelectHistory = (item: GovernmentProcessesRes) => {
        setRequestError(undefined);
        setSelectedResult(historyToGovernmentProcessResponse(item));
    };

    const historyLabels = {
        empty: t("governmentProcesses.history.empty"),
        error: t("governmentProcesses.error.history"),
        retry: t("governmentProcesses.error.retry"),
        loadMore: t("governmentProcesses.history.loadMore"),
    };
    const renderHistory = (onItemSelected?: () => void, listClassName?: string) => (
        <TaskHistoryList
            items={processes}
            getItemId={(item) => item.id}
            selectedId={selectedId}
            renderItem={(item) => <><span className="line-clamp-2 min-w-0 break-words text-sm font-bold leading-6">{item.input.query}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="size-3.5" />{formatGovernmentProcessDate(item.createdAt)}</span></>}
            onSelect={handleSelectHistory}
            onItemSelected={onItemSelected}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            labels={historyLabels}
            listClassName={listClassName}
        />
    );
    const historyTitle = t("governmentProcesses.history.title");
    const historyDescription = t("governmentProcesses.history.description");

    return (
        <TaskWorkspaceShell
            sidebarWidth="340px"
            header={<TaskWorkspaceHeader icon={Landmark} badgeIcon={Building2} badgeLabel={t("governmentProcesses.header.badge")} title={t("governmentProcesses.header.title")} description={t("governmentProcesses.header.description")} backLabel={t("governmentProcesses.header.backToChat")} stats={stats} />}
            mobileHistory={<TaskHistoryDrawer title={historyTitle} description={historyDescription} count={processes.length} renderContent={(close) => renderHistory(close, "min-h-0 flex-1 overscroll-contain")} />}
            desktopHistory={<TaskHistoryCard title={historyTitle} description={historyDescription}>{renderHistory(undefined, "max-h-[520px]")}</TaskHistoryCard>}
        >
            <TaskPromptPanel id="government-process-input" icon={Building2} title={t("governmentProcesses.search.title")} description={t("governmentProcesses.search.description")} label={t("governmentProcesses.search.label")} placeholder={t("governmentProcesses.search.placeholder")} hint={t("governmentProcesses.search.hint")} disclaimer={t("governmentProcesses.search.disclaimer")} submitLabel={t("governmentProcesses.search.submit")} pendingLabel={t("governmentProcesses.search.loading")} value={query} isPending={isPending} onChange={setQuery} onSubmit={handleSubmit} />

                        {isPending ? (
                            <GovernmentProcessLoadingState />
                        ) : requestError ? (
                            <TaskErrorState title={t("governmentProcesses.error.title")} description={requestError} retryLabel={t("governmentProcesses.error.retry")} onRetry={handleSubmit} />
                        ) : selectedResult ? (
                            <GovernmentProcessResultCard process={selectedResult} />
                        ) : (
                            <TaskExampleEmptyState icon={Building2} exampleIcon={ClipboardList} title={t("governmentProcesses.empty.title")} description={t("governmentProcesses.empty.description")} examples={[t("governmentProcesses.empty.examples.passport"), t("governmentProcesses.empty.examples.birth"), t("governmentProcesses.empty.examples.license")]} onSelectExample={setQuery} />
                        )}
        </TaskWorkspaceShell>
    );
}
