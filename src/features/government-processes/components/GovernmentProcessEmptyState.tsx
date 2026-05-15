import { Building2, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GovernmentProcessEmptyStateProps {
    onSelectExample: (query: string) => void;
}

export default function GovernmentProcessEmptyState({
    onSelectExample,
}: GovernmentProcessEmptyStateProps) {
    const { t } = useTranslation();
    const examples = [
        t("governmentProcesses.empty.examples.passport"),
        t("governmentProcesses.empty.examples.birth"),
        t("governmentProcesses.empty.examples.license"),
    ];

    return (
        <Card className="min-h-[360px] justify-center border-dashed border-blue-500/25 bg-card/75 shadow-xl shadow-blue-500/5">
            <CardContent className="flex flex-col items-center gap-6 py-14 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
                    <Building2 />
                </div>
                <div className="flex max-w-xl flex-col gap-3">
                    <h2 className="text-2xl font-black md:text-3xl">
                        {t("governmentProcesses.empty.title")}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground md:text-base">
                        {t("governmentProcesses.empty.description")}
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {examples.map((example) => (
                        <Button
                            key={example}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="cursor-pointer border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={() => onSelectExample(example)}
                        >
                            <ClipboardList data-icon="inline-start" />
                            {example}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
