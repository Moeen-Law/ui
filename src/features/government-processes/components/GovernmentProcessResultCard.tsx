import {
    Banknote,
    Building2,
    CheckCircle2,
    ClipboardList,
    FileCheck2,
    Landmark,
} from "lucide-react";
import type { ReactNode } from "react";
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
import { Separator } from "@/components/ui/separator";
import type { GovernmentProcessesRes } from "../types";
import GovernmentProcessSources from "./GovernmentProcessSources";

interface GovernmentProcessResultCardProps {
    process: GovernmentProcessesRes;
}

export default function GovernmentProcessResultCard({
    process,
}: GovernmentProcessResultCardProps) {
    const { t } = useTranslation();
    const result = process.result;
    const data = result.structured_data;
    const steps = data?.steps ?? [];
    const requiredDocs = data?.required_docs ?? [];
    const sources = result.sources ?? [];

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
                                <Building2 />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="break-words text-2xl font-black md:text-3xl">
                                    {process.input.query}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {t("governmentProcesses.result.subtitle")}
                                </CardDescription>
                            </div>
                        </div>
                        {!result.fallback && (
                            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                <CheckCircle2 data-icon="inline-start" />
                                {t("governmentProcesses.result.organized")}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="flex min-w-0 flex-col gap-7">
                        <section className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
                            <h3 className="mb-3 flex items-center gap-2 text-base font-black">
                                <ClipboardList className="text-blue-500" />
                                {t("governmentProcesses.result.summary")}
                            </h3>
                            <p className="whitespace-pre-wrap break-words text-base leading-8 text-foreground/90">
                                {result.summary}
                            </p>
                            {result.fallback && result.fallback_reason && (
                                <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-6 text-amber-700 dark:text-amber-300">
                                    {result.fallback_reason}
                                </p>
                            )}
                        </section>

                        <section className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-base font-black">
                                    {t("governmentProcesses.steps.title")}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t("governmentProcesses.steps.description")}
                                </p>
                            </div>
                            {steps.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {steps.map((step, index) => (
                                        <article
                                            key={`${step}-${index}`}
                                            className="flex min-w-0 gap-4 rounded-xl border border-blue-500/15 bg-card p-4"
                                        >
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-black text-blue-500">
                                                {index + 1}
                                            </div>
                                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground/90">
                                                {step}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
                                    {t("governmentProcesses.steps.empty")}
                                </div>
                            )}
                        </section>

                        <Separator />

                        <section className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-base font-black">
                                    {t("governmentProcesses.sources.title")}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t("governmentProcesses.sources.description")}
                                </p>
                            </div>
                            <GovernmentProcessSources sources={sources} />
                        </section>
                    </div>

                    <aside className="flex min-w-0 flex-col gap-4">
                        <InfoPanel
                            icon={<Banknote />}
                            title={t("governmentProcesses.fees.title")}
                            content={data?.estimated_fees || t("governmentProcesses.fees.empty")}
                        />
                        <InfoPanel
                            icon={<FileCheck2 />}
                            title={t("governmentProcesses.docs.title")}
                        >
                            {requiredDocs.length > 0 ? (
                                <ul className="flex flex-col gap-2">
                                    {requiredDocs.map((doc, index) => (
                                        <li key={`${doc}-${index}`} className="flex gap-2 text-sm leading-6">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-500" />
                                            <span className="break-words">{doc}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {t("governmentProcesses.docs.empty")}
                                </p>
                            )}
                        </InfoPanel>
                        <InfoPanel
                            icon={<Landmark />}
                            title={t("governmentProcesses.authority.title")}
                            content={data?.authority || t("governmentProcesses.authority.empty")}
                        />
                    </aside>
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface InfoPanelProps {
    icon: ReactNode;
    title: string;
    content?: string;
    children?: ReactNode;
}

function InfoPanel({ icon, title, content, children }: InfoPanelProps) {
    return (
        <section className="rounded-xl border border-blue-500/15 bg-card p-4 shadow-lg shadow-blue-500/5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-black">
                <span className="text-blue-500">{icon}</span>
                {title}
            </h3>
            {children ?? (
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground/90">
                    {content}
                </p>
            )}
        </section>
    );
}
