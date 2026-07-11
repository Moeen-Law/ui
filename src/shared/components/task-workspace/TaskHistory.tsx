import { useState, type ReactNode } from "react";
import { AlertCircle, History, Loader2, RotateCcw, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface TaskHistoryLabels {
    empty: string;
    error: string;
    retry: string;
    loadMore: string;
}

export interface TaskHistoryListProps<T> {
    items: T[];
    getItemId: (item: T) => string;
    selectedId?: string;
    renderItem: (item: T) => ReactNode;
    onSelect: (item: T) => void;
    onItemSelected?: () => void;
    isLoading?: boolean;
    isError?: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onRetry?: () => void;
    labels: TaskHistoryLabels;
    listClassName?: string;
}

export function TaskHistoryList<T>({
    items, getItemId, selectedId, renderItem, onSelect, onItemSelected,
    isLoading = false, isError = false, hasNextPage, isFetchingNextPage,
    onLoadMore, onRetry, labels, listClassName,
}: TaskHistoryListProps<T>) {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            {isLoading ? (
                <div className="flex flex-col gap-2" aria-label={labels.empty}>
                    {[0, 1, 2].map((item) => <Skeleton key={item} className="h-20 rounded-xl" />)}
                </div>
            ) : isError ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
                    <AlertCircle className="text-destructive" />
                    <p className="text-sm leading-6 text-muted-foreground">{labels.error}</p>
                    {onRetry ? <Button type="button" variant="destructive" size="sm" onClick={onRetry}><RotateCcw data-icon="inline-start" />{labels.retry}</Button> : null}
                </div>
            ) : items.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center">
                    <Search className="text-blue-500" />
                    <p className="text-sm text-muted-foreground">{labels.empty}</p>
                </div>
            ) : (
                <div className={cn("flex min-h-0 flex-col gap-2 overflow-y-auto pe-1 admin-table-scrollbar", listClassName)}>
                    {items.map((item) => {
                        const id = getItemId(item);
                        return (
                            <button key={id} type="button" onClick={() => { onSelect(item); onItemSelected?.(); }} className={cn("group flex w-full cursor-pointer flex-col gap-2 rounded-xl border p-3 text-start transition-all hover:border-blue-500/40 hover:bg-blue-500/5", selectedId === id ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10" : "border-border bg-background")}>
                                {renderItem(item)}
                            </button>
                        );
                    })}
                </div>
            )}
            {hasNextPage ? <><Separator /><Button type="button" variant="outline" className="cursor-pointer border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500" onClick={onLoadMore} disabled={isFetchingNextPage}>{isFetchingNextPage ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}{labels.loadMore}</Button></> : null}
        </div>
    );
}

interface TaskHistoryContainerProps { title: string; description: string; children: ReactNode; }

export function TaskHistoryCard({ title, description, children }: TaskHistoryContainerProps) {
    return <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5"><CardHeader><CardTitle className="flex items-center gap-2 text-lg font-black"><History className="text-blue-500" />{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent>{children}</CardContent></Card>;
}

interface TaskHistoryDrawerProps extends Omit<TaskHistoryContainerProps, "children"> { count: number; renderContent: (close: () => void) => ReactNode; }

export function TaskHistoryDrawer({ title, description, count, renderContent }: TaskHistoryDrawerProps) {
    const [open, setOpen] = useState(false);
    return <Drawer direction="bottom" open={open} onOpenChange={setOpen}><DrawerTrigger asChild><Button type="button" variant="outline" className="w-full cursor-pointer justify-between border-blue-500/20 bg-card/90 text-start shadow-lg shadow-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10"><span className="flex min-w-0 items-center gap-2"><History className="shrink-0 text-blue-500" /><span className="truncate font-bold">{title}</span></span><Badge variant="secondary" className="shrink-0 bg-blue-500/10 text-blue-500">{count}</Badge></Button></DrawerTrigger><DrawerContent className="h-[85dvh] max-h-[85dvh] overflow-hidden rounded-t-2xl"><div className="flex h-full min-h-0 flex-col"><DrawerHeader className="shrink-0 border-b border-blue-500/10 text-start"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><DrawerTitle className="flex items-center gap-2 text-lg font-black"><History className="shrink-0 text-blue-500" />{title}</DrawerTitle><DrawerDescription className="mt-1 leading-6">{description}</DrawerDescription></div><DrawerClose asChild><Button type="button" variant="ghost" size="icon" aria-label={title}><X /></Button></DrawerClose></div></DrawerHeader><div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">{renderContent(() => setOpen(false))}</div></div></DrawerContent></Drawer>;
}
