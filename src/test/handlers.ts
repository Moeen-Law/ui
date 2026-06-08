import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("*/auth/api/v1/auth/login", async ({ request }) => {
    const body = await request.json() as { email?: string };

    if (body.email === "fail@example.com") {
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return HttpResponse.json({ accessToken: "test-access-token" });
  }),

  http.get("*/auth/api/v1/profile", () =>
    HttpResponse.json({ id: "user-1", name: "Test User", email: "test@example.com" })
  ),

  http.post("*/chats/api/v1/messages/files/upload-url", async ({ request }) => {
    const body = await request.json() as { fileName: string; mimeType: string };

    return HttpResponse.json({
      fileId: `file-${body.fileName}`,
      uploadUrl: "https://storage.test/upload",
      formFields: {
        key: `uploads/${body.fileName}`,
        "Content-Type": body.mimeType,
      },
      expiresInSeconds: 900,
      maxSizeBytes: 10_000_000,
      httpMethod: "POST",
      contentType: body.mimeType,
    });
  }),

  http.post("https://storage.test/upload", async () => new HttpResponse(null, { status: 204 })),
  http.put("https://storage.test/upload", async () => new HttpResponse(null, { status: 200 })),

  http.get("*/chats/api/v1/tasks/contract-analysis", () => {
    return HttpResponse.json({
      data: [],
      meta: {
        page: 1,
        size: 5,
        results: 0,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }),

  http.post("*/chats/api/v1/tasks/contract-analysis", async ({ request }) => {
    const body = await request.json() as { filesIds: string[] };

    return HttpResponse.json({
      id: "contract-analysis-1",
      userId: "user-1",
      taskType: "CONTRACT_ANALYSIS",
      status: "completed",
      aiTaskId: "ai-task-1",
      createdAt: "2026-06-08T04:08:17.795Z",
      updatedAt: "2026-06-08T04:08:41.741Z",
      input: {
        files_ids: body.filesIds,
      },
      result: {
        message: "## Contract summary\n\nThe contract contains one important risk.",
        intent: "CONTRACT_ANALYSIS",
        sources: [
          {
            metadata: {
              law_name: "Civil Code No. 131 of 1948",
              article_number: "123",
              article_text: "A test legal article text.",
              kitab: null,
              bab: null,
              fasl: null,
              law_number: "131",
              law_year: "1948",
              law_type: "lawhub",
              domain: "civil",
            },
          },
        ],
      },
    });
  }),

  http.get("*/chats/api/v1/tasks/contract-analysis/:id", ({ params }) => {
    const id = String(params.id);

    return HttpResponse.json({
      id,
      userId: "user-1",
      taskType: "CONTRACT_ANALYSIS",
      status: "completed",
      aiTaskId: "ai-task-1",
      createdAt: "2026-06-08T04:08:17.795Z",
      updatedAt: "2026-06-08T04:08:41.741Z",
      input: {
        files_ids: ["file-contract.pdf"],
      },
      result: {
        message: "## Contract summary\n\nSaved contract analysis response.",
        intent: "CONTRACT_ANALYSIS",
        sources: [],
      },
    });
  }),
];
