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

interface GovernmentProcessErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function GovernmentProcessErrorState({
    message,
    onRetry,
}: GovernmentProcessErrorStateProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-destructive/40 bg-destructive/5 shadow-xl shadow-destructive/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle />
                    {t("governmentProcesses.error.title")}
                </CardTitle>
                <CardDescription>
                    {message ||
                        t("governmentProcesses.error.description")}
                </CardDescription>
            </CardHeader>
            {onRetry && (
                <CardContent>
                    <Button type="button" variant="destructive" onClick={onRetry}>
                        <RotateCcw data-icon="inline-start" />
                        {t("governmentProcesses.error.retry")}
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
