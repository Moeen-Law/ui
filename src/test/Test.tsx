import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
    {
        value: "billing",
        trigger: "كيف يمكنني إعادة تعيين كلمة المرور؟",
        content:
            "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.",
    },
    {
        value: "security",
        trigger: "Is my data secure?",
        content:
            "Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data is encrypted at rest and in transit using industry-standard protocols.",
    },
    {
        value: "integration",
        trigger: "What integrations do you support?",
        content:
            "We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also build custom integrations using our REST API and webhooks.",
    },
]

export default function Test() {
    return (
        <Accordion
            type="single"
            collapsible
            className="max-w-lg rounded-lg border"
            defaultValue="billing"
        >
            {items.map((item) => (
                <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="border-b px-4 last:border-b-0"
                >
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
