import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentTemplateField } from "../types";

interface DocumentFieldInputProps {
    field: DocumentTemplateField;
    value: string;
    showRequiredError: boolean;
    showDateError: boolean;
    onChange: (value: string) => void;
}

export default function DocumentFieldInput({
    field,
    value,
    showRequiredError,
    showDateError,
    onChange,
}: DocumentFieldInputProps) {
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
