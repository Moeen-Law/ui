import { useMemo, useState } from "react";
import { ArrowRight, Building2, Home, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import {
    useCreateGovernmentProcess,
    useGovernmentProcesses,
} from "../hooks";
import { historyToGovernmentProcessResponse } from "../helpers";
import type { GovernmentProcessesRes } from "../types";
import GovernmentProcessEmptyState from "./GovernmentProcessEmptyState";
import GovernmentProcessErrorState from "./GovernmentProcessErrorState";
import GovernmentProcessHistoryDrawer from "./GovernmentProcessHistoryDrawer";
import GovernmentProcessHistoryStickyPanel from "./GovernmentProcessHistoryStickyPanel";
import GovernmentProcessLoadingState from "./GovernmentProcessLoadingState";
import GovernmentProcessResultCard from "./GovernmentProcessResultCard";
import GovernmentProcessSearchPanel from "./GovernmentProcessSearchPanel";

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

    return (
        <div className="min-h-dvh w-full overflow-x-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:gap-6 md:px-8 md:py-8">
                <header className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:gap-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-500" asChild>
                            <Link to="/chat">
                                <ArrowRight data-icon="inline-start" />
                                {t("governmentProcesses.header.backToChat")}
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-500" asChild>
                                <Link to="/" aria-label={t("chat.ui.home")}>
                                    <Home data-icon="inline-start" />
                                </Link>
                            </Button>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
                        <div className="flex min-w-0 flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10 md:size-12">
                                    <Landmark />
                                </div>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                    <Building2 data-icon="inline-start" />
                                    {t("governmentProcesses.header.badge")}
                                </Badge>
                            </div>
                            <div className="flex max-w-3xl flex-col gap-3">
                                <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
                                    {t("governmentProcesses.header.title")}
                                </h1>
                                <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
                                    {t("governmentProcesses.header.description")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
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

                <main className="grid min-w-0 grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="flex min-w-0 flex-col gap-5">
                        <div className="lg:hidden">
                            <GovernmentProcessHistoryDrawer
                                items={processes}
                                selectedId={selectedId}
                                hasNextPage={!!hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                onLoadMore={() => fetchNextPage()}
                                onSelect={handleSelectHistory}
                            />
                        </div>

                        <GovernmentProcessSearchPanel
                            value={query}
                            isPending={isPending}
                            onChange={setQuery}
                            onSubmit={handleSubmit}
                        />

                        {isPending ? (
                            <GovernmentProcessLoadingState />
                        ) : requestError ? (
                            <GovernmentProcessErrorState message={requestError} onRetry={handleSubmit} />
                        ) : selectedResult ? (
                            <GovernmentProcessResultCard process={selectedResult} />
                        ) : (
                            <GovernmentProcessEmptyState onSelectExample={setQuery} />
                        )}
                    </section>

                    <aside className="hidden min-w-0 lg:block">
                        <GovernmentProcessHistoryStickyPanel
                            items={processes}
                            selectedId={selectedId}
                            hasNextPage={!!hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={() => fetchNextPage()}
                            onSelect={handleSelectHistory}
                        />
                    </aside>
                </main>
            </div>
        </div>
    );
}
