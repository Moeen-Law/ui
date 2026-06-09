import { useTranslation } from "react-i18next";
import { RefreshCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingEmpty({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();

    return (
        <Card className="mx-auto max-w-[720px] rounded-2xl border-border bg-card p-8 text-center shadow-sm">
            <CardHeader className="items-center px-2 pb-6">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <LayoutDashboard className="size-8" />
                </div>
                <CardTitle className="mb-2 font-sans text-2xl font-bold text-foreground">
                    {t("pricing.emptyTitle")}
                </CardTitle>
                <CardDescription className="mx-auto max-w-[520px] font-sans text-base leading-relaxed">
                    {t("pricing.emptyDescription")}
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center bg-transparent px-2 pt-2">
                <Button 
                    type="button" 
                    variant="default" 
                    onClick={onRetry}
                    className="h-11 rounded-xl bg-blue-500 px-8 font-sans text-white hover:bg-blue-400"
                >
                    <RefreshCcw data-icon="inline-start" />
                    {t("pricing.retry")}
                </Button>
            </CardFooter>
        </Card>
    );
}
