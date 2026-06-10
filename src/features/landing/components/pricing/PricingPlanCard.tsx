import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/features/auth/store/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PlanResponse } from "@/features/plans/types";
import { PRICING_REDIRECT_TARGET } from "@/features/auth/helpers/redirect";
import { formatPrice, getLocale } from "@/features/landing/helpers";
import { PlanFeature } from "./PlanFeature";
import { useStartPlanPayment } from "@/features/plans/hooks/useStartPlanPayment";
import { Loader2 } from "lucide-react";

interface PricingPlanCardProps {
    plan: PlanResponse;
    isCurrentPlan: boolean;
}

export function PricingPlanCard({ plan, isCurrentPlan }: PricingPlanCardProps) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { accessToken } = useAuthStore();
    const { startPlanPayment, isPending } = useStartPlanPayment();
    const locale = getLocale(i18n.resolvedLanguage ?? i18n.language);
    const isBestPlan = plan.isBestPlan;
    const durationLabel =
        plan.durationDays === 30
            ? t("pricing.durationMonthly")
            : t("pricing.durationDays", { count: plan.durationDays });

    const handlePlanClick = () => {
        if (isCurrentPlan || isPending) {
            return;
        }

        if (accessToken) {
            startPlanPayment(plan.id);
            return;
        }

        navigate(`/login?redirect=${encodeURIComponent(PRICING_REDIRECT_TARGET)}`);
    };

    return (
        <Card
            className={cn(
                "group/card relative min-h-[460px] overflow-hidden rounded-2xl p-5 transition-all duration-300",
                isBestPlan
                    ? "z-10 border-2 border-blue-500/80 bg-card shadow-[0_22px_50px_rgba(59,130,246,0.18)] lg:-translate-y-2 hover:-translate-y-3 hover:shadow-[0_28px_64px_rgba(59,130,246,0.24)]"
                    : "border border-border bg-card hover:-translate-y-2 hover:border-blue-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.16)]"
            )}
        >

            <div className="relative z-10 flex h-full flex-col">
                <CardHeader className="gap-6 px-3 pt-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex max-w-[78%] flex-col gap-3 text-start">
                            {isBestPlan && (
                                <Badge
                                    className="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 font-sans text-xs font-extrabold tracking-wide text-blue-500 shadow-[0_10px_24px_rgba(59,130,246,0.22)]"
                                    variant="default"
                                >
                                    {t("pricing.recommended")}
                                </Badge>
                            )}
                            <CardTitle className="font-sans text-2xl font-extrabold text-foreground">
                                {plan.name}
                            </CardTitle>
                            <CardDescription className="font-sans text-[0.95rem] leading-relaxed">
                                {plan.description}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex items-end gap-3 pt-2 text-start">
                        <span className={cn(
                            "text-5xl font-black tracking-tight transition-colors",
                            isBestPlan ? "text-blue-500" : "text-foreground group-hover/card:text-blue-500"
                        )}>
                            {formatPrice(plan.price, locale)}
                        </span>
                        <div className="flex flex-col justify-end pb-1.5">
                            <span className="font-sans text-sm font-bold text-muted-foreground">
                                {t("pricing.currency")}
                            </span>
                            <span className="font-sans text-xs font-medium text-muted-foreground">
                                {durationLabel}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-6 px-3 py-6">
                    <Separator />
                    <ul className="flex flex-col gap-4">
                        <PlanFeature>
                            {t("pricing.limits.textRequests", {
                                count: plan.maxTextRequestsPerDay,
                            })}
                        </PlanFeature>
                        <PlanFeature>
                            {t("pricing.limits.documentAnalysis", {
                                count: plan.maxDocumentAnalysisPerDay,
                            })}
                        </PlanFeature>
                        <PlanFeature>
                            {t("pricing.limits.documentGeneration", {
                                count: plan.maxDocumentGenerationPerDay,
                            })}
                        </PlanFeature>
                    </ul>
                </CardContent>

                <CardFooter className="mt-auto bg-transparent px-3 pb-2 pt-4">
                    <Button
                        type="button"
                        className={cn(
                            "h-12 w-full rounded-xl font-sans text-base font-bold transition-all duration-300",
                            isCurrentPlan
                                ? "cursor-not-allowed border-2 border-border bg-transparent text-muted-foreground"
                                : isBestPlan
                                    ? "cursor-pointer border-2 border-blue-500 bg-blue-500 text-white shadow-[0_12px_30px_rgba(59,130,246,0.24)] hover:bg-blue-600"
                                    : "cursor-pointer border-2 border-border bg-transparent text-foreground hover:border-blue-500 hover:bg-blue-500/10"
                        )}
                        variant={isBestPlan && !isCurrentPlan ? "default" : "outline"}
                        onClick={handlePlanClick}
                        disabled={isCurrentPlan || isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" />
                                {t("pricing.startingPayment")}
                            </>
                        ) : isCurrentPlan ? (
                            t("pricing.currentPlan")
                        ) : (
                            t("pricing.startPlan")
                        )}
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
}
