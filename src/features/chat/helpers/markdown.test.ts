import { describe, expect, it } from "vitest";
import { normalizeAssistantMarkdown } from "./markdown";

describe("normalizeAssistantMarkdown", () => {
    it("removes accidental spaces inside bold markers", () => {
        expect(normalizeAssistantMarkdown("** نصيحة عملية**")).toBe("**نصيحة عملية**");
    });

    it("promotes known standalone section labels to headings", () => {
        expect(normalizeAssistantMarkdown("📌 الإجابة المختصرة")).toBe("## 📌 الإجابة المختصرة");
        expect(normalizeAssistantMarkdown("📖 التفاصيل القانونية")).toBe("## 📖 التفاصيل القانونية");
    });

    it("leaves normal markdown unchanged", () => {
        expect(normalizeAssistantMarkdown("- item\n\n**bold**")).toBe("- item\n\n**bold**");
    });
});

