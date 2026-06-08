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
import type { ContractAnalysisResponse } from "../types";
import ContractAnalysisHistoryList from "./ContractAnalysisHistoryList";

interface ContractAnalysisHistoryDrawerProps {
    items: ContractAnalysisResponse[];
    selectedId?: string;
    hasNextPage: boolean;
    isLoading?: boolean;
    isFetchingNextPage: boolean;
    isError?: boolean;
    onLoadMore: () => void;
    onRetry?: () => void;
    onSelect: (analysis: ContractAnalysisResponse) => void;
}

export default function ContractAnalysisHistoryDrawer({
    items,
    selectedId,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    onLoadMore,
    onRetry,
    onSelect,
}: ContractAnalysisHistoryDrawerProps) {
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
                            {t("contractAnalysis.history.title")}
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
                                    {t("contractAnalysis.history.title")}
                                </DrawerTitle>
                                <DrawerDescription className="mt-1 leading-6">
                                    {t("contractAnalysis.history.description")}
                                </DrawerDescription>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 cursor-pointer hover:bg-blue-500/10 hover:text-blue-500"
                                    aria-label={t("contractAnalysis.history.title")}
                                >
                                    <X />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
                        <ContractAnalysisHistoryList
                            items={items}
                            selectedId={selectedId}
                            hasNextPage={hasNextPage}
                            isLoading={isLoading}
                            isFetchingNextPage={isFetchingNextPage}
                            isError={isError}
                            onLoadMore={onLoadMore}
                            onRetry={onRetry}
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
