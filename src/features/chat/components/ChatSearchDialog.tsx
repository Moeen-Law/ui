import { createPortal } from "react-dom";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChatSearchDialog } from "../hooks/useChatSearchDialog";
import ChatSearchResults from "./ChatSearchResults";

export default function ChatSearchDialog() {
    const { t } = useTranslation();
    const titleId = useId();
    const descriptionId = useId();
    const dialog = useChatSearchDialog();
    const query = dialog.query;

    return (
        <>
            <Button type="button" onClick={() => dialog.setOpen(true)} variant="outline" className="mb-6 h-11 w-full cursor-pointer justify-start gap-3 rounded-xl bg-background/70 px-4 font-sans font-semibold text-muted-foreground shadow-sm hover:-translate-y-px hover:text-foreground">
                <Search data-icon="inline-start" /><span className="truncate">{t("chat.search.open")}</span>
            </Button>
            {dialog.open && createPortal(
                <div data-testid="chat-search-overlay" className="fixed inset-0 z-50 flex items-start justify-center bg-black/10 px-4 pt-[18vh] backdrop-blur-xs" onMouseDown={dialog.close}>
                    <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="relative flex w-full max-w-xl flex-col gap-2 overflow-hidden rounded-xl bg-popover p-1 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="sr-only"><h2 id={titleId}>{t("chat.search.title")}</h2><p id={descriptionId}>{t("chat.search.description")}</p></div>
                        <Button type="button" variant="ghost" size="icon-sm" className="absolute end-2 top-2 z-10" onClick={dialog.close} aria-label="Close"><X /></Button>
                        <div className="relative">
                            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input autoFocus value={dialog.search} onChange={(event) => dialog.setSearch(event.target.value)} placeholder={t("chat.search.placeholder")} className="h-10 rounded-lg bg-input/30 ps-9 pe-10" />
                        </div>
                        <ChatSearchResults
                            chats={query.chats}
                            shouldSearch={query.shouldSearch}
                            isLoading={query.isLoading}
                            isFetching={query.isFetching}
                            isError={query.isError}
                            hasNextPage={!!query.hasNextPage}
                            isFetchingNextPage={query.isFetchingNextPage}
                            fetchNextPage={query.fetchNextPage}
                            onSelectChat={dialog.selectChat}
                        />
                    </div>
                </div>, document.body
            )}
        </>
    );
}
