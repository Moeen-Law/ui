import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import {
    fetchDocumentTemplate,
    fetchDocumentTemplates,
    fetchGeneratedDocuments,
    generateDocument,
} from ".";

describe("document generation services", () => {
    it("requests document templates", async () => {
        const response = await fetchDocumentTemplates();

        expect(response.items).toHaveLength(1);
        expect(response.items[0]).toMatchObject({
            id: "template-lease",
            name: "Lease agreement",
        });
    });

    it("requests a document template by id", async () => {
        let requestedUrl = "";

        server.use(
            http.get("*/chats/api/v1/tasks/document-generation/templates/template-lease", ({ request }) => {
                requestedUrl = request.url;

                return HttpResponse.json({
                    id: "template-lease",
                    name: "Lease agreement",
                    fields: [],
                });
            })
        );

        const response = await fetchDocumentTemplate("template-lease");

        expect(requestedUrl).toContain("/tasks/document-generation/templates/template-lease");
        expect(response.id).toBe("template-lease");
    });

    it("posts generation data with the backend templateId payload key", async () => {
        let capturedBody: unknown;

        server.use(
            http.post("*/chats/api/v1/tasks/document-generation", async ({ request }) => {
                capturedBody = await request.json();

                return HttpResponse.json({
                    id: "generated-document-1",
                    userId: "user-1",
                    taskType: "DOCUMENT_GENERATION",
                    status: "completed",
                    aiTaskId: "ai-task-document-1",
                    createdAt: "2026-06-08T04:08:17.795Z",
                    updatedAt: "2026-06-08T04:08:41.741Z",
                    input: {
                        template_id: "template-lease",
                        data: {
                            lessor: "Ahmed",
                            clauses: ["Payment is due monthly"],
                        },
                    },
                    result: {
                        file_id: "file-generated-document",
                    },
                    generatedFile: {
                        fileId: "file-generated-document",
                        originalName: "lease-agreement.pdf",
                        downloadUrl: "https://storage.test/generated/lease-agreement.pdf",
                    },
                });
            })
        );

        const response = await generateDocument({
            templateId: "template-lease",
            data: {
                lessor: "Ahmed",
                clauses: ["Payment is due monthly"],
            },
        });

        expect(capturedBody).toEqual({
            templateId: "template-lease",
            data: {
                lessor: "Ahmed",
                clauses: ["Payment is due monthly"],
            },
        });
        expect(response).toMatchObject({
            id: "generated-document-1",
            status: "completed",
        });
    });

    it("requests generated documents with pagination params", async () => {
        const capturedParams: Record<string, string | null> = {};

        server.use(
            http.get("*/chats/api/v1/tasks/document-generation", ({ request }) => {
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

        await fetchGeneratedDocuments({ page: 2, size: 5, sortOrder: "DESC" });

        expect(capturedParams.page).toBe("2");
        expect(capturedParams.size).toBe("5");
        expect(capturedParams.sortOrder).toBe("DESC");
    });
});
