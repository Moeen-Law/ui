import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface TerminologyErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function TerminologyErrorState({ message, onRetry }: TerminologyErrorStateProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-destructive/40 bg-destructive/5 shadow-xl shadow-destructive/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle />
                    {t("legalTerminologies.error.title")}
                </CardTitle>
                <CardDescription>
                    {message || t("legalTerminologies.error.description")}
                </CardDescription>
            </CardHeader>
            {onRetry && (
                <CardContent>
                    <Button type="button" variant="destructive" onClick={onRetry}>
                        <RotateCcw data-icon="inline-start" />
                        {t("legalTerminologies.error.retry")}
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
