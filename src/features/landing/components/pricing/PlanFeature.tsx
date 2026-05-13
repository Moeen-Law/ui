import { Check } from "lucide-react";
import type { ReactNode } from "react";


export function PlanFeature({ children }: { children: ReactNode }) {
    return (
        <li className="flex items-start gap-3 font-['Cairo'] text-[0.95rem] leading-6 text-muted-foreground transition-colors group-hover/card:text-foreground">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 transition-colors group-hover/card:bg-blue-500 group-hover/card:text-white">
                <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span>{children}</span>
        </li>
    );
}