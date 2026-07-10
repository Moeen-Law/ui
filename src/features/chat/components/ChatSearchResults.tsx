import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ChatResponseDatum } from "../types";

interface Props {
    chats: ChatResponseDatum[];
    shouldSearch: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
    onSelectChat: (chatId: string) => void;
}

export default function ChatSearchResults({ chats, shouldSearch, isLoading, isFetching, isError, hasNextPage, isFetchingNextPage, fetchNextPage, onSelectChat }: Props) {
    const { t, i18n } = useTranslation();
    const hasResults = chats.length > 0;
    return (
        <div className="max-h-96 overflow-y-auto px-1 pb-1">
            {!shouldSearch && <div className="py-6 text-center text-sm text-muted-foreground">{t("chat.search.emptyPrompt")}</div>}
            {shouldSearch && isLoading && <div className="flex flex-col gap-2 py-3"><Skeleton className="h-12 w-full rounded-lg" /><Skeleton className="h-12 w-full rounded-lg" /><Skeleton className="h-12 w-full rounded-lg" /></div>}
            {isError && <div className="py-6 text-center text-sm text-muted-foreground">{t("chat.search.error")}</div>}
            {shouldSearch && !isLoading && !isError && !hasResults && <div className="py-6 text-center text-sm text-muted-foreground">{t("chat.search.noResults")}</div>}
            {hasResults && (
                <div className="flex flex-col gap-1" role="list" aria-label={t("chat.search.results")}>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{t("chat.search.results")}</div>
                    {chats.map((chat) => (
                        <button key={chat.id} type="button" onClick={() => onSelectChat(chat.id)} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-start text-sm outline-hidden transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><MessageSquare className="size-4" /></span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold">{chat.title || t("chat.ui.newChat")}</span>
                                <span className="block truncate text-xs text-muted-foreground">{new Date(chat.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                            </span>
                        </button>
                    ))}
                </div>
            )}
            {hasNextPage && <div className="border-t border-border/60 p-2"><Button type="button" variant="ghost" size="sm" className="w-full" disabled={isFetchingNextPage} onClick={() => void fetchNextPage()}>{isFetchingNextPage ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}{t("chat.search.loadMore")}</Button></div>}
            {isFetching && !isLoading && !isFetchingNextPage && hasResults ? <div className="h-1 w-full overflow-hidden"><div className="h-full w-1/3 animate-pulse rounded-full bg-primary/40" /></div> : null}
        </div>
    );
}
