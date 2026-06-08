import type {
    DocumentTemplate,
    DocumentTemplateField,
    GeneratedDocument,
} from "../types";

export const getDocumentTemplateName = (
    document: GeneratedDocument,
    templates: DocumentTemplate[]
) => {
    const templateId = document.input.templateId ?? document.input.template_id ?? "";

    return templates.find((template) => template.id === templateId)?.name ?? templateId;
};

export const formatFileSize = (size?: number) => {
    if (!size || size <= 0) return "";

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const getDateLabel = (date: string, locale: string) =>
    new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));

export const normalizeFieldValue = (
    field: DocumentTemplateField,
    value: string
): string | string[] => {
    if (field.type !== "array") return value.trim();

    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
};

export const isFieldValueEmpty = (
    field: DocumentTemplateField,
    value: string
) => {
    if (field.type !== "array") return value.trim().length === 0;
    return normalizeFieldValue(field, value).length === 0;
};

export const isValidDateFieldValue = (value: string) => {
    const trimmedValue = value.trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);

    if (!match) return false;

    const [, yearValue, monthValue, dayValue] = match;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

export const hasInvalidDateFieldValue = (
    field: DocumentTemplateField,
    value: string
) => field.type === "date" && !isFieldValueEmpty(field, value) && !isValidDateFieldValue(value);
