import { describe, expect, it } from "vitest";
import {
    extractTextFromStreamData,
    getStreamGraphemesPerUpdate,
    takeStreamPrefix,
} from "./stream";

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

describe("stream presentation helpers", () => {
    it("selects an adaptive presentation rate", () => {
        expect(getStreamGraphemesPerUpdate(250)).toBe(6);
        expect(getStreamGraphemesPerUpdate(251)).toBe(12);
        expect(getStreamGraphemesPerUpdate(601)).toBe(20);
        expect(getStreamGraphemesPerUpdate(1201)).toBe(32);
    });

    it("does not split surrogate pairs or composed graphemes", () => {
        const content = "A👩🏽‍⚖️e\u0301مرحبا";
        const first = takeStreamPrefix(content, 2);

        expect(first.visible).toBe("A👩🏽‍⚖️");
        expect(first.visible + first.remaining).toBe(content);
        expect(takeStreamPrefix(first.remaining, 1).visible).toBe("e\u0301");
    });

    it("preserves all content while draining in batches", () => {
        const original = "سؤال قانوني 👩🏽‍⚖️ with English text";
        let remaining = original;
        let reconstructed = "";

        while (remaining) {
            const next = takeStreamPrefix(remaining, 3);
            reconstructed += next.visible;
            remaining = next.remaining;
        }

        expect(reconstructed).toBe(original);
    });
});

