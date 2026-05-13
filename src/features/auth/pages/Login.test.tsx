import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/auth";
import Login from "./Login";
import { renderWithProviders } from "@/test/render";

function LocationProbe() {
    const location = useLocation();

    return <div data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</div>;
}

describe("Login page", () => {
    it("shows validation errors for invalid input", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(<Login />, { route: "/login" });
        const [emailInput, passwordInput] = Array.from(container.querySelectorAll("input")) as HTMLInputElement[];

        await user.type(emailInput!, "bad-email");
        await user.type(passwordInput!, "short");
        await user.click(screen.getByRole("button", { name: /^sign in$/i }));

        expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
        expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    });

    it("stores access token after successful login", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(<Login />, { route: "/login" });
        const [emailInput, passwordInput] = Array.from(container.querySelectorAll("input")) as HTMLInputElement[];

        await user.type(emailInput!, "user@example.com");
        await user.type(passwordInput!, "Password1!");
        await user.click(screen.getByRole("button", { name: /^sign in$/i }));

        await waitFor(() => {
            expect(useAuthStore.getState().accessToken).toBe("test-access-token");
        });
    });

    it("returns to the pricing section after successful login with a safe redirect", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(
            <>
                <Login />
                <LocationProbe />
            </>,
            { route: "/login?redirect=%2F%23pricing" }
        );
        const [emailInput, passwordInput] = Array.from(container.querySelectorAll("input")) as HTMLInputElement[];

        await user.type(emailInput!, "user@example.com");
        await user.type(passwordInput!, "Password1!");
        await user.click(screen.getByRole("button", { name: /^sign in$/i }));

        await waitFor(() => {
            expect(screen.getByTestId("location")).toHaveTextContent("/#pricing");
        });
    });

    it("falls back home after successful login with an unsafe redirect", async () => {
        const user = userEvent.setup();
        const { container } = renderWithProviders(
            <>
                <Login />
                <LocationProbe />
            </>,
            { route: "/login?redirect=https%3A%2F%2Fevil.test" }
        );
        const [emailInput, passwordInput] = Array.from(container.querySelectorAll("input")) as HTMLInputElement[];

        await user.type(emailInput!, "user@example.com");
        await user.type(passwordInput!, "Password1!");
        await user.click(screen.getByRole("button", { name: /^sign in$/i }));

        await waitFor(() => {
            expect(screen.getByTestId("location")).toHaveTextContent("/");
        });
    });
});
