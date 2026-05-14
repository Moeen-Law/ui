import { useMemo, useState } from "react";
import { ArrowRight, BookOpenText, Home, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useCreateLegalTerminology, useLegalTerminologies } from "../hooks";
import type { TerminologiesDatum, TerminologyResponse } from "../types";
import { historyToResponse } from "../helpers";
import TerminologySearchPanel from "./TerminologySearchPanel";
import TerminologyHistoryPanel from "./TerminologyHistoryPanel";
import TerminologyResultCard from "./TerminologyResultCard";
import TerminologyEmptyState from "./TerminologyEmptyState";
import TerminologyLoadingState from "./TerminologyLoadingState";
import TerminologyErrorState from "./TerminologyErrorState";
import { useTranslation } from "react-i18next";

export default function LegalTerminologiesContent() {
    const { t } = useTranslation();
    const [term, setTerm] = useState("");
    const [selectedResult, setSelectedResult] = useState<TerminologyResponse | null>(null);
    const [requestError, setRequestError] = useState<string | undefined>();

    const {
        terminologies,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useLegalTerminologies();
    const {
        createTerminologyAsync,
        isPending,
    } = useCreateLegalTerminology();

    const selectedId = selectedResult?.id;
    const trimmedTerm = term.trim();
    const recentCount = terminologies.length;

    const stats = useMemo(
        () => [
            {
                label: t("legalTerminologies.stats.history"),
                value: recentCount,
            },
            {
                label: t("legalTerminologies.stats.sources"),
                value: selectedResult?.result.sources?.length ?? 0,
            },
        ],
        [recentCount, selectedResult?.result.sources?.length, t]
    );

    const handleSubmit = async () => {
        if (trimmedTerm.length < 2 || isPending) return;

        setRequestError(undefined);
        try {
            const response = await createTerminologyAsync(trimmedTerm);
            setSelectedResult(response);
            setTerm("");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : t("legalTerminologies.error.description");
            setRequestError(message);
            toast.error(message);
        }
    };

    const handleSelectHistory = (item: TerminologiesDatum) => {
        setRequestError(undefined);
        setSelectedResult(historyToResponse(item));
    };

    return (
        <div className="min-h-dvh bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
                <header className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-500" asChild>
                            <Link to="/chat">
                                <ArrowRight data-icon="inline-start" />
                                {t("legalTerminologies.header.backToChat")}
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

                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10">
                                    <Scale />
                                </div>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                    <BookOpenText data-icon="inline-start" />
                                    {t("legalTerminologies.header.badge")}
                                </Badge>
                            </div>
                            <div className="flex max-w-3xl flex-col gap-3">
                                <h1 className="text-3xl font-black leading-tight md:text-5xl">
                                    {t("legalTerminologies.header.title")}
                                </h1>
                                <p className="text-base leading-8 text-muted-foreground md:text-lg">
                                    {t("legalTerminologies.header.description")}
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

                <main className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="flex min-w-0 flex-col gap-5">
                        <TerminologySearchPanel
                            value={term}
                            isPending={isPending}
                            onChange={setTerm}
                            onSubmit={handleSubmit}
                        />

                        {isPending ? (
                            <TerminologyLoadingState />
                        ) : requestError ? (
                            <TerminologyErrorState message={requestError} onRetry={handleSubmit} />
                        ) : selectedResult ? (
                            <TerminologyResultCard terminology={selectedResult} />
                        ) : (
                            <TerminologyEmptyState onSelectExample={setTerm} />
                        )}
                    </section>

                    <aside className="min-w-0">
                        <TerminologyHistoryPanel
                            items={terminologies}
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
