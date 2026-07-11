import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getFeatureQuota, isQuotaExhausted, useDailyQuota } from "@/features/chat/hooks/useDailyQuota";
import {
    useDocumentTemplate,
    useDocumentTemplates,
    useGenerateDocument,
    useGeneratedDocuments,
} from "../hooks";
import {
    hasInvalidDateFieldValue,
    isFieldValueEmpty,
    normalizeFieldValue,
} from "../helpers";
import type { GeneratedDocument } from "../types";
import DocumentGenerationEmptyState from "./DocumentGenerationEmptyState";
import DocumentGenerationForm from "./DocumentGenerationForm";
import DocumentGenerationHeader from "./DocumentGenerationHeader";
import DocumentGenerationLoadingState from "./DocumentGenerationLoadingState";
import DocumentHistoryPanel from "./DocumentHistoryPanel";
import DocumentTemplateGrid from "./DocumentTemplateGrid";
import GeneratedDocumentCard from "./GeneratedDocumentCard";

type FieldValues = Record<string, string>;

export default function DocumentGenerationContent() {
    const { t, i18n } = useTranslation();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
    const [fieldValues, setFieldValues] = useState<FieldValues>({});
    const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
    const [requestError, setRequestError] = useState<string | undefined>();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const {
        quota: dailyQuota,
        isLoading: isQuotaLoading,
        isError: isQuotaError,
    } = useDailyQuota();
    const docGenQuota = getFeatureQuota(dailyQuota, "doc_gen");
    const docGenQuotaExhausted = isQuotaExhausted(docGenQuota);

    const {
        templates,
        isLoading: isLoadingTemplates,
        isError: isTemplatesError,
        refetch: refetchTemplates,
    } = useDocumentTemplates();
    const {
        template,
        isLoading: isLoadingTemplate,
        isError: isTemplateError,
        refetch: refetchTemplate,
    } = useDocumentTemplate(selectedTemplateId);
    const {
        documents,
        fetchNextPage,
        hasNextPage,
        isLoading: isLoadingHistory,
        isFetchingNextPage,
        isError: isHistoryError,
        refetch: refetchHistory,
    } = useGeneratedDocuments();
    const { generateDocumentAsync, isPending } = useGenerateDocument();

    const selectedTemplate = template;
    const templatesForHistory = useMemo(
        () =>
            templates.map((item) => ({
                ...item,
                fields: item.id === template?.id ? template.fields : [],
                markdown_content: item.id === template?.id ? template.markdown_content : undefined,
            })),
        [template, templates]
    );

    const stats = useMemo(
        () => [
            {
                label: t("documentGeneration.stats.templates"),
                value: templates.length,
            },
            {
                label: t("documentGeneration.stats.documents"),
                value: documents.length,
            },
            {
                label: t("documentGeneration.stats.fields"),
                value: selectedTemplate?.fields.length ?? 0,
            },
        ],
        [documents.length, selectedTemplate?.fields.length, t, templates.length]
    );

    const missingRequiredField = selectedTemplate?.fields.some(
        (field) => field.required && isFieldValueEmpty(field, fieldValues[field.id] ?? "")
    );
    const hasInvalidDateField = selectedTemplate?.fields.some(
        (field) => hasInvalidDateFieldValue(field, fieldValues[field.id] ?? "")
    );
    const canSubmit = Boolean(selectedTemplate) && !isPending && !docGenQuotaExhausted;
    const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
        setFieldValues({});
        setRequestError(undefined);
        setHasSubmitted(false);
    };

    const handleFieldChange = (fieldId: string, value: string) => {
        setFieldValues((current) => ({
            ...current,
            [fieldId]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!selectedTemplate || !canSubmit) return;

        setRequestError(undefined);
        setHasSubmitted(true);

        if (missingRequiredField || hasInvalidDateField) return;

        const data = selectedTemplate.fields.reduce<Record<string, string | string[]>>(
            (payload, field) => {
                const value = fieldValues[field.id] ?? "";
                if (!field.required && isFieldValueEmpty(field, value)) return payload;

                return {
                    ...payload,
                    [field.name]: normalizeFieldValue(field, value),
                };
            },
            {}
        );

        try {
            const document = await generateDocumentAsync({
                templateId: selectedTemplate.id,
                data,
            });
            setSelectedDocument(document);
            setFieldValues({});
            setHasSubmitted(false);
            void refetchHistory();
            toast.success(t("documentGeneration.toast.generated"));
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : t("documentGeneration.error.description");
            setRequestError(message);
            toast.error(message);
        }
    };

    return (
        <div className="min-h-dvh w-full overflow-x-clip bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:gap-6 md:px-8 md:py-8">
                <DocumentGenerationHeader
                    stats={stats}
                    BackIcon={BackIcon}
                    quota={docGenQuota}
                    isQuotaLoading={isQuotaLoading}
                    isQuotaError={isQuotaError}
                />

                <main className="grid min-w-0 grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="flex min-w-0 flex-col gap-5">
                        <div className="lg:hidden">
                            <DocumentHistoryPanel
                                isMobile
                                documents={documents}
                                templates={templatesForHistory}
                                selectedId={selectedDocument?.id}
                                isLoading={isLoadingHistory}
                                isError={isHistoryError}
                                hasNextPage={!!hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                onLoadMore={() => fetchNextPage()}
                                onRetry={() => void refetchHistory()}
                                onSelect={setSelectedDocument}
                            />
                        </div>

                        <DocumentTemplateGrid
                            templates={templates}
                            selectedTemplateId={selectedTemplateId}
                            isLoading={isLoadingTemplates}
                            isError={isTemplatesError}
                            onRetry={() => void refetchTemplates()}
                            onSelectTemplate={handleSelectTemplate}
                        />

                        <DocumentGenerationForm
                            selectedTemplateId={selectedTemplateId}
                            selectedTemplate={selectedTemplate}
                            fieldValues={fieldValues}
                            requestError={requestError}
                            hasSubmitted={hasSubmitted}
                            isLoadingTemplate={isLoadingTemplate}
                            isTemplateError={isTemplateError}
                            canSubmit={canSubmit}
                            isPending={isPending}
                            quota={docGenQuota}
                            isQuotaLoading={isQuotaLoading}
                            isQuotaError={isQuotaError}
                            onRetryTemplate={() => void refetchTemplate()}
                            onFieldChange={handleFieldChange}
                            onSubmit={handleSubmit}
                        />

                        {isPending ? (
                            <DocumentGenerationLoadingState />
                        ) : selectedDocument ? (
                            <GeneratedDocumentCard
                                document={selectedDocument}
                                templates={templatesForHistory}
                                onRefresh={() => void refetchHistory()}
                            />
                        ) : (
                            <DocumentGenerationEmptyState />
                        )}
                    </section>

                    <aside className="hidden min-w-0 lg:sticky lg:top-8 lg:block lg:self-start">
                        <DocumentHistoryPanel
                            documents={documents}
                            templates={templatesForHistory}
                            selectedId={selectedDocument?.id}
                            isLoading={isLoadingHistory}
                            isError={isHistoryError}
                            hasNextPage={!!hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={() => fetchNextPage()}
                            onRetry={() => void refetchHistory()}
                            onSelect={setSelectedDocument}
                        />
                    </aside>
                </main>
            </div>
        </div>
    );
}
