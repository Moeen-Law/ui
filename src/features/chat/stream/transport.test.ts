import { describe, expect, it } from "vitest";
import { parseFilesEvent, parseSourcesEvent, toStreamErrorMessage } from "./transport";

describe("stream transport helpers", () => {
    it("parses sources and file events", () => {
        expect(parseSourcesEvent('[{"metadata":{"law_name":"Civil"}}]')).toHaveLength(1);
        expect(parseFilesEvent('{"messageId":"m1","files":[]}')).toEqual({ messageId: "m1", files: [] });
    });

    it("rejects malformed structured events", () => {
        expect(parseSourcesEvent("{" )).toBeNull();
        expect(parseFilesEvent("{" )).toBeNull();
    });

    it("normalizes Error and string failures", () => {
        expect(toStreamErrorMessage(new Error("offline"))).toBe("offline");
        expect(toStreamErrorMessage("closed")).toBe("closed");
    });
});
