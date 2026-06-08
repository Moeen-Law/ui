import { useTranslation } from "react-i18next";
import { FileCheck2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentGenerationEmptyState() {
    const { t } = useTranslation();

    return (
        <Card className="border-dashed border-blue-500/20 bg-card/80 shadow-xl shadow-blue-500/5">
            <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center">
                <FileCheck2 className="size-10 text-blue-500" />
                <p className="max-w-md font-black">
                    {t("documentGeneration.empty.title")}
                </p>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                    {t("documentGeneration.empty.description")}
                </p>
            </CardContent>
        </Card>
    );
}
