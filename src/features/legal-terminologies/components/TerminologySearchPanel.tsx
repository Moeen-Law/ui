import type { FormEvent } from "react";
import { LoaderCircle, Search, Sparkles } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { useTranslation } from "react-i18next";

interface TerminologySearchPanelProps {
    value: string;
    isPending: boolean;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export default function TerminologySearchPanel({
    value,
    isPending,
    onChange,
    onSubmit,
}: TerminologySearchPanelProps) {
    const { t } = useTranslation();
    const canSubmit = value.trim().length > 1 && !isPending;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (canSubmit) {
            onSubmit();
        }
    };

    return (
        <Card className="border-blue-500/20 bg-card/95 shadow-2xl shadow-blue-500/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <Sparkles className="text-amber-400" />
                    {t("legalTerminologies.search.title")}
                </CardTitle>
                <CardDescription>
                    {t("legalTerminologies.search.description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="legal-terminology-input">
                                {t("legalTerminologies.search.label")}
                            </FieldLabel>
                            <InputGroup className="min-h-24 items-stretch rounded-2xl border-blue-500/20 bg-background transition-all focus-within:border-blue-500/60 focus-within:ring-3 focus-within:ring-blue-500/15">
                                <InputGroupTextarea
                                    id="legal-terminology-input"
                                    value={value}
                                    onChange={(event) => onChange(event.target.value)}
                                    disabled={isPending}
                                    rows={3}
                                    placeholder={t("legalTerminologies.search.placeholder")}
                                    className="min-h-24 text-base leading-7 placeholder:text-muted-foreground/70"
                                />
                                <InputGroupAddon align="block-end" className="justify-between border-t border-blue-500/10">
                                    <span className="text-xs text-muted-foreground">
                                        {t("legalTerminologies.search.hint")}
                                    </span>
                                    <InputGroupButton
                                        type="submit"
                                        variant="default"
                                        size="sm"
                                        disabled={!canSubmit}
                                        className="cursor-pointer bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400 disabled:opacity-30"
                                    >
                                        {isPending ? (
                                            <LoaderCircle data-icon="inline-start" className="animate-spin" />
                                        ) : (
                                            <Search data-icon="inline-start" />
                                        )}
                                        {isPending
                                            ? t("legalTerminologies.search.loading")
                                            : t("legalTerminologies.search.submit")}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                {t("legalTerminologies.search.disclaimer")}
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
