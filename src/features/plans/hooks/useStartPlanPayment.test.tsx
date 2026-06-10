import { type ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStartPlanPayment } from "./useStartPlanPayment";
import { createSubscription, paymentAction } from "../services";

vi.mock("../services", () => ({
    createSubscription: vi.fn(),
    paymentAction: vi.fn(),
}));

const createSubscriptionMock = vi.mocked(createSubscription);
const paymentActionMock = vi.mocked(paymentAction);

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: {
                retry: false,
            },
        },
    });

    return function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
}

describe("useStartPlanPayment", () => {
    const originalLocation = window.location;

    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { href: "" },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: originalLocation,
        });
    });

    it("creates a subscription, starts payment, and redirects to the iframe url", async () => {
        createSubscriptionMock.mockResolvedValue({
            autoRenew: true,
            createdAt: new Date("2026-01-01"),
            endDate: null,
            id: "subscription-1",
            planId: "plan-1",
            planName: "Professional",
            price: 299,
            startDate: null,
            status: "PENDING",
            updatedAt: new Date("2026-01-01"),
            userId: "user-1",
        });
        paymentActionMock.mockResolvedValue({
            id: "payment-1",
            userId: "user-1",
            subscriptionId: "subscription-1",
            amount: 299,
            currency: "EGP",
            status: "PENDING",
            paymobOrderId: "order-1",
            iframeUrl: "https://accept.paymob.com/iframe",
            attemptCount: 1,
            createdAt: new Date("2026-01-01"),
            updatedAt: null,
        });

        const { result } = renderHook(() => useStartPlanPayment(), {
            wrapper: createWrapper(),
        });

        result.current.startPlanPayment("plan-1");

        await waitFor(() => {
            expect(window.location.href).toBe("https://accept.paymob.com/iframe");
        });

        expect(createSubscriptionMock).toHaveBeenCalledWith({
            planId: "plan-1",
            autoRenew: true,
        });
        expect(paymentActionMock).toHaveBeenCalledWith("subscription-1");
    });
});
