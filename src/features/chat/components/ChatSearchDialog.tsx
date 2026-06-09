import * as React from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, MessageSquare, Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useChatSearch } from "../hooks/useChatSearch"

export default function ChatSearchDialog() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [, startTransition] = React.useTransition()
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const titleId = React.useId()
    const descriptionId = React.useId()
    const debouncedSearch = useDebounce(search, 300)
    const {
        chats,
        shouldSearch,
        isLoading,
        isFetching,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useChatSearch(debouncedSearch)

    const hasResults = chats.length > 0
    const showLoading = shouldSearch && isLoading
    const showEmptyPrompt = !shouldSearch
    const showNoResults = shouldSearch && !isLoading && !isError && !hasResults

    const handleClose = React.useCallback(() => {
        setOpen(false)
        setSearch("")
    }, [])

    React.useEffect(() => {
        if (!open) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [handleClose, open])

    const handleSelectChat = React.useCallback((chatId: string) => {
        handleClose()

        startTransition(() => {
            navigate(`/chat/${chatId}`)
        })
    }, [handleClose, navigate, startTransition])

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                variant="outline"
                className="mb-6 h-11 w-full cursor-pointer justify-start gap-3 rounded-xl bg-background/70 px-4 font-sans font-semibold text-muted-foreground shadow-sm hover:-translate-y-px hover:text-foreground"
            >
                <Search data-icon="inline-start" />
                <span className="truncate">{t("chat.search.open")}</span>
            </Button>

            {open && createPortal(
                <div
                    data-testid="chat-search-overlay"
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/10 px-4 pt-[18vh] backdrop-blur-xs"
                    onMouseDown={handleClose}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className="relative flex w-full max-w-xl flex-col gap-2 overflow-hidden rounded-xl bg-popover p-1 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-xl"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="sr-only">
                            <h2 id={titleId}>{t("chat.search.title")}</h2>
                            <p id={descriptionId}>{t("chat.search.description")}</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute end-2 top-2 z-10"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <X />
                        </Button>
                        <div className="relative">
                            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                autoFocus
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t("chat.search.placeholder")}
                                className="h-10 rounded-lg bg-input/30 ps-9 pe-10"
                            />
                        </div>

                        <div className="max-h-96 overflow-y-auto px-1 pb-1">
                            {showEmptyPrompt && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {t("chat.search.emptyPrompt")}
                                </div>
                            )}

                            {showLoading && (
                                <div className="flex flex-col gap-2 py-3">
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>
                            )}

                            {isError && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {t("chat.search.error")}
                                </div>
                            )}

                            {showNoResults && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {t("chat.search.noResults")}
                                </div>
                            )}

                            {hasResults && (
                                <div className="flex flex-col gap-1" role="list" aria-label={t("chat.search.results")}>
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        {t("chat.search.results")}
                                    </div>
                                    {chats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            type="button"
                                            onClick={() => handleSelectChat(chat.id)}
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-start text-sm outline-hidden transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <MessageSquare className="size-4" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold">
                                                    {chat.title || t("chat.ui.newChat")}
                                                </span>
                                                <span className="block truncate text-xs text-muted-foreground">
                                                    {new Date(chat.createdAt).toLocaleDateString(
                                                        i18n.language === "ar" ? "ar-EG" : "en-US",
                                                        { month: "long", day: "numeric", year: "numeric" }
                                                    )}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {hasNextPage && (
                                <div className="border-t border-border/60 p-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="w-full"
                                        disabled={isFetchingNextPage}
                                        onClick={() => fetchNextPage()}
                                    >
                                        {isFetchingNextPage ? (
                                            <Loader2 data-icon="inline-start" className="animate-spin" />
                                        ) : null}
                                        {t("chat.search.loadMore")}
                                    </Button>
                                </div>
                            )}

                            {isFetching && !isLoading && !isFetchingNextPage && hasResults ? (
                                <div className="h-1 w-full overflow-hidden">
                                    <div className="h-full w-1/3 animate-pulse rounded-full bg-primary/40" />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
