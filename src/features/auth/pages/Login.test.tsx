import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import useAuthStore from "../store/auth";
import Login from "./Login";
import { renderWithProviders } from "@/test/render";

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
});
