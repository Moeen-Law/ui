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
        <section id="faq" className="scroll-mt-24 bg-background px-6 py-24 md:px-8">
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-14">
                <div className="flex flex-col gap-7 text-center lg:sticky lg:top-28 lg:text-start">
                    <div>
                        <span className="inline-flex w-fit items-center rounded-full border border-border bg-card px-3 py-1 font-['Cairo'] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {getFAQText(faq.label, fallbackFAQ.label)}
                        </span>
                        <h2 className="mt-5 font-['Cairo'] text-4xl font-black leading-tight text-foreground md:text-5xl">
                            {getFAQText(faq.title, fallbackFAQ.title)}
                        </h2>
                        <p className="mt-4 font-['Cairo'] text-lg leading-8 text-muted-foreground md:text-xl">
                            {getFAQText(faq.subtitle, fallbackFAQ.subtitle)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 text-start shadow-sm md:p-6">
                        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                            <ShieldCheck aria-hidden="true" />
                        </div>
                        <h3 className="font-['Cairo'] text-xl font-black text-foreground">
                            {getFAQText(faq.supportTitle, fallbackFAQ.supportTitle)}
                        </h3>
                        <p className="mt-3 font-['Cairo'] text-sm leading-7 text-muted-foreground">
                            {getFAQText(faq.supportText, fallbackFAQ.supportText)}
                        </p>
                        <Button
                            type="button"
                            onClick={handleStart}
                            className="mt-5 h-9 w-full cursor-pointer font-['Cairo'] font-bold sm:w-auto"
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
                            className="rounded-2xl  border border-border bg-card px-4 shadow-sm transition-colors data-[state=open]:border-foreground/20 data-[state=open]:bg-muted/30 md:px-5"
                        >
                            <AccordionTrigger className="gap-4 cursor-pointer py-5 font-['Cairo'] text-base font-bold leading-7 text-foreground hover:no-underline md:py-6 md:text-lg">
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
