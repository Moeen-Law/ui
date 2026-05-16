import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface InfoPanelProps {
    icon: ReactNode;
    title: string;
    content?: string;
    children?: ReactNode;
    className?: string;
}

export function InfoPanel({ icon, title, content, children, className }: InfoPanelProps) {
    return (
        <section className={cn("rounded-xl border border-blue-500/15 bg-card p-4 shadow-lg shadow-blue-500/5", className)}>
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
