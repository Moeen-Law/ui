import type { FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { LoaderCircle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";

interface TaskPromptPanelProps {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    label: string;
    placeholder: string;
    hint: string;
    disclaimer: string;
    submitLabel: string;
    pendingLabel: string;
    value: string;
    isPending: boolean;
    minLength?: number;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function TaskPromptPanel({ id, icon: Icon, title, description, label, placeholder, hint, disclaimer, submitLabel, pendingLabel, value, isPending, minLength = 2, onChange, onSubmit }: TaskPromptPanelProps) {
    const canSubmit = value.trim().length >= minLength && !isPending;
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (canSubmit) onSubmit(); };
    return <Card className="border-blue-500/20 bg-card/95 shadow-2xl shadow-blue-500/10"><CardHeader><CardTitle className="flex items-center gap-2 text-xl font-black"><Icon className="text-amber-400" />{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit}><FieldGroup><Field><FieldLabel htmlFor={id}>{label}</FieldLabel><InputGroup className="min-h-24 items-stretch rounded-2xl border-blue-500/20 bg-background transition-all focus-within:border-blue-500/60 focus-within:ring-3 focus-within:ring-blue-500/15"><InputGroupTextarea id={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={isPending} rows={3} placeholder={placeholder} className="min-h-24 text-base leading-7 placeholder:text-muted-foreground/70" /><InputGroupAddon align="block-end" className="justify-between border-t border-blue-500/10"><span className="text-xs text-muted-foreground">{hint}</span><InputGroupButton type="submit" variant="default" size="sm" disabled={!canSubmit} className="cursor-pointer bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400 disabled:opacity-30">{isPending ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : <Search data-icon="inline-start" />}{isPending ? pendingLabel : submitLabel}</InputGroupButton></InputGroupAddon></InputGroup><FieldDescription>{disclaimer}</FieldDescription></Field></FieldGroup></form></CardContent></Card>;
}
