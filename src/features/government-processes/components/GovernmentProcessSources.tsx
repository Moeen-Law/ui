import { ExternalLink, FileText, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GovernmentProcessSource } from "../types";
import { parseSourceUrl } from "../helpers/formatters";

interface GovernmentProcessSourcesProps {
    sources: GovernmentProcessSource[];
}

export default function GovernmentProcessSources({
    sources,
}: GovernmentProcessSourcesProps) {
    const { t } = useTranslation();

    if (sources.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-3 xl:grid-cols-2">
            {sources.map((source, index) => {
                const parsedUrl = parseSourceUrl(source.url);
                const title =
                    source.title ||
                    parsedUrl?.hostname ||
                    t("governmentProcesses.sources.fallbackTitle", {
                        count: index + 1,
                    });
                const content = source.excerpt || source.url || title;

                return (
                    <article
                        key={source.id || `${title}-${index}`}
                        className="flex min-w-0 flex-col gap-4 rounded-xl border border-blue-500/10 bg-card p-4 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5"
                    >
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <FileText />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <div className="flex min-w-0 flex-wrap items-start gap-2">
                                    <h4 className="line-clamp-3 min-w-0 flex-1 break-words text-sm font-black leading-6">
                                        {title}
                                    </h4>
                                    {typeof source.score === "number" && (
                                        <Badge variant="secondary" className="shrink-0 bg-amber-400/10 text-amber-600 dark:text-amber-400">
                                            {Math.round(source.score * 100)}%
                                        </Badge>
                                    )}
                                </div>
                                {parsedUrl && (
                                    <div className="flex min-w-0 items-center gap-1.5 text-xs leading-5 text-muted-foreground">
                                        <Link2 data-icon="inline-start" />
                                        <span className="truncate" dir="ltr">
                                            {parsedUrl.hostname}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                            {content}
                        </p>
                        <div className="mt-auto flex min-w-0 items-center justify-between gap-3 border-t border-border pt-3">
                            <span className="min-w-0 truncate text-xs text-muted-foreground" dir="ltr">
                                {parsedUrl?.hostname ||
                                    t("governmentProcesses.sources.noLink")}
                            </span>
                            {parsedUrl ? (
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href={parsedUrl.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        aria-label={t(
                                            "governmentProcesses.sources.sourceLink",
                                            { title }
                                        )}
                                    >
                                        {t("governmentProcesses.sources.visit")}
                                        <ExternalLink data-icon="inline-end" />
                                    </a>
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" disabled>
                                    {t("governmentProcesses.sources.visit")}
                                    <ExternalLink data-icon="inline-end" />
                                </Button>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

