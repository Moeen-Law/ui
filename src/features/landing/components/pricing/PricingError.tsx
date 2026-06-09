import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingError({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();

    return (
        <Card className="mx-auto max-w-[720px] rounded-2xl border-destructive/30 bg-card p-6 shadow-sm">
            <CardHeader className="grid grid-cols-[auto_1fr] gap-5 px-2 text-start">
                <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <AlertCircle className="size-6" />
                </div>
                <div className="flex flex-col gap-2">
                    <CardTitle className="font-sans text-xl font-bold text-foreground">
                        {t("pricing.errorTitle")}
                    </CardTitle>
                    <CardDescription className="font-sans text-base leading-relaxed">
                        {t("pricing.errorDescription")}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardFooter className="justify-end bg-transparent px-2 pt-4">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onRetry}
                    className="border-destructive/20 font-sans hover:bg-destructive/10 hover:text-destructive"
                >
                    <RefreshCcw data-icon="inline-start" />
                    {t("pricing.retry")}
                </Button>
            </CardFooter>
        </Card>
    );
}
