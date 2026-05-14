import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Source } from "../types";
import { useTranslation } from "react-i18next";

interface SourceListProps {
    sources: Source[];
}

export default function SourceList({ sources }: SourceListProps) {
    const { t } = useTranslation();

    if (sources.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
                {t("legalTerminologies.sources.empty")}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {sources.map((source, index) => (
                <div key={source.id} className="flex flex-col gap-3">
                    {index > 0 && <Separator />}
                    <article className="flex gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 transition-colors hover:border-blue-500/30">
                        <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-blue-500">
                            <FileText />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h4 className="truncate text-sm font-bold">
                                    {source.title}
                                </h4>
                                <Badge variant="secondary" className="bg-amber-400/10 text-amber-600 dark:text-amber-400">
                                    {Math.round(source.score * 100)}%
                                </Badge>
                            </div>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                {source.excerpt}
                            </p>
                        </div>
                    </article>
                </div>
            ))}
        </div>
    );
}
