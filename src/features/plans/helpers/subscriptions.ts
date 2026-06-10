import type { SubscriptionInfo } from "@/features/auth/types";

export const isCurrentSubscription = (subscription: SubscriptionInfo) =>
    Boolean(subscription.planId) && subscription.status?.toLowerCase() === "active";

export const getCurrentPlanIds = (subscriptions: SubscriptionInfo[] = []) =>
    new Set(
        subscriptions
            .filter(isCurrentSubscription)
            .map((subscription) => subscription.planId)
    );
