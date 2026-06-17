import { Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import useAuthStore from "@/features/auth/store/auth";
import type { ProfileResponse } from "@/features/auth/types";
import { useMe } from "@/features/auth/hooks/useMe";
import AdminRoute from "./AdminRoute";

vi.mock("@/features/auth/hooks/useMe", () => ({
    useMe: vi.fn(),
}));

const useMeMock = vi.mocked(useMe);

const makeProfile = (roles: string[]): ProfileResponse => ({
    active: true,
    createdAt: new Date(),
    deleted: false,
    email: "admin@example.com",
    id: "user-1",
    name: "Admin User",
    roles,
    subscriptionInfo: [],
    updatedAt: new Date(),
});

function LocationProbe() {
    const location = useLocation();

    return <div data-testid="location">{`${location.pathname}${location.search}${location.hash}`}</div>;
}

describe("AdminRoute", () => {
    it("redirects guests to the home page", () => {
        useMeMock.mockReturnValue({
            profile: undefined,
            isPending: false,
            isError: false,
        });

        renderWithProviders(
            <Routes>
                <Route path="/" element={<LocationProbe />} />
                <Route path="/admin" element={<AdminRoute><div>Admin</div></AdminRoute>} />
            </Routes>,
            { route: "/admin" }
        );

        expect(screen.getByTestId("location")).toHaveTextContent("/");
        expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });

    it("redirects authenticated non-admin users to chat", () => {
        useAuthStore.getState().setAccessToken("token-1");
        useMeMock.mockReturnValue({
            profile: makeProfile(["USER"]),
            isPending: false,
            isError: false,
        });

        renderWithProviders(
            <Routes>
                <Route path="/chat" element={<LocationProbe />} />
                <Route path="/admin" element={<AdminRoute><div>Admin</div></AdminRoute>} />
            </Routes>,
            { route: "/admin" }
        );

        expect(screen.getByTestId("location")).toHaveTextContent("/chat");
        expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });

    it("renders children for admin users", () => {
        useAuthStore.getState().setAccessToken("token-1");
        useMeMock.mockReturnValue({
            profile: makeProfile(["admin"]),
            isPending: false,
            isError: false,
        });

        renderWithProviders(
            <Routes>
                <Route path="/admin" element={<AdminRoute><div>Admin</div></AdminRoute>} />
            </Routes>,
            { route: "/admin" }
        );

        expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("shows the admin skeleton while the profile is loading", () => {
        useAuthStore.getState().setAccessToken("token-1");
        useMeMock.mockReturnValue({
            profile: undefined,
            isPending: true,
            isError: false,
        });

        const { container } = renderWithProviders(
            <Routes>
                <Route path="/admin" element={<AdminRoute><div>Admin</div></AdminRoute>} />
            </Routes>,
            { route: "/admin" }
        );

        expect(container.querySelector(".admin-dashboard")).toBeInTheDocument();
        expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });
});
