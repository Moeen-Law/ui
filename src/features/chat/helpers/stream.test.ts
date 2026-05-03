import { describe, expect, it } from "vitest";
import { extractTextFromStreamData } from "./stream";

describe("extractTextFromStreamData", () => {
    it("keeps plain text chunks", () => {
        expect(extractTextFromStreamData("مرحبا")).toBe("مرحبا");
    });

    it("extracts text from structured text chunks", () => {
        expect(extractTextFromStreamData(JSON.stringify({
            type: "text",
            text: "أهلا بك",
            extras: { signature: "secret" },
        }))).toBe("أهلا بك");
    });

    it("extracts text when type is omitted", () => {
        expect(extractTextFromStreamData(JSON.stringify({ text: "hello" }))).toBe("hello");
    });

    it("returns raw data for invalid JSON", () => {
        expect(extractTextFromStreamData("{bad")).toBe("{bad");
    });

    it("ignores structured non-text chunks", () => {
        expect(extractTextFromStreamData(JSON.stringify({ type: "metadata", extras: {} }))).toBeNull();
    });
});

