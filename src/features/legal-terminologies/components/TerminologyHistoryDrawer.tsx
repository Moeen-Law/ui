import { useState } from "react";
import { History, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import type { TerminologiesDatum } from "../types";
import TerminologyHistoryList from "./TerminologyHistoryList";

interface TerminologyHistoryDrawerProps {
    items: TerminologiesDatum[];
    selectedId?: string;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onSelect: (terminology: TerminologiesDatum) => void;
}

export default function TerminologyHistoryDrawer({
    items,
    selectedId,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onSelect,
}: TerminologyHistoryDrawerProps) {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <Drawer direction="bottom" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer justify-between border-blue-500/20 bg-card/90 text-start shadow-lg shadow-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10"
                >
                    <span className="flex min-w-0 items-center gap-2">
                        <History className="shrink-0 text-blue-500" />
                        <span className="truncate font-bold">
                            {t("legalTerminologies.history.title")}
                        </span>
                    </span>
                    <Badge variant="secondary" className="shrink-0 bg-blue-500/10 text-blue-500">
                        {items.length}
                    </Badge>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85dvh] max-h-[85dvh] overflow-hidden rounded-t-2xl">
                <div className="flex h-full min-h-0 flex-col">
                    <DrawerHeader className="shrink-0 border-b border-blue-500/10 text-start">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <DrawerTitle className="flex items-center gap-2 text-lg font-black">
                                    <History className="shrink-0 text-blue-500" />
                                    {t("legalTerminologies.history.title")}
                                </DrawerTitle>
                                <DrawerDescription className="mt-1 leading-6">
                                    {t("legalTerminologies.history.description")}
                                </DrawerDescription>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 hover:bg-blue-500/10 hover:text-blue-500"
                                    aria-label={t("legalTerminologies.history.title")}
                                >
                                    <X />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
                        <TerminologyHistoryList
                            items={items}
                            selectedId={selectedId}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={onLoadMore}
                            onSelect={onSelect}
                            onItemSelected={() => setIsDrawerOpen(false)}
                            listClassName="min-h-0 flex-1 overscroll-contain"
                        />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
