import { AlertTriangle, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Quota } from "../types";
import { isQuotaExhausted } from "../hooks/useDailyQuota";
import { cn } from "@/lib/utils";

interface QuotaNoticeProps {
    quota?: Quota;
    kind: "chat" | "doc_analysis" | "doc_gen";
    className?: string;
}

const getQuotaMessageKey = (
    kind: QuotaNoticeProps["kind"],
    exhausted: boolean
) => {
    if (kind === "chat") {
        return exhausted ? "quota.exhausted.chat" : "quota.low.chat";
    }

    if (kind === "doc_analysis") {
        return exhausted ? "quota.exhausted.doc_analysis" : "quota.low.doc_analysis";
    }

    return exhausted ? "quota.exhausted.doc_gen" : "quota.low.doc_gen";
};

export default function QuotaNotice({ quota, kind, className }: QuotaNoticeProps) {
    const { t } = useTranslation();
    if (!quota) return null;

    const exhausted = isQuotaExhausted(quota);
    const Icon = exhausted ? LockKeyhole : AlertTriangle;
    const messageKey = getQuotaMessageKey(kind, exhausted);

    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-sm leading-6",
                exhausted
                    ? "border-destructive/25 bg-destructive/10 text-destructive"
                    : "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
                className
            )}
        >
            <div className="flex min-w-0 items-start gap-2">
                <Icon className="mt-0.5 size-4 shrink-0" />
                <span>
                    {t(messageKey, {
                        count: quota.remaining,
                    })}
                </span>
            </div>
            <Link
                to="/upgrade"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-blue-600"
            >
                {t("quota.upgrade")}
                <ArrowUpRight className="size-3.5" />
            </Link>
        </div>
    );
}
