import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import type { Source } from "../types";

interface SourceListProps {
    sources: Source[];
}

const PAGE_SIZE = 5;

export default function SourceList({ sources }: SourceListProps) {
    const sourceKey = sources.map((source) => source.id).join("|");

    return <PaginatedSourceList key={sourceKey} sources={sources} />;
}

function PaginatedSourceList({ sources }: SourceListProps) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(sources.length / PAGE_SIZE);
    const hasPagination = totalPages > 1;

    const visibleSources = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return sources.slice(start, start + PAGE_SIZE);
    }, [page, sources]);

    if (sources.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
                {t("legalTerminologies.sources.empty")}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {visibleSources.map((source, index) => (
                <div key={source.id} className="flex flex-col gap-3">
                    {index > 0 && <Separator />}
                    <SourceCard source={source} />
                </div>
            ))}

            {hasPagination && (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        {page} / {totalPages}
                    </p>
                    <Pagination className="mx-0 justify-start sm:w-auto">
                        <PaginationContent className="gap-1">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    text={t("legalTerminologies.sources.previous", {
                                        defaultValue: t("admin.users.pagination.previous"),
                                    })}
                                    aria-disabled={page === 1}
                                    className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setPage((currentPage) => Math.max(1, currentPage - 1));
                                    }}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (pageNumber) => (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            isActive={pageNumber === page}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setPage(pageNumber);
                                            }}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    text={t("legalTerminologies.sources.next", {
                                        defaultValue: t("admin.users.pagination.next"),
                                    })}
                                    aria-disabled={page === totalPages}
                                    className={
                                        page === totalPages ? "pointer-events-none opacity-50" : undefined
                                    }
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setPage((currentPage) => Math.min(totalPages, currentPage + 1));
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}

interface SourceCardProps {
    source: Source;
}

function SourceCard({ source }: SourceCardProps) {
    return (
        <article className="flex min-w-0 gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 transition-colors hover:border-blue-500/30 max-sm:flex-col">
            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-blue-500">
                <FileText />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h4 className="min-w-0 break-words text-sm font-bold">
                        {source.title}
                    </h4>
                    <Badge variant="secondary" className="bg-amber-400/10 text-amber-600 dark:text-amber-400">
                        {Math.round(source.score * 100)}%
                    </Badge>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {source.excerpt}
                </p>
            </div>
        </article>
    );
}
