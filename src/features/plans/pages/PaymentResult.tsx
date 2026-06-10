import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, ArrowRight, CheckCircle2, MessageCircle, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoeenLogo } from "@/shared/components/MoeenLogo";
import { cn } from "@/lib/utils";

export default function PaymentResult() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const paymentId = searchParams.get("paymentId");
    const reason = searchParams.get("reason");
    const isSuccess = status === "success";
    const Icon = isSuccess ? CheckCircle2 : AlertCircle;

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10 font-sans text-foreground">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_58%)]" />
            <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(#3a3a3a 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />

            <section className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-8 text-center">
                <MoeenLogo size="md" className="justify-center" />

                <Card className="w-full rounded-2xl border border-border bg-card/90 p-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-6 px-6 py-10 sm:px-10">
                        <div
                            className={cn(
                                "flex size-20 items-center justify-center rounded-2xl border shadow-lg",
                                isSuccess
                                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10"
                                    : "border-destructive/25 bg-destructive/10 text-destructive shadow-destructive/10"
                            )}
                        >
                            <Icon className="size-10" aria-hidden="true" />
                        </div>

                        <div className="flex max-w-xl flex-col gap-3">
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-500">
                                {t("paymentResult.badge")}
                            </p>
                            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                                {isSuccess ? t("paymentResult.successTitle") : t("paymentResult.failedTitle")}
                            </h1>
                            <p className="text-base font-medium leading-7 text-muted-foreground sm:text-lg">
                                {isSuccess
                                    ? t("paymentResult.successDescription")
                                    : reason === "payment_not_found"
                                        ? t("paymentResult.paymentNotFound")
                                        : t("paymentResult.failedDescription")}
                            </p>
                        </div>

                        {paymentId && (
                            <div className="flex w-full max-w-md items-center justify-center gap-3 rounded-xl border border-border bg-background/55 px-4 py-3 text-sm text-muted-foreground">
                                <ReceiptText className="size-4 shrink-0 text-amber-400" aria-hidden="true" />
                                <span className="font-bold">{t("paymentResult.paymentId")}</span>
                                <span className="min-w-0 truncate font-mono" title={paymentId}>
                                    {paymentId}
                                </span>
                            </div>
                        )}

                        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
                            <Button asChild className="h-12 rounded-xl bg-blue-500 px-6 text-base font-black text-white hover:bg-blue-600">
                                <Link to="/chat">
                                    <MessageCircle className="size-5" aria-hidden="true" />
                                    {t("paymentResult.openChat")}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-12 rounded-xl border-2 px-6 text-base font-black">
                                <Link to="/#pricing">
                                    {t("paymentResult.backToPricing")}
                                    <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
