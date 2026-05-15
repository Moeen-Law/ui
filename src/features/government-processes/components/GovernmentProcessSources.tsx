import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GovernmentProcessSource } from "../types";

interface GovernmentProcessSourcesProps {
    sources: GovernmentProcessSource[];
}

export default function GovernmentProcessSources({
    sources,
}: GovernmentProcessSourcesProps) {
    if (sources.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sources.map((source, index) => {
                const title = source.title || source.url || `Source ${index + 1}`;
                const content = source.excerpt || source.url || title;

                return (
                    <article
                        key={source.id || `${title}-${index}`}
                        className="flex min-w-0 flex-col gap-3 rounded-xl border border-blue-500/10 bg-card p-4 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5"
                    >
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <FileText />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="break-words text-sm font-black leading-6">
                                    {title}
                                </h4>
                                {typeof source.score === "number" && (
                                    <Badge variant="secondary" className="mt-2 bg-amber-400/10 text-amber-600 dark:text-amber-400">
                                        {Math.round(source.score * 100)}%
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                            {content}
                        </p>
                    </article>
                );
            })}
        </div>
    );
}
