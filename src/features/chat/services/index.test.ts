import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { fetchChats, fetchMessages, uploadMessageFiles } from ".";

describe("chat file upload services", () => {
    it("requests upload URLs and uploads files before returning file IDs", async () => {
        const file = new File(["content"], "contract.pdf", { type: "application/pdf" });

        await expect(uploadMessageFiles([file])).resolves.toEqual(["file-contract.pdf"]);
    });
});

describe("chat message services", () => {
    it("requests chats with the search query param", async () => {
        const capturedParams: Record<string, string | null> = {};

        server.use(
            http.get("*/chats/api/v1/chat", ({ request }) => {
                const requestUrl = new URL(request.url);
                capturedParams.page = requestUrl.searchParams.get("page");
                capturedParams.size = requestUrl.searchParams.get("size");
                capturedParams.sortOrder = requestUrl.searchParams.get("sortOrder");
                capturedParams.includeMessages = requestUrl.searchParams.get("includeMessages");
                capturedParams.search = requestUrl.searchParams.get("search");

                return HttpResponse.json({
                    data: [],
                    meta: {
                        page: 2,
                        size: 10,
                        results: 0,
                        total: 0,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: true,
                    },
                });
            })
        );

        await fetchChats({ page: 2, size: 10, search: " contract " });

        expect(capturedParams.page).toBe("2");
        expect(capturedParams.size).toBe("10");
        expect(capturedParams.sortOrder).toBe("DESC");
        expect(capturedParams.includeMessages).toBe("false");
        expect(capturedParams.search).toBe("contract");
    });

    it("requests messages with page, size, and descending sort order", async () => {
        const capturedParams: Record<string, string | null> = {};

        server.use(
            http.get("*/chats/api/v1/messages/chat-1", ({ request }) => {
                const requestUrl = new URL(request.url);
                capturedParams.page = requestUrl.searchParams.get("page");
                capturedParams.size = requestUrl.searchParams.get("size");
                capturedParams.sortOrder = requestUrl.searchParams.get("sortOrder");

                return HttpResponse.json({
                    data: [],
                    meta: {
                        page: 2,
                        size: 15,
                        results: 0,
                        total: 0,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: true,
                    },
                });
            })
        );

        await fetchMessages("chat-1", { page: 2, size: 15, sortOrder: "DESC" });

        expect(capturedParams.page).toBe("2");
        expect(capturedParams.size).toBe("15");
        expect(capturedParams.sortOrder).toBe("DESC");
    });
});
