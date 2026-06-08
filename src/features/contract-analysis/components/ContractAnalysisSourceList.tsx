import { useMemo, useState } from "react";
import { BookOpenText, ChevronDown, ChevronUp, FileText, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import type { ContractAnalysisSource } from "../types";

interface ContractAnalysisSourceListProps {
    sources: ContractAnalysisSource[];
}

const PAGE_SIZE = 5;
const ARTICLE_PREVIEW_LENGTH = 320;

export default function ContractAnalysisSourceList({ sources }: ContractAnalysisSourceListProps) {
    const sourceKey = sources
        .map((source) => `${source.metadata.law_number}-${source.metadata.article_number}`)
        .join("|");

    return <PaginatedContractAnalysisSourceList key={sourceKey} sources={sources} />;
}

function PaginatedContractAnalysisSourceList({ sources }: ContractAnalysisSourceListProps) {
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
                {t("contractAnalysis.sources.empty")}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {visibleSources.map((source, index) => (
                <div
                    key={`${source.metadata.law_number}-${source.metadata.article_number}-${index}`}
                    className="flex flex-col gap-3"
                >
                    {index > 0 && <Separator />}
                    <ContractAnalysisSourceCard source={source} />
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
                                    text={t("contractAnalysis.sources.previous")}
                                    aria-disabled={page === 1}
                                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setPage((currentPage) => Math.max(1, currentPage - 1));
                                    }}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                            href="#"
                                            isActive={pageNumber === page}
                                            className="cursor-pointer"
                                            onClick={(event) => {
                                            event.preventDefault();
                                            setPage(pageNumber);
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    text={t("contractAnalysis.sources.next")}
                                    aria-disabled={page === totalPages}
                                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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

function ContractAnalysisSourceCard({ source }: { source: ContractAnalysisSource }) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const metadata = source.metadata;
    const articleText = metadata.article_text ?? "";
    const shouldTruncate = articleText.length > ARTICLE_PREVIEW_LENGTH;
    const visibleArticleText =
        shouldTruncate && !isExpanded
            ? `${articleText.slice(0, ARTICLE_PREVIEW_LENGTH)}...`
            : articleText;

    return (
        <article className="flex min-w-0 gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 transition-colors hover:border-blue-500/30 max-sm:flex-col">
            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-blue-500">
                <FileText />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-start gap-2">
                    <h4 className="min-w-0 flex-1 break-words text-sm font-bold leading-6">
                        {metadata.law_name}
                    </h4>
                    <Badge variant="secondary" className="bg-amber-400/10 text-amber-600 dark:text-amber-400">
                        {t("contractAnalysis.sources.article", {
                            article: metadata.article_number,
                        })}
                    </Badge>
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {metadata.law_number && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-background px-2 py-1">
                            <Scale className="size-3.5 text-blue-500" />
                            {metadata.law_number}/{metadata.law_year}
                        </span>
                    )}
                    {metadata.domain && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-background px-2 py-1">
                            <BookOpenText className="size-3.5 text-blue-500" />
                            {metadata.domain}
                        </span>
                    )}
                    {metadata.law_type && (
                        <span className="rounded-lg bg-background px-2 py-1">
                            {metadata.law_type}
                        </span>
                    )}
                </div>

                {(metadata.kitab || metadata.bab || metadata.fasl) && (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {[metadata.kitab, metadata.bab, metadata.fasl].filter(Boolean).join(" - ")}
                    </p>
                )}

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-foreground/90">
                    {visibleArticleText}
                </p>

                {shouldTruncate && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 cursor-pointer px-0 text-blue-500 hover:bg-transparent hover:text-blue-600"
                        onClick={() => setIsExpanded((current) => !current)}
                    >
                        {isExpanded ? (
                            <ChevronUp data-icon="inline-start" />
                        ) : (
                            <ChevronDown data-icon="inline-start" />
                        )}
                        {isExpanded
                            ? t("contractAnalysis.sources.showLess")
                            : t("contractAnalysis.sources.showMore")}
                    </Button>
                )}
            </div>
        </article>
    );
}
