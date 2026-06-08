import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentGenerationLoadingState() {
    const { t } = useTranslation();

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
            <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center">
                <Loader2 className="size-10 animate-spin text-blue-500" />
                <p className="font-black">
                    {t("documentGeneration.status.generating")}
                </p>
            </CardContent>
        </Card>
    );
}
