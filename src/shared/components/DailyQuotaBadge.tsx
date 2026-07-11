import { AlertCircle, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface QuotaSummary { limit: number; remaining: number; used: number; }
interface DailyQuotaBadgeProps { quota?: QuotaSummary; isLoading?: boolean; isError?: boolean; className?: string; }

export default function DailyQuotaBadge({ quota, isLoading, isError, className }: DailyQuotaBadgeProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const exhausted = !!quota && quota.remaining <= 0;
    const low = !!quota && quota.remaining > 0 && quota.remaining <= 2;
    const unavailable = isError || !quota;
    const label = isLoading ? t("quota.loading") : unavailable ? t("quota.unavailable") : t("quota.badge", { remaining: quota.remaining, limit: quota.limit });
    const Icon = isLoading ? Loader2 : unavailable ? AlertCircle : Sparkles;
    return <button type="button" onClick={() => { if (!isLoading && !unavailable) navigate("/upgrade"); }} disabled={isLoading || unavailable} className={cn("inline-flex max-w-full items-center cursor-pointer gap-2 rounded-full border px-3 py-1.5 text-xs font-black shadow-lg transition disabled:cursor-default", unavailable || isLoading ? "border-border bg-muted/70 text-muted-foreground shadow-black/5" : exhausted ? "border-destructive/25 bg-destructive/10 text-destructive shadow-destructive/5" : low ? "border-amber-400/30 bg-amber-400/10 text-amber-500 shadow-amber-400/5" : "border-blue-500/20 bg-blue-500/10 text-blue-500 shadow-blue-500/5 hover:-translate-y-0.5", className)} title={t("quota.upgrade")}><Icon className={cn("size-3.5 shrink-0", isLoading && "animate-spin")} /><span className="min-w-0 truncate">{label}</span>{!isLoading && !unavailable ? <ArrowUpRight className="size-3.5 shrink-0" /> : null}</button>;
}
