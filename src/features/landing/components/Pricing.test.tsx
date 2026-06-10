import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation } from "react-router-dom";
import i18n from "@/lib/i18n";
import { renderWithProviders } from "@/test/render";
import useAuthStore from "@/features/auth/store/auth";
import { Pricing } from "./Pricing";

const { usePlansMock } = vi.hoisted(() => ({
    usePlansMock: vi.fn(),
}));

const { useMeMock } = vi.hoisted(() => ({
    useMeMock: vi.fn(),
}));

const { startPlanPaymentMock, useStartPlanPaymentMock } = vi.hoisted(() => ({
    startPlanPaymentMock: vi.fn(),
    useStartPlanPaymentMock: vi.fn(() => ({
        startPlanPayment: startPlanPaymentMock,
        isPending: false,
    })),
}));

vi.mock("@/features/plans/hooks/usePlans", () => ({
    usePlans: () => usePlansMock(),
}));

vi.mock("@/features/plans/hooks/useStartPlanPayment", () => ({
    useStartPlanPayment: () => useStartPlanPaymentMock(),
}));

vi.mock("@/features/auth/hooks/useMe", () => ({
    useMe: (options?: { enabled?: boolean }) => useMeMock(options),
}));

function LocationProbe() {
    const location = useLocation();

    return <div data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</div>;
}

const plans = [
    {
        createdAt: new Date("2026-01-01"),
        description: "For light legal assistance.",
        durationDays: 30,
        id: "free",
        isDefault: true,
        isBestPlan: false,
        maxDocumentAnalysisPerDay: 1,
        maxDocumentGenerationPerDay: 0,
        maxTextRequestsPerDay: 5,
        name: "Free",
        price: 0,
        updatedAt: null,
    },
    {
        createdAt: new Date("2026-01-01"),
        description: "For growing legal workflows.",
        durationDays: 30,
        id: "pro",
        isDefault: false,
        isBestPlan: true,
        maxDocumentAnalysisPerDay: 20,
        maxDocumentGenerationPerDay: 10,
        maxTextRequestsPerDay: 100,
        name: "Professional",
        price: 299,
        updatedAt: null,
    },
];

const profile = {
    active: true,
    createdAt: new Date("2026-01-01"),
    deleted: false,
    email: "user@example.com",
    id: "user-1",
    name: "User",
    roles: ["USER"],
    subscriptionInfo: [],
    updatedAt: new Date("2026-01-01"),
};

