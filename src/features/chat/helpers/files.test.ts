import { describe, expect, it } from "vitest";
import { formatFileSize, toOptimisticMessageFiles } from "./files";

describe("chat file helpers", () => {
    it("formats byte, kilobyte, and megabyte sizes", () => {
        expect(formatFileSize(0)).toBe("");
        expect(formatFileSize(512)).toBe("512 B");
        expect(formatFileSize(1536)).toBe("1.5 KB");
        expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB");
    });

    it("creates pending optimistic file metadata", () => {
        const file = new File(["law"], "law.pdf", { type: "application/pdf" });
        expect(toOptimisticMessageFiles([file], ["file-1"])).toEqual([expect.objectContaining({
            fileId: "file-1", status: "pending", originalName: "law.pdf", contentType: "application/pdf", size: 3,
        })]);
    });
});
