import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { FilePlus2, Home, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import DailyQuotaBadge from "@/features/chat/components/DailyQuotaBadge";
import type { Quota } from "@/features/chat/types";

interface DocumentGenerationStat {
    label: string;
    value: number;
}

interface DocumentGenerationHeaderProps {
    stats: DocumentGenerationStat[];
    BackIcon: LucideIcon;
    quota?: Quota;
    isQuotaLoading?: boolean;
    isQuotaError?: boolean;
}

export default function DocumentGenerationHeader({
    stats,
    BackIcon,
    quota,
    isQuotaLoading,
    isQuotaError,
}: DocumentGenerationHeaderProps) {
    const { t } = useTranslation();

    return (
        <header className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:gap-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                    <Link to="/chat">
                        <BackIcon data-icon="inline-start" />
                        {t("documentGeneration.header.backToChat")}
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                        <Link to="/" aria-label={t("chat.ui.home")}>
                            <Home data-icon="inline-start" />
                        </Link>
                    </Button>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>

            <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10 md:size-12">
                            <FilePlus2 />
                        </div>
                        <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                            <ScrollText data-icon="inline-start" />
                            {t("documentGeneration.header.badge")}
                        </Badge>
                        <DailyQuotaBadge
                            quota={quota}
                            isLoading={isQuotaLoading}
                            isError={isQuotaError}
                        />
                    </div>
                    <div className="flex max-w-3xl flex-col gap-3">
                        <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
                            {t("documentGeneration.header.title")}
                        </h1>
                        <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
                            {t("documentGeneration.header.description")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 shadow-lg shadow-blue-500/5"
                        >
                            <div className="text-2xl font-black text-blue-500">{stat.value}</div>
                            <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}
