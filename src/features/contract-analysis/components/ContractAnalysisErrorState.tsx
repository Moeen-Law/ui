import { AlertCircle, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface ContractAnalysisErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ContractAnalysisErrorState({
    message,
    onRetry,
}: ContractAnalysisErrorStateProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-destructive/40 bg-destructive/5 shadow-xl shadow-destructive/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle />
                    {t("contractAnalysis.error.title")}
                </CardTitle>
                <CardDescription>
                    {message || t("contractAnalysis.error.description")}
                </CardDescription>
            </CardHeader>
            {onRetry && (
                <CardContent>
                    <Button type="button" variant="destructive" onClick={onRetry}>
                        <RotateCcw data-icon="inline-start" />
                        {t("contractAnalysis.error.retry")}
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
