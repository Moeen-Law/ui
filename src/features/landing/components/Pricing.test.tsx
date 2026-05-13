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

vi.mock("@/features/plans/hooks/usePlans", () => ({
    usePlans: () => usePlansMock(),
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
        isDefault: false,
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
        isDefault: true,
        maxDocumentAnalysisPerDay: 20,
        maxDocumentGenerationPerDay: 10,
        maxTextRequestsPerDay: 100,
        name: "Professional",
        price: 299,
        updatedAt: null,
    },
];

describe("Pricing", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("en");
        usePlansMock.mockReset();
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

    it("renders API plans with price, limits, and default badge", () => {
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
        expect(screen.getByText("299")).toBeInTheDocument();
        expect(screen.getByText("100 text requests per day")).toBeInTheDocument();
        expect(screen.getByText("20 document analyses per day")).toBeInTheDocument();
        expect(screen.getByText("10 document generations per day")).toBeInTheDocument();
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

    it("sends authenticated users to chat", async () => {
        const user = userEvent.setup();
        useAuthStore.getState().setAccessToken("token-1");
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

        await user.click(screen.getByRole("button", { name: /subscribe now/i }));

        expect(screen.getByTestId("location")).toHaveTextContent("/chat");
    });
});
