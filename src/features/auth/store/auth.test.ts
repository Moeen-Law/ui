import { describe, expect, it } from "vitest";
import useAuthStore from "./auth";

describe("auth store", () => {
    it("sets and removes the access token", () => {
        useAuthStore.getState().setAccessToken("token-1");

        expect(useAuthStore.getState().accessToken).toBe("token-1");

        useAuthStore.getState().removeAccessToken();

        expect(useAuthStore.getState().accessToken).toBeNull();
    });
});

