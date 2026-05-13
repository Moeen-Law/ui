import { screen } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import useAuthStore from "@/features/auth/store/auth";
import { renderWithProviders } from "@/test/render";
import GuestOnlyRoute from "./GuestOnlyRoute";

function LocationProbe() {
    const location = useLocation();

    return <div data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</div>;
}

describe("GuestOnlyRoute", () => {
    it("redirects authenticated users to a safe redirect target", () => {
        useAuthStore.getState().setAccessToken("token-1");

        renderWithProviders(
            <Routes>
                <Route path="/" element={<LocationProbe />} />
                <Route
                    path="/login"
                    element={
                        <GuestOnlyRoute>
                            <div>Login</div>
                        </GuestOnlyRoute>
                    }
                />
            </Routes>,
            { route: "/login?redirect=%2F%23pricing" }
        );

        expect(screen.getByTestId("location")).toHaveTextContent("/#pricing");
        expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    it("falls back home for unsafe redirect targets", () => {
        useAuthStore.getState().setAccessToken("token-1");

        renderWithProviders(
            <Routes>
                <Route path="/" element={<LocationProbe />} />
                <Route
                    path="/login"
                    element={
                        <GuestOnlyRoute>
                            <div>Login</div>
                        </GuestOnlyRoute>
                    }
                />
            </Routes>,
            { route: "/login?redirect=https%3A%2F%2Fevil.test" }
        );

        expect(screen.getByTestId("location")).toHaveTextContent("/");
        expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    it("renders children for guests", () => {
        renderWithProviders(
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestOnlyRoute>
                            <div>Login</div>
                        </GuestOnlyRoute>
                    }
                />
            </Routes>,
            { route: "/login" }
        );

        expect(screen.getByText("Login")).toBeInTheDocument();
    });
});