describe("Pricing", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("en");
        usePlansMock.mockReset();
        useMeMock.mockReset();
        useMeMock.mockReturnValue({
            profile,
            isPending: false,
            isError: false,
        });
        startPlanPaymentMock.mockReset();
        useStartPlanPaymentMock.mockReturnValue({
            startPlanPayment: startPlanPaymentMock,
            isPending: false,
        });
        useAuthStore.getState().removeAccessToken();
    });

    it("renders matching skeleton cards while loading", () => {
        usePlansMock.mockReturnValue({
            plans: undefined,
            isLoading: true,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(<Pricing />);

        expect(screen.getByLabelText("Loading pricing plans")).toBeInTheDocument();
        expect(screen.getAllByTestId("pricing-skeleton-card")).toHaveLength(3);
    });

    it("renders an error state and retries", async () => {
        const user = userEvent.setup();
        const refetch = vi.fn();
        usePlansMock.mockReturnValue({
            plans: undefined,
            isLoading: false,
            isError: true,
            refetch,
        });

        renderWithProviders(<Pricing />);

        expect(screen.getByText("Plans could not be loaded")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /try again/i }));

        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("renders an empty state when the API returns no plans", () => {
        usePlansMock.mockReturnValue({
            plans: [],
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(<Pricing />);

        expect(screen.getByText("No plans available")).toBeInTheDocument();
    });

    it("renders API plans with price, limits, and the recommended best-plan badge for guests", () => {
        usePlansMock.mockReturnValue({
            plans,
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(<Pricing />);

        expect(screen.getByText("Free")).toBeInTheDocument();
        expect(screen.getByText("Professional")).toBeInTheDocument();
        expect(screen.getByText("For growing legal workflows.")).toBeInTheDocument();
        expect(screen.getByText("Recommended")).toBeInTheDocument();
        expect(screen.queryByText("Current Plan")).not.toBeInTheDocument();
        expect(screen.getByText("299")).toBeInTheDocument();
        expect(screen.getByText("100 text requests per day")).toBeInTheDocument();
        expect(screen.getByText("20 document analyses per day")).toBeInTheDocument();
        expect(screen.getByText("10 document generations per day")).toBeInTheDocument();
        expect(useMeMock).toHaveBeenCalledWith({ enabled: false });
    });

    it("does not disable a default plan for guests", async () => {
        const user = userEvent.setup();
        usePlansMock.mockReturnValue({
            plans,
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(
            <>
                <Pricing />
                <LocationProbe />
            </>
        );

        const startButtons = screen.getAllByRole("button", { name: /start plan/i });
        expect(startButtons).toHaveLength(2);

        await user.click(startButtons[1]);

        expect(screen.getByTestId("location")).toHaveTextContent("/login?redirect=%2F%23pricing");
        expect(useMeMock).toHaveBeenCalledWith({ enabled: false });
    });

    it("disables the active subscription plan for authenticated users instead of the default plan", async () => {
        useAuthStore.getState().setAccessToken("token-1");
        useMeMock.mockReturnValue({
            profile: {
                ...profile,
                subscriptionInfo: [
                    {
                        autoRenew: true,
                        createdAt: new Date("2026-01-01"),
                        endDate: new Date("2026-02-01"),
                        id: "subscription-1",
                        planId: "pro",
                        planName: "Professional",
                        price: 299,
                        startDate: new Date("2026-01-01"),
                        status: "ACTIVE",
                        updatedAt: new Date("2026-01-01"),
                        userId: "user-1",
                    },
                ],
            },
            isPending: false,
            isError: false,
        });
        usePlansMock.mockReturnValue({
            plans,
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(<Pricing />);

        expect(screen.getByRole("button", { name: /current plan/i })).toBeDisabled();
        expect(screen.getAllByText("Current Plan")).toHaveLength(1);
        expect(screen.getByText("Recommended")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /start plan/i })).toBeEnabled();
        expect(useMeMock).toHaveBeenCalledWith({ enabled: true });
    });

    it("sends guests to login with a pricing redirect", async () => {
        const user = userEvent.setup();
        usePlansMock.mockReturnValue({
            plans,
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(
            <>
                <Pricing />
                <LocationProbe />
            </>
        );

        await user.click(screen.getAllByRole("button", { name: /start plan/i })[0]);

        expect(screen.getByTestId("location")).toHaveTextContent("/login?redirect=%2F%23pricing");
    });

    it("starts payment for authenticated users selecting another plan", async () => {
        const user = userEvent.setup();
        useAuthStore.getState().setAccessToken("token-1");
        useMeMock.mockReturnValue({
            profile: {
                ...profile,
                subscriptionInfo: [
                    {
                        autoRenew: true,
                        createdAt: new Date("2026-01-01"),
                        endDate: new Date("2026-02-01"),
                        id: "subscription-1",
                        planId: "pro",
                        planName: "Professional",
                        price: 299,
                        startDate: new Date("2026-01-01"),
                        status: "ACTIVE",
                        updatedAt: new Date("2026-01-01"),
                        userId: "user-1",
                    },
                ],
            },
            isPending: false,
            isError: false,
        });
        usePlansMock.mockReturnValue({
            plans,
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(
            <>
                <Pricing />
                <LocationProbe />
            </>
        );

        await user.click(screen.getByRole("button", { name: /start plan/i }));

        expect(startPlanPaymentMock).toHaveBeenCalledWith("free");
        expect(screen.getByTestId("location")).toHaveTextContent("/");
    });

    it("ignores inactive subscription entries when determining the current plan", async () => {
        useAuthStore.getState().setAccessToken("token-1");
        useMeMock.mockReturnValue({
            profile: {
                ...profile,
                subscriptionInfo: [
                    {
                        autoRenew: false,
                        createdAt: new Date("2026-01-01"),
                        endDate: new Date("2026-02-01"),
                        id: "subscription-1",
                        planId: "pro",
                        planName: "Professional",
                        price: 299,
                        startDate: new Date("2026-01-01"),
                        status: "PENDING",
                        updatedAt: new Date("2026-01-01"),
                        userId: "user-1",
                    },
                ],
            },
            isPending: false,
            isError: false,
        });
        usePlansMock.mockReturnValue({
            plans,
            isLoading: false,
            isError: false,
            refetch: vi.fn(),
        });

        renderWithProviders(<Pricing />);

        expect(screen.queryByRole("button", { name: /current plan/i })).not.toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /start plan/i })).toHaveLength(2);
    });
});
