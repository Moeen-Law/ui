import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/lib/i18n";
import { errorToastStyle } from "@/shared/constants";
import { createSubscription, paymentAction } from "../services";

export const useStartPlanPayment = () => {
    const mutation = useMutation({
        mutationFn: async (planId: string) => {
            const subscription = await createSubscription({ planId, autoRenew: true });
            const payment = await paymentAction(subscription.id);
            return payment;
        },
        onSuccess: (payment) => {
            window.location.href = payment.iframeUrl;
        },
        onError: (error: { message?: string }) => {
            toast.error(error?.message || i18n.t("pricing.paymentStartError"), {
                style: errorToastStyle,
            });
        },
    });

    return {
        startPlanPayment: mutation.mutate,
        isPending: mutation.isPending,
    };
};
