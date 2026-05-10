import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import ChatSearchDialog from "./ChatSearchDialog";
import { useLocation } from "react-router-dom";

function LocationProbe() {
    const location = useLocation();

    return <span data-testid="location-path">{location.pathname}</span>;
}

describe("ChatSearchDialog", () => {
    it("searches chats after debouncing the input", async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const capturedParams: Record<string, string | null> = {};

        server.use(
            http.get("*/chats/api/v1/chat", ({ request }) => {
                const requestUrl = new URL(request.url);
                capturedParams.search = requestUrl.searchParams.get("search");
                capturedParams.page = requestUrl.searchParams.get("page");
                capturedParams.size = requestUrl.searchParams.get("size");

                return HttpResponse.json({
                    data: [
                        {
                            id: "chat-1",
                            userId: "user-1",
                            title: "Lease contract",
                            createdAt: "2026-05-10T12:00:00.000Z",
                            updatedAt: "2026-05-10T12:00:00.000Z",
                            messages: [],
                        },
                    ],
                    meta: {
                        page: 1,
                        size: 10,
                        results: 1,
                        total: 1,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPrevPage: false,
                    },
                });
            })
        );

        renderWithProviders(
            <>
                <ChatSearchDialog />
                <LocationProbe />
            </>,
            { route: "/chat" }
        );

        await user.click(screen.getByRole("button", { name: /search chats/i }));
        await user.type(screen.getByPlaceholderText(/search chat title or content/i), "contract");

        await waitFor(() => {
            expect(capturedParams.search).toBe("contract");
        });
        expect(capturedParams.page).toBe("1");
        expect(capturedParams.size).toBe("10");
        expect(await screen.findByText("Lease contract")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /lease contract/i }));

        await waitFor(() => {
            expect(screen.queryByPlaceholderText(/search chat title or content/i)).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByTestId("location-path")).toHaveTextContent("/chat/chat-1");
        });
        expect(
            consoleErrorSpy.mock.calls.some((call) =>
                call.some((value) =>
                    String(value).includes("Maximum update depth exceeded")
                )
            )
        ).toBe(false);
    });

    it("clears the search input when closed without selecting a chat", async () => {
        const user = userEvent.setup();

        renderWithProviders(
            <>
                <ChatSearchDialog />
                <LocationProbe />
            </>,
            { route: "/chat" }
        );

        await user.click(screen.getByRole("button", { name: /search chats/i }));
        await user.type(screen.getByPlaceholderText(/search chat title or content/i), "contract");
        await user.click(screen.getByRole("button", { name: /close/i }));

        await waitFor(() => {
            expect(screen.queryByPlaceholderText(/search chat title or content/i)).not.toBeInTheDocument();
        });
        expect(screen.getByTestId("location-path")).toHaveTextContent("/chat");

        await user.click(screen.getByRole("button", { name: /search chats/i }));

        expect(screen.getByPlaceholderText(/search chat title or content/i)).toHaveValue("");
    });

    it("closes with Escape and overlay click", async () => {
        const user = userEvent.setup();

        renderWithProviders(<ChatSearchDialog />, { route: "/chat" });

        await user.click(screen.getByRole("button", { name: /search chats/i }));
        expect(screen.getByRole("dialog", { name: /search chats/i })).toBeInTheDocument();

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("dialog", { name: /search chats/i })).not.toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /search chats/i }));
        expect(screen.getByRole("dialog", { name: /search chats/i })).toBeInTheDocument();

        await user.click(screen.getByTestId("chat-search-overlay"));

        await waitFor(() => {
            expect(screen.queryByRole("dialog", { name: /search chats/i })).not.toBeInTheDocument();
        });
    });
});
