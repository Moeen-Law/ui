import { useMemo, useState } from "react";
import { BookOpenText, Scale } from "lucide-react";
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
import { useCreateLegalTerminology, useLegalTerminologies } from "../hooks";
import type { TerminologiesDatum, TerminologyResponse } from "../types";
import { formatTerminologyDate, historyToResponse } from "../helpers";
import TerminologyResultCard from "./TerminologyResultCard";
import TerminologyLoadingState from "./TerminologyLoadingState";

export default function LegalTerminologiesContent() {
    const { t } = useTranslation();
    const [term, setTerm] = useState("");
    const [selectedResult, setSelectedResult] = useState<TerminologyResponse | null>(null);
    const [requestError, setRequestError] = useState<string>();
    const { terminologies, fetchNextPage, hasNextPage, isFetchingNextPage } = useLegalTerminologies();
    const { createTerminologyAsync, isPending } = useCreateLegalTerminology();
    const selectedId = selectedResult?.id;

    const stats = useMemo(() => [
        { label: t("legalTerminologies.stats.history"), value: terminologies.length },
        { label: t("legalTerminologies.stats.sources"), value: selectedResult?.result.sources?.length ?? 0 },
    ], [selectedResult?.result.sources?.length, t, terminologies.length]);

    const handleSubmit = async () => {
        const value = term.trim();
        if (value.length < 2 || isPending) return;
        setRequestError(undefined);
        try {
            setSelectedResult(await createTerminologyAsync(value));
            setTerm("");
        } catch (error) {
            const message = error instanceof Error ? error.message : t("legalTerminologies.error.description");
            setRequestError(message);
            toast.error(message);
        }
    };

    const handleSelectHistory = (item: TerminologiesDatum) => {
        setRequestError(undefined);
        setSelectedResult(historyToResponse(item));
    };
    const labels = {
        empty: t("legalTerminologies.history.empty"),
        error: t("legalTerminologies.error.history"),
        retry: t("legalTerminologies.error.retry"),
        loadMore: t("legalTerminologies.history.loadMore"),
    };
    const renderHistory = (onItemSelected?: () => void, listClassName?: string) => (
        <TaskHistoryList
            items={terminologies}
            getItemId={(item) => item.id}
            selectedId={selectedId}
            renderItem={(item) => <><span className="line-clamp-2 min-w-0 break-words text-sm font-bold leading-6">{item.result?.term || item.input.terminology}</span><span className="text-xs text-muted-foreground">{formatTerminologyDate(item.createdAt)}</span></>}
            onSelect={handleSelectHistory}
            onItemSelected={onItemSelected}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            labels={labels}
            listClassName={listClassName}
        />
    );
    const historyTitle = t("legalTerminologies.history.title");
    const historyDescription = t("legalTerminologies.history.description");
    const examples = t("legalTerminologies.empty.examples", { returnObjects: true }) as string[];

    return (
        <TaskWorkspaceShell
            backgroundClassName="bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]"
            header={<TaskWorkspaceHeader icon={Scale} badgeIcon={BookOpenText} badgeLabel={t("legalTerminologies.header.badge")} title={t("legalTerminologies.header.title")} description={t("legalTerminologies.header.description")} backLabel={t("legalTerminologies.header.backToChat")} stats={stats} />}
            mobileHistory={<TaskHistoryDrawer title={historyTitle} description={historyDescription} count={terminologies.length} renderContent={(close) => renderHistory(close, "min-h-0 flex-1 overscroll-contain")} />}
            desktopHistory={<TaskHistoryCard title={historyTitle} description={historyDescription}>{renderHistory(undefined, "max-h-[520px]")}</TaskHistoryCard>}
        >
            <TaskPromptPanel id="legal-terminology-input" icon={BookOpenText} title={t("legalTerminologies.search.title")} description={t("legalTerminologies.search.description")} label={t("legalTerminologies.search.label")} placeholder={t("legalTerminologies.search.placeholder")} hint={t("legalTerminologies.search.hint")} disclaimer={t("legalTerminologies.search.disclaimer")} submitLabel={t("legalTerminologies.search.submit")} pendingLabel={t("legalTerminologies.search.loading")} value={term} isPending={isPending} onChange={setTerm} onSubmit={handleSubmit} />
            {isPending ? (
                <TerminologyLoadingState />
            ) : requestError ? (
                <TaskErrorState title={t("legalTerminologies.error.title")} description={requestError} retryLabel={t("legalTerminologies.error.retry")} onRetry={handleSubmit} />
            ) : selectedResult ? (
                <TerminologyResultCard terminology={selectedResult} />
            ) : (
                <TaskExampleEmptyState icon={Scale} exampleIcon={BookOpenText} title={t("legalTerminologies.empty.title")} description={t("legalTerminologies.empty.description")} examples={examples} onSelectExample={setTerm} />
            )}
        </TaskWorkspaceShell>
    );
}
