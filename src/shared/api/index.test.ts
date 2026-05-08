import { http, HttpResponse, delay } from "msw";
import { describe, expect, it, vi } from "vitest";
import useAuthStore from "@/features/auth/store/auth";
import { server } from "@/test/server";
import api from ".";

describe("shared api refresh token handling", () => {
    it("deduplicates concurrent refresh requests and retries with the new access token", async () => {
        let refreshCalls = 0;
        const protectedAuthHeaders: string[] = [];

        useAuthStore.getState().setAccessToken("old-token");

        server.use(
            http.get("*/protected/:id", ({ request }) => {
                const authorization = request.headers.get("Authorization") ?? "";
                protectedAuthHeaders.push(authorization);

                if (authorization === "Bearer new-token") {
                    return HttpResponse.json({ ok: true });
                }

                return HttpResponse.json({ message: "expired" }, { status: 401 });
            }),
            http.post("*/auth/api/v1/auth/refresh", async () => {
                refreshCalls += 1;
                await delay(25);
                return HttpResponse.json({ accessToken: "new-token" });
            })
        );

        await expect(Promise.all([
            api.get("/protected/one"),
            api.get("/protected/two"),
        ])).resolves.toHaveLength(2);

        expect(refreshCalls).toBe(1);
        expect(useAuthStore.getState().accessToken).toBe("new-token");
        expect(protectedAuthHeaders).toEqual([
            "Bearer old-token",
            "Bearer old-token",
            "Bearer new-token",
            "Bearer new-token",
        ]);
    });

    it("retries a stale in-flight request with the current token without refreshing again", async () => {
        let refreshCalls = 0;
        let protectedCalls = 0;

        useAuthStore.getState().setAccessToken("old-token");

        server.use(
            http.get("*/slow-protected", async ({ request }) => {
                await delay(40);
                const authorization = request.headers.get("Authorization") ?? "";
                protectedCalls += 1;

                if (authorization === "Bearer new-token") {
                    return HttpResponse.json({ ok: true });
                }

                return HttpResponse.json({ message: "expired" }, { status: 401 });
            }),
            http.get("*/fast-protected", ({ request }) => {
                const authorization = request.headers.get("Authorization") ?? "";

                if (authorization === "Bearer new-token") {
                    return HttpResponse.json({ ok: true });
                }

                return HttpResponse.json({ message: "expired" }, { status: 401 });
            }),
            http.post("*/auth/api/v1/auth/refresh", () => {
                refreshCalls += 1;
                return HttpResponse.json({ accessToken: "new-token" });
            })
        );

        const slowRequest = api.get("/slow-protected");

        await expect(api.get("/fast-protected")).resolves.toMatchObject({
            data: { ok: true },
        });
        await expect(slowRequest).resolves.toMatchObject({
            data: { ok: true },
        });

        expect(refreshCalls).toBe(1);
        expect(protectedCalls).toBe(2);
    });

    it("clears auth once when a shared refresh fails", async () => {
        let refreshCalls = 0;
        const clearStorageSpy = vi.spyOn(useAuthStore.persist, "clearStorage");

        useAuthStore.getState().setAccessToken("old-token");

        server.use(
            http.get("*/protected-failure/:id", () =>
                HttpResponse.json({ message: "expired" }, { status: 401 })
            ),
            http.post("*/auth/api/v1/auth/refresh", async () => {
                refreshCalls += 1;
                await delay(25);
                return HttpResponse.json({ message: "invalid refresh" }, { status: 401 });
            })
        );

        await expect(Promise.all([
            api.get("/protected-failure/one"),
            api.get("/protected-failure/two"),
        ])).rejects.toBeDefined();

        expect(refreshCalls).toBe(1);
        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(clearStorageSpy).toHaveBeenCalledTimes(1);
    });
});
