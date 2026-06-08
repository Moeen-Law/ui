import { BookOpenText, CheckCircle2, ClipboardList, FileText, Link2, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import MarkdownRenderer from "@/features/chat/components/MarkdownRenderer";
import type { ContractAnalysisResponse } from "../types";
import { isCompletedContractAnalysisStatus } from "../helpers";
import ContractAnalysisSourceList from "./ContractAnalysisSourceList";

interface ContractAnalysisResultCardProps {
    analysis: ContractAnalysisResponse;
}

export default function ContractAnalysisResultCard({
    analysis,
}: ContractAnalysisResultCardProps) {
    const { t, i18n } = useTranslation();
    const result = analysis.result;
    const sources = result.sources ?? [];
    const filesIds = analysis.input.files_ids ?? [];
    const isComplete = isCompletedContractAnalysisStatus(analysis.status);
    const contentDir = i18n.dir() === "rtl" ? "rtl" : "ltr";

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
                                <CardTitle className="break-words text-2xl font-black md:text-3xl">
                                    {t("contractAnalysis.result.title")}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {t("contractAnalysis.result.subtitle")}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {isComplete && (
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                    <CheckCircle2 data-icon="inline-start" />
                                    {t("contractAnalysis.status.completed")}
                                </Badge>
                            )}
                            {sources.length > 0 && (
                                <Badge variant="secondary">
                                    <Link2 data-icon="inline-start" />
                                    {t("contractAnalysis.sources.count", {
                                        count: sources.length,
                                    })}
                                </Badge>
                            )}
                            {filesIds.length > 0 && (
                                <Badge variant="secondary">
                                    <FileText data-icon="inline-start" />
                                    {t("contractAnalysis.files.count", {
                                        count: filesIds.length,
                                    })}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="analysis" dir={i18n.dir()}>
                        <TabsList>
                            <TabsTrigger value="analysis" className="cursor-pointer">
                                <ClipboardList data-icon="inline-start" />
                                {t("contractAnalysis.tabs.analysis")}
                            </TabsTrigger>
                            <TabsTrigger value="sources" className="cursor-pointer">
                                <BookOpenText data-icon="inline-start" />
                                {t("contractAnalysis.tabs.sources", {
                                    count: sources.length,
                                })}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="analysis">
                            {result.message ? (
                                <section className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
                                    <MarkdownRenderer content={result.message} contentDir={contentDir} />
                                </section>
                            ) : (
                                <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
                                    {t("contractAnalysis.result.emptyMessage")}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sources">
                            <section className="flex flex-col gap-4">
                                <div>
                                    <h3 className="text-base font-black">
                                        {t("contractAnalysis.sources.title")}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t("contractAnalysis.sources.description")}
                                    </p>
                                </div>
                                <ContractAnalysisSourceList sources={sources} />
                            </section>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
}
