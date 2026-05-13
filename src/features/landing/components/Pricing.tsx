import { usePlans } from "@/features/plans/hooks/usePlans";
import { PricingShell } from "./pricing/PricingShell";
import { PricingSkeleton } from "./pricing/PricingSkeleton";
import { PricingError } from "./pricing/PricingError";
import { PricingEmpty } from "./pricing/PricingEmpty";
import { PricingPlanCard } from "./pricing/PricingPlanCard";

export function Pricing() {
    const { plans, isLoading, isError, refetch } = usePlans();

    if (isLoading) {
        return (
            <PricingShell>
                <PricingSkeleton />
            </PricingShell>
        );
    }

    if (isError) {
        return (
            <PricingShell>
                <PricingError onRetry={() => void refetch()} />
            </PricingShell>
        );
    }

    if (!plans?.length) {
        return (
            <PricingShell>
                <PricingEmpty onRetry={() => void refetch()} />
            </PricingShell>
        );
    }

    return (
        <PricingShell>
            <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                {plans.map((plan) => (
                    <PricingPlanCard key={plan.id} plan={plan} />
                ))}
            </div>
        </PricingShell>
    );
} 


