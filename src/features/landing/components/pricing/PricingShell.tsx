import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function PricingShell({ children }: { children: ReactNode }) {
    const { t } = useTranslation();

    return (
        <section id="pricing" className="bg-muted/50 py-24">
            <div className="mx-auto max-w-[1280px] px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 font-['Cairo'] text-4xl font-black text-foreground md:text-5xl">
                        {t("pricing.header")}
                    </h2>
                    <p className="font-['Cairo'] text-lg text-muted-foreground md:text-xl">
                        {t("pricing.subheader")}
                    </p>
                </div>

                {children}
            </div>
        </section>
    );
}
