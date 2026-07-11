import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileCheck2, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import DocumentHistoryList, { type DocumentHistoryListProps } from "./DocumentHistoryList";

interface DocumentHistoryPanelProps extends DocumentHistoryListProps {
    isMobile?: boolean;
}

export default function DocumentHistoryPanel(props: DocumentHistoryPanelProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    if (props.isMobile) {
        return (
            <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer justify-between border-blue-500/20 bg-card/90 text-start shadow-lg shadow-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <History className="shrink-0 text-blue-500" />
                            <span className="truncate font-bold">
                                {t("documentGeneration.history.title")}
                            </span>
                        </span>
                        <Badge variant="secondary" className="shrink-0 bg-blue-500/10 text-blue-500">
                            {props.documents.length}
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
                                        {t("documentGeneration.history.title")}
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        {t("documentGeneration.history.description")}
                                    </DrawerDescription>
                                </div>
                                <DrawerClose asChild>
                                    <Button type="button" variant="ghost" size="icon">
                                        <FileCheck2 />
                                    </Button>
                                </DrawerClose>
                            </div>
                        </DrawerHeader>
                        <div className="min-h-0 flex-1 overflow-hidden p-4">
                            <DocumentHistoryList
                                {...props}
                                onItemSelected={() => setOpen(false)}
                            />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <History className="text-blue-500" />
                    {t("documentGeneration.history.title")}
                </CardTitle>
                <CardDescription>
                    {t("documentGeneration.history.description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[560px] overflow-hidden">
                <DocumentHistoryList {...props} />
            </CardContent>
        </Card>
    );
}
