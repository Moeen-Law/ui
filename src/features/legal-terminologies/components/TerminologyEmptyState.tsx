import { BookOpenText, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface TerminologyEmptyStateProps {
    onSelectExample: (term: string) => void;
}

export default function TerminologyEmptyState({ onSelectExample }: TerminologyEmptyStateProps) {
    const { t } = useTranslation();
    const exampleTerms = t("legalTerminologies.empty.examples", {
        returnObjects: true,
    }) as string[];

    return (
        <Card className="min-h-[360px] justify-center border-dashed border-blue-500/25 bg-card/75 shadow-xl shadow-blue-500/5">
            <CardContent className="flex flex-col items-center gap-6 py-14 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
                    <Scale />
                </div>
                <div className="flex max-w-xl flex-col gap-3">
                    <h2 className="text-2xl font-black md:text-3xl">
                        {t("legalTerminologies.empty.title")}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground md:text-base">
                        {t("legalTerminologies.empty.description")}
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {exampleTerms.map((term) => (
                        <Button
                            key={term}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-blue-500/20 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={() => onSelectExample(term)}
                        >
                            <BookOpenText data-icon="inline-start" />
                            {term}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
