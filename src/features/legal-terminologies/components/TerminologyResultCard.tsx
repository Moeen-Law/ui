import { BookOpenText, CheckCircle2, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TerminologyResponse } from "../types";
import SourceList from "./SourceList";
import { useTranslation } from "react-i18next";

interface TerminologyResultCardProps {
    terminology: TerminologyResponse;
}

export default function TerminologyResultCard({ terminology }: TerminologyResultCardProps) {
    const { t } = useTranslation();
    const result = terminology.result;
    const examples = result.examples ?? [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
        >
            <Card className="border-blue-500/20 shadow-2xl shadow-blue-500/10">
                <CardHeader className="gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10">
                                <Scale />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-2xl font-black md:text-3xl">
                                    {result.term || terminology.input.terminology}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {t("legalTerminologies.result.subtitle")}
                                </CardDescription>
                            </div>
                        </div>
                        {result.rag_used && (
                            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                <CheckCircle2 data-icon="inline-start" />
                                {t("legalTerminologies.result.ragUsed")}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-7">
                    <section className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
                        <h3 className="mb-3 flex items-center gap-2 text-base font-black">
                            <BookOpenText className="text-blue-500" />
                            {t("legalTerminologies.result.brief")}
                        </h3>
                        <p className="text-base leading-8 text-foreground/90">
                            {result.brief_explanation}
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-base font-black">
                                {t("legalTerminologies.result.examples")}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t("legalTerminologies.result.examplesDescription")}
                            </p>
                        </div>
                        {examples.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                {examples.map((example, index) => (
                                    <div
                                        key={`${example}-${index}`}
                                        className="rounded-xl border border-blue-500/15 bg-card p-4 text-sm leading-7 transition-colors hover:border-blue-500/40 hover:bg-blue-500/5"
                                    >
                                        {example}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
                                {t("legalTerminologies.result.noExamples")}
                            </div>
                        )}
                    </section>

                    <Separator />

                    <section className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-base font-black">
                                {t("legalTerminologies.sources.title")}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t("legalTerminologies.sources.description")}
                            </p>
                        </div>
                        <SourceList sources={result.sources ?? []} />
                    </section>
                </CardContent>
            </Card>
        </motion.div>
    );
}
