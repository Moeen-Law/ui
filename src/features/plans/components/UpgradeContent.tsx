import { ArrowLeft, ArrowRight, CheckCircle2, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useMe } from "@/features/auth/hooks/useMe";
import { PricingEmpty } from "@/features/landing/components/pricing/PricingEmpty";
import { PricingError } from "@/features/landing/components/pricing/PricingError";
import { PricingPlanCard } from "@/features/landing/components/pricing/PricingPlanCard";
import { PricingSkeleton } from "@/features/landing/components/pricing/PricingSkeleton";
import { usePlans } from "../hooks/usePlans";
import { getCurrentPlanIds } from "../helpers/subscriptions";

export default function UpgradeContent() {
    const { t, i18n } = useTranslation();
    const { plans, isLoading, isError, refetch } = usePlans();
    const { profile } = useMe();
    const currentPlanIds = getCurrentPlanIds(profile?.subscriptionInfo);
    const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;
    const currentPlanNames = plans
        ?.filter((plan) => currentPlanIds.has(plan.id))
        .map((plan) => plan.name)
        .join(", ");

    return (
        <div className="min-h-dvh w-full overflow-x-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:gap-6 md:px-8 md:py-8">
                <header className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:gap-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-500" asChild>
                            <Link to="/chat">
                                <BackIcon data-icon="inline-start" />
                                {t("upgrade.header.backToChat")}
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-500" asChild>
                                <Link to="/" aria-label={t("chat.ui.home")}>
                                    <Home data-icon="inline-start" />
                                </Link>
                            </Button>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
                        <div className="flex min-w-0 flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10 md:size-12">
                                    <Sparkles />
                                </div>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                    <CheckCircle2 data-icon="inline-start" />
                                    {t("upgrade.header.badge")}
                                </Badge>
                            </div>
                            <div className="flex max-w-3xl flex-col gap-3">
                                <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
                                    {t("upgrade.header.title")}
                                </h1>
                                <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
                                    {t("upgrade.header.description")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 shadow-lg shadow-blue-500/5">
                                <div className="truncate text-xl font-black text-blue-500 md:text-2xl">
                                    {currentPlanNames || t("upgrade.stats.noCurrentPlan")}
                                </div>
                                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {t("upgrade.stats.currentPlan")}
                                </div>
                            </div>
                            <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 shadow-lg shadow-blue-500/5">
                                <div className="text-2xl font-black text-blue-500">{plans?.length ?? 0}</div>
                                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {t("upgrade.stats.availablePlans")}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="min-w-0 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-xl shadow-blue-500/5 backdrop-blur md:p-6">
                    {isLoading ? (
                        <PricingSkeleton />
                    ) : isError ? (
                        <PricingError onRetry={() => void refetch()} />
                    ) : !plans?.length ? (
                        <PricingEmpty onRetry={() => void refetch()} />
                    ) : (
                        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                            {plans.map((plan) => (
                                <PricingPlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isCurrentPlan={currentPlanIds.has(plan.id)}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
