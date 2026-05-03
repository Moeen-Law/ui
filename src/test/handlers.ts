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
];

