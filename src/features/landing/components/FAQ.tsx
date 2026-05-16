import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useHandleStart } from "@/shared/hooks/useHandleStart";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCopy {
    label?: string;
    title?: string;
    subtitle?: string;
    supportTitle?: string;
    supportText?: string;
    supportButton?: string;
    items?: FAQItem[];
}

const fallbackFAQ: Required<FAQCopy> = {
    label: "FAQ",
    title: "Frequently Asked Questions",
    subtitle: "Clear answers to the questions people usually ask before using Moeen.",
    supportTitle: "Still have questions?",
    supportText: "Start a chat and ask Moeen about your situation in plain language.",
    supportButton: "Start a chat",
    items: [],
};

function getFAQText(value: string | undefined, fallback: string) {
    const unresolvedKeyPattern = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;

    if (!value || unresolvedKeyPattern.test(value.trim())) {
        return fallback;
    }

    return value;
}

export function FAQ() {
    const { t } = useTranslation();
    const { handleStart } = useHandleStart();
    const faq = t("faq", { returnObjects: true }) as FAQCopy;
    const items = Array.isArray(faq.items) ? faq.items : fallbackFAQ.items;

    return (
        <section
            id="faq"
            className="relative scroll-mt-24 overflow-hidden bg-muted/50 px-6 py-24 md:px-8"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_84%_78%,rgba(251,191,36,0.1),transparent_30%)]" />
            <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
                <div className="flex flex-col gap-7 text-center lg:sticky lg:top-28 lg:text-start">
                    <div>
                        <span className="inline-flex w-fit items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 font-['Cairo'] text-sm font-extrabold text-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.08)]">
                            {getFAQText(faq.label, fallbackFAQ.label)}
                        </span>
                        <h2 className="mt-5 bg-linear-to-br from-foreground via-foreground to-blue-500 bg-clip-text font-['Cairo'] text-4xl font-black leading-tight text-transparent md:text-5xl">
                            {getFAQText(faq.title, fallbackFAQ.title)}
                        </h2>
                        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-amber-400 lg:mx-0" />
                        <p className="mt-6 font-['Cairo'] text-lg leading-8 text-muted-foreground md:text-xl">
                            {getFAQText(faq.subtitle, fallbackFAQ.subtitle)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-start shadow-[0_20px_40px_rgba(59,130,246,0.08)] backdrop-blur md:p-6">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]">
                            <ShieldCheck aria-hidden="true" />
                        </div>
                        <h3 className="font-['Cairo'] text-xl font-black text-foreground">
                            {getFAQText(faq.supportTitle, fallbackFAQ.supportTitle)}
                        </h3>
                        <p className="mt-3 font-['Cairo'] text-sm leading-7 text-muted-foreground md:text-base">
                            {getFAQText(faq.supportText, fallbackFAQ.supportText)}
                        </p>
                        <Button
                            type="button"
                            onClick={handleStart}
                            className="mt-5 h-11 w-full cursor-pointer rounded-xl bg-blue-500 px-6 font-['Cairo'] font-bold text-white shadow-[0_10px_30px_rgba(59,130,246,0.32)] transition-all hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_14px_34px_rgba(59,130,246,0.38)] sm:w-auto"
                        >
                            <MessageCircle data-icon="inline-start" aria-hidden="true" />
                            {getFAQText(faq.supportButton, fallbackFAQ.supportButton)}
                        </Button>
                    </div>
                </div>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full gap-3"
                >
                    {items.map((item, index) => (
                        <AccordionItem
                            key={item.question}
                            value={`faq-${index}`}
                            className="rounded-2xl border border-border bg-card px-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-muted/40 hover:shadow-[0_18px_36px_rgba(59,130,246,0.14)] data-[state=open]:border-blue-500/40 data-[state=open]:bg-blue-500/5 data-[state=open]:shadow-[0_18px_36px_rgba(59,130,246,0.12)] md:px-5"
                        >
                            <AccordionTrigger className="cursor-pointer gap-4 py-5 font-['Cairo'] text-base font-extrabold leading-7 text-foreground hover:no-underline md:py-6 md:text-lg [&_[data-slot=accordion-trigger-icon]]:mt-1 [&_[data-slot=accordion-trigger-icon]]:size-5 [&_[data-slot=accordion-trigger-icon]]:text-blue-500">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 pe-8 font-['Cairo'] text-sm leading-7 text-muted-foreground md:pb-6 md:text-base md:leading-8">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
