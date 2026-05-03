import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import useAuthStore from "@/features/auth/store/auth";
import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute", () => {
    it("redirects unauthenticated users", () => {
        renderWithProviders(
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/chat" element={<ProtectedRoute><div>Chat</div></ProtectedRoute>} />
            </Routes>,
            { route: "/chat" }
        );

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.queryByText("Chat")).not.toBeInTheDocument();
    });

    it("renders protected content when authenticated", () => {
        useAuthStore.getState().setAccessToken("token-1");

        renderWithProviders(
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/chat" element={<ProtectedRoute><div>Chat</div></ProtectedRoute>} />
            </Routes>,
            { route: "/chat" }
        );

        expect(screen.getByText("Chat")).toBeInTheDocument();
    });
});

