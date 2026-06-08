import { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Download,
    ExternalLink,
    FileCheck2,
    FilePlus2,
    FileText,
    History,
    Home,
    Loader2,
    RefreshCw,
    ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import {
    useDocumentTemplate,
    useDocumentTemplates,
    useGenerateDocument,
    useGeneratedDocuments,
} from "../hooks";
import {
    formatFileSize,
    getDocumentTemplateName,
    hasInvalidDateFieldValue,
    isFieldValueEmpty,
    normalizeFieldValue,
} from "../helpers";
import type {
    DocumentTemplate,
    DocumentTemplateField,
    GeneratedDocument,
} from "../types";

type FieldValues = Record<string, string>;

const getDateLabel = (date: string, locale: string) =>
    new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));

interface HistoryListProps {
    documents: GeneratedDocument[];
    templates: DocumentTemplate[];
    selectedId?: string;
    isLoading: boolean;
    isError: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
    onRetry: () => void;
    onSelect: (document: GeneratedDocument) => void;
    onItemSelected?: () => void;
}

function DocumentHistoryList({
    documents,
    templates,
    selectedId,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onRetry,
    onSelect,
    onItemSelected,
}: HistoryListProps) {
    const { t, i18n } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-blue-500/15 bg-blue-500/5 p-5 text-center">
                <Loader2 className="size-8 animate-spin text-blue-500" />
                <p className="text-sm font-bold">{t("documentGeneration.history.loading")}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center">
                <p className="text-sm font-bold text-destructive">
                    {t("documentGeneration.history.error")}
                </p>
                <Button type="button" variant="outline" onClick={onRetry}>
                    <RefreshCw />
                    {t("documentGeneration.error.retry")}
                </Button>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-5 text-center">
                <History className="size-8 text-blue-500" />
                <p className="text-sm font-bold">{t("documentGeneration.history.empty")}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pe-1">
            {documents.map((document) => {
                const isSelected = selectedId === document.id;
                const templateName = getDocumentTemplateName(document, templates);

                return (
                    <button
                        key={document.id}
                        type="button"
                        onClick={() => {
                            onSelect(document);
                            onItemSelected?.();
                        }}
                        className={`min-w-0 cursor-pointer rounded-xl border p-3 text-start transition hover:border-blue-500/40 hover:bg-blue-500/10 ${
                            isSelected
                                ? "border-blue-500/40 bg-blue-500/10"
                                : "border-blue-500/15 bg-card"
                        }`}
                    >
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-black">
                                    {templateName}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="size-3 shrink-0" />
                                    {getDateLabel(document.createdAt, i18n.language)}
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}

            {hasNextPage && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onLoadMore}
                    disabled={isFetchingNextPage}
                    className="cursor-pointer border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500"
                >
                    {isFetchingNextPage ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    {t("documentGeneration.history.loadMore")}
                </Button>
            )}
        </div>
    );
}

interface HistoryPanelProps extends HistoryListProps {
    isMobile?: boolean;
}

function DocumentHistoryPanel(props: HistoryPanelProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    if (props.isMobile) {
        return (
            <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer justify-between border-blue-500/20 bg-card/90 text-start shadow-lg shadow-blue-500/5 hover:border-blue-500/40 hover:bg-blue-500/10"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <History className="shrink-0 text-blue-500" />
                            <span className="truncate font-bold">
                                {t("documentGeneration.history.title")}
                            </span>
                        </span>
                        <Badge variant="secondary" className="shrink-0 bg-blue-500/10 text-blue-500">
                            {props.documents.length}
                        </Badge>
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85dvh] max-h-[85dvh] overflow-hidden rounded-t-2xl">
                    <div className="flex h-full min-h-0 flex-col">
                        <DrawerHeader className="shrink-0 border-b border-blue-500/10 text-start">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <DrawerTitle className="flex items-center gap-2 text-lg font-black">
                                        <History className="shrink-0 text-blue-500" />
                                        {t("documentGeneration.history.title")}
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        {t("documentGeneration.history.description")}
                                    </DrawerDescription>
                                </div>
                                <DrawerClose asChild>
                                    <Button type="button" variant="ghost" size="icon">
                                        <FileCheck2 />
                                    </Button>
                                </DrawerClose>
                            </div>
                        </DrawerHeader>
                        <div className="min-h-0 flex-1 overflow-hidden p-4">
                            <DocumentHistoryList
                                {...props}
                                onItemSelected={() => setOpen(false)}
                            />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5 lg:sticky lg:top-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <History className="text-blue-500" />
                    {t("documentGeneration.history.title")}
                </CardTitle>
                <CardDescription>
                    {t("documentGeneration.history.description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[560px] overflow-hidden">
                <DocumentHistoryList {...props} />
            </CardContent>
        </Card>
    );
}

interface ResultCardProps {
    document: GeneratedDocument;
    templates: DocumentTemplate[];
    onRefresh: () => void;
}

function GeneratedDocumentCard({ document, templates, onRefresh }: ResultCardProps) {
    const { t, i18n } = useTranslation();
    const file = document.generatedFile;
    const downloadUrl = file?.downloadUrl;
    const templateName = getDocumentTemplateName(document, templates);
    const fileMeta = [file?.contentType, formatFileSize(file?.size)].filter(Boolean).join(" - ");
    const fileDetails = (
        <>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-bold text-muted-foreground">
                        {t("documentGeneration.result.file")}
                    </div>
                    <div className="mt-1 break-words font-black">
                        {file?.originalName ?? t("documentGeneration.result.fileUnavailable")}
                    </div>
                </div>
                {downloadUrl ? (
                    <ExternalLink className="mt-1 size-4 shrink-0 text-blue-500" />
                ) : null}
            </div>
            {fileMeta ? (
                <div className="mt-1 text-xs text-muted-foreground">
                    {fileMeta}
                </div>
            ) : null}
        </>
    );

    return (
        <Card className="overflow-hidden border-blue-500/15 shadow-xl shadow-blue-500/5">
            <CardContent className="grid gap-5 p-0">
                <div className="grid gap-5 border-b border-blue-500/10 bg-blue-500/5 p-5 sm:grid-cols-[1fr_auto] sm:items-center md:p-6">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                            <FileCheck2 />
                        </div>
                        <div className="min-w-0">
                            <h2 className="break-words text-xl font-black">
                                {t("documentGeneration.result.title")}
                            </h2>
                            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                                {templateName}
                            </p>
                        </div>
                    </div>

                    {downloadUrl ? (
                        <Button asChild className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 sm:w-auto">
                            <a href={downloadUrl} download>
                                <Download />
                                {t("documentGeneration.result.download")}
                            </a>
                        </Button>
                    ) : null}
                </div>

                <div className="grid gap-4 p-5 pt-0 md:p-6 md:pt-0">
                    {downloadUrl ? (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl border border-blue-500/15 bg-card p-4 transition hover:border-blue-500/35 hover:bg-blue-500/5"
                        >
                            {fileDetails}
                        </a>
                    ) : (
                        <div className="rounded-xl border border-blue-500/15 bg-card p-4">
                            {fileDetails}
                        </div>
                    )}

                    <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">
                        <div className="text-xs font-bold text-muted-foreground">
                            {t("documentGeneration.result.createdAt")}
                        </div>
                        <div className="mt-1 font-black">
                            {getDateLabel(document.createdAt, i18n.language)}
                        </div>
                    </div>

                    {!downloadUrl ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                            <p className="text-sm text-destructive">
                                {t("documentGeneration.result.downloadUnavailable")}
                            </p>
                            <Button type="button" variant="outline" onClick={onRefresh}>
                                <RefreshCw />
                                {t("documentGeneration.result.refresh")}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

interface FieldInputProps {
    field: DocumentTemplateField;
    value: string;
    showRequiredError: boolean;
    showDateError: boolean;
    onChange: (value: string) => void;
}

function FieldInput({ field, value, showRequiredError, showDateError, onChange }: FieldInputProps) {
    const { t } = useTranslation();
    const inputId = `document-field-${field.id}`;
    const placeholder = field.example ?? field.description ?? field.name;

    return (
        <div className="grid gap-2">
            <Label htmlFor={inputId} className="font-black">
                {field.name}
                {field.required ? <span className="text-destructive"> *</span> : null}
            </Label>
            {field.type === "array" ? (
                <Textarea
                    id={inputId}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={t("documentGeneration.form.arrayPlaceholder", {
                        placeholder,
                    })}
                    className="min-h-28 resize-y"
                />
            ) : (
                <Input
                    id={inputId}
                    type={field.type === "date" ? "date" : "text"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                />
            )}
            {field.description ? (
                <p className="text-xs leading-5 text-muted-foreground">
                    {field.description}
                </p>
            ) : null}
            {showRequiredError ? (
                <p className="text-xs font-bold text-destructive">
                    {t("documentGeneration.form.required")}
                </p>
            ) : null}
            {showDateError ? (
                <p className="text-xs font-bold text-destructive">
                    {t("documentGeneration.form.invalidDate")}
                </p>
            ) : null}
        </div>
    );
}

export default function DocumentGenerationContent() {
    const { t, i18n } = useTranslation();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
    const [fieldValues, setFieldValues] = useState<FieldValues>({});
    const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
    const [requestError, setRequestError] = useState<string | undefined>();
    const [hasSubmitted, setHasSubmitted] = useState(false);

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
    const canSubmit = Boolean(selectedTemplate) && !isPending;
    const BackIcon = i18n.dir() === "rtl" ? ArrowRight : ArrowLeft;

    const handleSelectTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
        setFieldValues({});
        setRequestError(undefined);
        setHasSubmitted(false);
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
        <div className="min-h-dvh w-full overflow-x-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_48%),radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.08),transparent_32%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-4 md:gap-6 md:px-8 md:py-8">
                <header className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-card/85 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur md:gap-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                            <Link to="/chat">
                                <BackIcon data-icon="inline-start" />
                                {t("documentGeneration.header.backToChat")}
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-blue-500/10 hover:text-blue-500" asChild>
                                <Link to="/" aria-label={t("chat.ui.home")}>
                                    <Home data-icon="inline-start" />
                                </Link>
                            </Button>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
                        <div className="flex min-w-0 flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 shadow-inner shadow-amber-400/10 md:size-12">
                                    <FilePlus2 />
                                </div>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                                    <ScrollText data-icon="inline-start" />
                                    {t("documentGeneration.header.badge")}
                                </Badge>
                            </div>
                            <div className="flex max-w-3xl flex-col gap-3">
                                <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
                                    {t("documentGeneration.header.title")}
                                </h1>
                                <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base md:text-lg md:leading-8">
                                    {t("documentGeneration.header.description")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4 shadow-lg shadow-blue-500/5"
                                >
                                    <div className="text-2xl font-black text-blue-500">{stat.value}</div>
                                    <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

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

                        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-black">
                                    <FileText className="text-blue-500" />
                                    {t("documentGeneration.templates.title")}
                                </CardTitle>
                                <CardDescription>
                                    {t("documentGeneration.templates.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingTemplates ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                        {t("documentGeneration.templates.loading")}
                                    </div>
                                ) : isTemplatesError ? (
                                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                                        <p className="text-sm text-destructive">
                                            {t("documentGeneration.templates.error")}
                                        </p>
                                        <Button type="button" variant="outline" onClick={() => void refetchTemplates()}>
                                            <RefreshCw />
                                            {t("documentGeneration.error.retry")}
                                        </Button>
                                    </div>
                                ) : templates.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center text-sm font-bold">
                                        {t("documentGeneration.templates.empty")}
                                    </div>
                                ) : (
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {templates.map((templateItem) => (
                                            <button
                                                key={templateItem.id}
                                                type="button"
                                                onClick={() => handleSelectTemplate(templateItem.id)}
                                                className={`min-w-0 cursor-pointer rounded-xl border p-4 text-start transition hover:border-blue-500/40 hover:bg-blue-500/10 ${
                                                    selectedTemplateId === templateItem.id
                                                        ? "border-blue-500/40 bg-blue-500/10"
                                                        : "border-blue-500/15 bg-card"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                                                        <ScrollText className="size-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-black">
                                                            {templateItem.name}
                                                        </div>
                                                        {templateItem.description ? (
                                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                                                {templateItem.description}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl font-black">
                                    <FilePlus2 className="text-blue-500" />
                                    {t("documentGeneration.form.title")}
                                </CardTitle>
                                <CardDescription>
                                    {selectedTemplate
                                        ? selectedTemplate.name
                                        : t("documentGeneration.form.description")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {!selectedTemplateId ? (
                                    <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center">
                                        <ScrollText className="size-9 text-blue-500" />
                                        <p className="text-sm font-bold">
                                            {t("documentGeneration.form.selectTemplate")}
                                        </p>
                                    </div>
                                ) : isLoadingTemplate ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                        {t("documentGeneration.form.loading")}
                                    </div>
                                ) : isTemplateError ? (
                                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                                        <p className="text-sm text-destructive">
                                            {t("documentGeneration.form.error")}
                                        </p>
                                        <Button type="button" variant="outline" onClick={() => void refetchTemplate()}>
                                            <RefreshCw />
                                            {t("documentGeneration.error.retry")}
                                        </Button>
                                    </div>
                                ) : selectedTemplate ? (
                                    <>
                                        <div className="grid gap-4">
                                            {selectedTemplate.fields.map((field) => (
                                                <FieldInput
                                                    key={field.id}
                                                    field={field}
                                                    value={fieldValues[field.id] ?? ""}
                                                    showRequiredError={
                                                        hasSubmitted &&
                                                        field.required &&
                                                        isFieldValueEmpty(field, fieldValues[field.id] ?? "")
                                                    }
                                                    showDateError={
                                                        hasSubmitted &&
                                                        hasInvalidDateFieldValue(field, fieldValues[field.id] ?? "")
                                                    }
                                                    onChange={(value) =>
                                                        setFieldValues((current) => ({
                                                            ...current,
                                                            [field.id]: value,
                                                        }))
                                                    }
                                                />
                                            ))}
                                        </div>

                                        {requestError ? (
                                            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                                                {requestError}
                                            </p>
                                        ) : null}

                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={!canSubmit}
                                            className="w-fit cursor-pointer bg-blue-500 hover:bg-blue-600"
                                        >
                                            {isPending ? <Loader2 className="animate-spin" /> : <FilePlus2 />}
                                            {t("documentGeneration.form.submit")}
                                        </Button>
                                    </>
                                ) : null}
                            </CardContent>
                        </Card>

                        {isPending ? (
                            <Card className="border-blue-500/15 shadow-xl shadow-blue-500/5">
                                <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center">
                                    <Loader2 className="size-10 animate-spin text-blue-500" />
                                    <p className="font-black">
                                        {t("documentGeneration.status.generating")}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : selectedDocument ? (
                            <GeneratedDocumentCard
                                document={selectedDocument}
                                templates={templatesForHistory}
                                onRefresh={() => void refetchHistory()}
                            />
                        ) : (
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
                        )}
                    </section>

                    <aside className="hidden min-w-0 lg:block">
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
