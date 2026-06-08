import { BookOpenText, Building2, FilePlus2, FileText, MessageCircle, type LucideIcon } from "lucide-react";

export interface AuthenticatedToolItem {
    href: string;
    icon: LucideIcon;
    titleKey: string;
    descriptionKey: string;
}

export const authenticatedToolItems: AuthenticatedToolItem[] = [
    {
        href: "/chat",
        icon: MessageCircle,
        titleKey: "nav.chat",
        descriptionKey: "nav.chatDescription",
    },
    {
        href: "/legal-terminologies",
        icon: BookOpenText,
        titleKey: "nav.legalTerminologies",
        descriptionKey: "nav.legalTerminologiesDescription",
    },
    {
        href: "/government-processes",
        icon: Building2,
        titleKey: "nav.governmentProcesses",
        descriptionKey: "nav.governmentProcessesDescription",
    },
    {
        href: "/contract-analysis",
        icon: FileText,
        titleKey: "nav.contractAnalysis",
        descriptionKey: "nav.contractAnalysisDescription",
    },
    {
        href: "/document-generation",
        icon: FilePlus2,
        titleKey: "nav.documentGeneration",
        descriptionKey: "nav.documentGenerationDescription",
    },
];
