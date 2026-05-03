import { describe, expect, it } from "vitest";
import { uploadMessageFiles } from ".";

describe("chat file upload services", () => {
    it("requests upload URLs and uploads files before returning file IDs", async () => {
        const file = new File(["content"], "contract.pdf", { type: "application/pdf" });

        await expect(uploadMessageFiles([file])).resolves.toEqual(["file-contract.pdf"]);
    });
});

