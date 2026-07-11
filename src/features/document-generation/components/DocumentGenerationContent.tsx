import { useMemo, useState } from "react";
import { Calendar, FilePlus2, FileText, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getFeatureQuota, isQuotaExhausted, useDailyQuota } from "@/features/chat/hooks/useDailyQuota";
import DailyQuotaBadge from "@/shared/components/DailyQuotaBadge";
import { TaskHistoryCard, TaskHistoryDrawer, TaskHistoryList, TaskWorkspaceHeader, TaskWorkspaceShell } from "@/shared/components/task-workspace";
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
    getDateLabel,
    getDocumentTemplateName,
} from "../helpers";
import type { GeneratedDocument } from "../types";
import DocumentGenerationEmptyState from "./DocumentGenerationEmptyState";
import DocumentGenerationForm from "./DocumentGenerationForm";
import DocumentGenerationLoadingState from "./DocumentGenerationLoadingState";
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

    const historyLabels = { empty: t("documentGeneration.history.empty"), error: t("documentGeneration.history.error"), retry: t("documentGeneration.error.retry"), loadMore: t("documentGeneration.history.loadMore") };
    const renderHistory = (onItemSelected?: () => void, listClassName?: string) => <TaskHistoryList items={documents} getItemId={(item) => item.id} selectedId={selectedDocument?.id} renderItem={(item) => <div className="flex min-w-0 items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500"><FileText className="size-4" /></div><div className="min-w-0"><div className="truncate text-sm font-black">{getDocumentTemplateName(item, templatesForHistory)}</div><div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3 shrink-0" />{getDateLabel(item.createdAt, i18n.language)}</div></div></div>} onSelect={setSelectedDocument} onItemSelected={onItemSelected} isLoading={isLoadingHistory} isError={isHistoryError} hasNextPage={!!hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={() => fetchNextPage()} onRetry={() => void refetchHistory()} labels={historyLabels} listClassName={listClassName} />;
    const historyTitle = t("documentGeneration.history.title");
    const historyDescription = t("documentGeneration.history.description");

    return (
        <TaskWorkspaceShell
            header={<TaskWorkspaceHeader icon={FilePlus2} badgeIcon={ScrollText} badgeLabel={t("documentGeneration.header.badge")} title={t("documentGeneration.header.title")} description={t("documentGeneration.header.description")} backLabel={t("documentGeneration.header.backToChat")} stats={stats} statsColumns={3} supplementaryBadge={<DailyQuotaBadge quota={docGenQuota} isLoading={isQuotaLoading} isError={isQuotaError} />} />}
            mobileHistory={<TaskHistoryDrawer title={historyTitle} description={historyDescription} count={documents.length} renderContent={(close) => renderHistory(close, "min-h-0 flex-1 overscroll-contain")} />}
            desktopHistory={<TaskHistoryCard title={historyTitle} description={historyDescription}>{renderHistory(undefined, "max-h-[560px]")}</TaskHistoryCard>}
        >
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
        </TaskWorkspaceShell>
    );
}
