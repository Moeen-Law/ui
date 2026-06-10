import { useTranslation } from "react-i18next";
import { FilePlus2, Loader2, RefreshCw, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DailyQuotaBadge from "@/features/chat/components/DailyQuotaBadge";
import QuotaNotice from "@/features/chat/components/QuotaNotice";
import type { Quota } from "@/features/chat/types";
import { isQuotaExhausted, isQuotaLow } from "@/features/chat/hooks/useDailyQuota";
import {
    hasInvalidDateFieldValue,
    isFieldValueEmpty,
} from "../helpers";
import type { DocumentTemplate } from "../types";
import DocumentFieldInput from "./DocumentFieldInput";

type FieldValues = Record<string, string>;

interface DocumentGenerationFormProps {
    selectedTemplateId?: string;
    selectedTemplate?: DocumentTemplate;
    fieldValues: FieldValues;
    requestError?: string;
    hasSubmitted: boolean;
    isLoadingTemplate: boolean;
    isTemplateError: boolean;
    canSubmit: boolean;
    isPending: boolean;
    quota?: Quota;
    isQuotaLoading?: boolean;
    isQuotaError?: boolean;
    onRetryTemplate: () => void;
    onFieldChange: (fieldId: string, value: string) => void;
    onSubmit: () => void;
}

export default function DocumentGenerationForm({
    selectedTemplateId,
    selectedTemplate,
    fieldValues,
    requestError,
    hasSubmitted,
    isLoadingTemplate,
    isTemplateError,
    canSubmit,
    isPending,
    quota,
    isQuotaLoading,
    isQuotaError,
    onRetryTemplate,
    onFieldChange,
    onSubmit,
}: DocumentGenerationFormProps) {
    const { t } = useTranslation();
    const quotaExhausted = isQuotaExhausted(quota);
    const showQuotaNotice = isQuotaLow(quota) || quotaExhausted;

    return (
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
                        <Button type="button" variant="outline" onClick={onRetryTemplate}>
                            <RefreshCw />
                            {t("documentGeneration.error.retry")}
                        </Button>
                    </div>
                ) : selectedTemplate ? (
                    <>
                        <div className="grid gap-4">
                            {selectedTemplate.fields.map((field) => (
                                <DocumentFieldInput
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
                                    onChange={(value) => onFieldChange(field.id, value)}
                                />
                            ))}
                        </div>

                        {requestError ? (
                            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                                {requestError}
                            </p>
                        ) : null}

                        <DailyQuotaBadge
                            quota={quota}
                            isLoading={isQuotaLoading}
                            isError={isQuotaError}
                            className="w-fit"
                        />

                        {showQuotaNotice ? (
                            <QuotaNotice quota={quota} kind="doc_gen" />
                        ) : null}

                        <Button
                            type="button"
                            onClick={onSubmit}
                            disabled={!canSubmit || quotaExhausted}
                            className="w-fit cursor-pointer bg-blue-500 hover:bg-blue-600"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : <FilePlus2 />}
                            {t("documentGeneration.form.submit")}
                        </Button>
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
}
