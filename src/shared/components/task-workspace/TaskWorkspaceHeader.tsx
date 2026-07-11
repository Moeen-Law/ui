import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";

export interface TaskWorkspaceStat {
    label: string;
    value: ReactNode;
}

interface TaskWorkspaceHeaderProps {
    icon: LucideIcon;
    badgeIcon: LucideIcon;
    badgeLabel: string;
    title: string;
    description: string;
    backLabel: string;
    stats: TaskWorkspaceStat[];
    supplementaryBadge?: ReactNode;
    statsColumns?: 2 | 3;
    statsWidth?: "340px" | "420px";
}

export function TaskWorkspaceHeader({
    icon: Icon,
    badgeIcon: BadgeIcon,
    badgeLabel,
    title,
    description,
    backLabel,
    stats,
    supplementaryBadge,
    statsColumns = 2,
    statsWidth = "340px",
}: TaskWorkspaceHeaderProps) {
    const { t, i18n } = useTranslation();
    const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;

    return (
        <header className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:gap-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                    <Link to="/chat">
                        <BackIcon data-icon="inline-start" />
                        {backLabel}
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                        <Link to="/" aria-label={t("chat.ui.home")}>
                            <Home />
                        </Link>
                    </Button>
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>
            <div className={cn("grid min-w-0 gap-5 lg:items-end", statsWidth === "420px" ? "lg:grid-cols-[minmax(0,1fr)_420px]" : "lg:grid-cols-[minmax(0,1fr)_340px]")}>
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10 md:size-12">
                            <Icon />
                        </div>
                        <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                            <BadgeIcon data-icon="inline-start" />
                            {badgeLabel}
                        </Badge>
                        {supplementaryBadge}
                    </div>
                    <div className="flex max-w-3xl flex-col gap-3">
                        <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">{title}</h1>
                        <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">{description}</p>
                    </div>
                </div>
                <div className={cn("grid gap-3", statsColumns === 3 ? "grid-cols-3" : "grid-cols-2")}>
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 shadow-lg shadow-blue-500/5">
                            <div className="text-2xl font-black text-blue-500">{stat.value}</div>
                            <div className="mt-1 text-xs leading-5 text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}
