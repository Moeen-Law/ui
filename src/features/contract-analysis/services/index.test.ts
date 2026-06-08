import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { createContractAnalysis, fetchContractAnalyses, fetchContractAnalysis } from ".";

describe("contract analysis services", () => {
    it("posts uploaded file IDs with the backend filesIds payload key", async () => {
        let capturedBody: unknown;

        server.use(
            http.post("*/chats/api/v1/tasks/contract-analysis", async ({ request }) => {
                capturedBody = await request.json();

                return HttpResponse.json({
                    id: "analysis-1",
                    userId: "user-1",
                    taskType: "CONTRACT_ANALYSIS",
                    status: "completed",
                    aiTaskId: "ai-task-1",
                    createdAt: "2026-06-08T04:08:17.795Z",
                    updatedAt: "2026-06-08T04:08:41.741Z",
                    input: {
                        files_ids: ["7fbfab06-579c-4c9a-8586-d5295fb25f90"],
                    },
                    result: {
                        message: "Contract analysis response shape",
                        intent: "CONTRACT_ANALYSIS",
                        sources: [],
                    },
                });
            })
        );

        const response = await createContractAnalysis(["7fbfab06-579c-4c9a-8586-d5295fb25f90"]);

        expect(capturedBody).toEqual({
            filesIds: ["7fbfab06-579c-4c9a-8586-d5295fb25f90"],
        });
        expect(response).toMatchObject({
            id: "analysis-1",
            status: "completed",
        });
    });

    it("requests contract analyses with pagination params", async () => {
        const capturedParams: Record<string, string | null> = {};

        server.use(
            http.get("*/chats/api/v1/tasks/contract-analysis", ({ request }) => {
                const requestUrl = new URL(request.url);
                capturedParams.page = requestUrl.searchParams.get("page");
                capturedParams.size = requestUrl.searchParams.get("size");
                capturedParams.sortOrder = requestUrl.searchParams.get("sortOrder");

                return HttpResponse.json({
                    data: [],
                    meta: {
                        page: 2,
                        size: 5,
                        results: 0,
                        total: 0,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: true,
                    },
                });
            })
        );

        await fetchContractAnalyses({ page: 2, size: 5, sortOrder: "DESC" });

        expect(capturedParams.page).toBe("2");
        expect(capturedParams.size).toBe("5");
        expect(capturedParams.sortOrder).toBe("DESC");
    });

    it("requests a contract analysis by id", async () => {
        let requestedUrl = "";

        server.use(
            http.get("*/chats/api/v1/tasks/contract-analysis/analysis-1", ({ request }) => {
                requestedUrl = request.url;

                return HttpResponse.json({
                    id: "analysis-1",
                    userId: "user-1",
                    taskType: "CONTRACT_ANALYSIS",
                    status: "success",
                    aiTaskId: "ai-task-1",
                    createdAt: "2026-06-08T04:08:17.795Z",
                    updatedAt: "2026-06-08T04:08:41.741Z",
                    input: {
                        files_ids: ["file-1"],
                    },
                    result: {
                        message: "Saved analysis",
                        intent: "CONTRACT_ANALYSIS",
                        sources: [],
                    },
                });
            })
        );

        const response = await fetchContractAnalysis("analysis-1");

        expect(requestedUrl).toContain("/tasks/contract-analysis/analysis-1");
        expect(response.id).toBe("analysis-1");
    });
});
