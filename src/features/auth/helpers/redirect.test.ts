import { describe, expect, it } from "vitest";
import { getSafeRedirectTarget } from "./redirect";

describe("auth redirect helpers", () => {
    it("allows internal redirect targets", () => {
        expect(getSafeRedirectTarget("/#pricing")).toBe("/#pricing");
        expect(getSafeRedirectTarget("/chat")).toBe("/chat");
    });

    it("falls back home for missing or external redirect targets", () => {
        expect(getSafeRedirectTarget(null)).toBe("/");
        expect(getSafeRedirectTarget("https://evil.test")).toBe("/");
        expect(getSafeRedirectTarget("//evil.test")).toBe("/");
    });
});
