import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Wrench } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { authenticatedToolItems } from "@/shared/constants/tools";

interface ToolsDialogProps {
    trigger: ReactNode;
    onToolSelect?: () => void;
}

export default function ToolsDialog({ trigger, onToolSelect }: ToolsDialogProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleToolSelect = (href: string) => {
        onToolSelect?.();
        navigate(href);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-[28px] border border-border bg-background p-0 shadow-2xl sm:max-w-2xl">
                <DialogHeader className="border-b border-border bg-muted/40 p-6 pe-14 text-start">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500 shadow-[0_0_28px_rgba(59,130,246,0.16)]">
                        <Wrench className="size-5" aria-hidden="true" />
                    </div>
                    <DialogTitle className="font-['Cairo'] text-2xl font-black text-foreground">
                        {t("nav.tools")}
                    </DialogTitle>
                    <DialogDescription className="font-['Cairo'] leading-6 text-muted-foreground">
                        {t("nav.toolsDescription")}
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[min(68dvh,32rem)] overflow-y-auto p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {authenticatedToolItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.href}
                                    type="button"
                                    onClick={() => handleToolSelect(item.href)}
                                    className="group flex min-h-28 w-full cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card/70 p-4 text-start shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/35 hover:bg-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                >
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/10 text-blue-500 transition-colors group-hover:border-blue-500/35 group-hover:bg-blue-500 group-hover:text-white">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center justify-between gap-3">
                                            <span className="truncate font-['Cairo'] text-sm font-black text-foreground">
                                                {t(item.titleKey)}
                                            </span>
                                            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500 rtl:rotate-[-90deg] rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-y-0.5" />
                                        </span>
                                        <span className="mt-1 line-clamp-3 block font-['Cairo'] text-xs leading-5 text-muted-foreground">
                                            {t(item.descriptionKey)}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
