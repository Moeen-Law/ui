import { describe, expect, it } from "vitest";
import {
    getDocumentTemplateName,
    hasInvalidDateFieldValue,
    isFieldValueEmpty,
    isValidDateFieldValue,
    normalizeFieldValue,
} from ".";
import type { DocumentTemplate, DocumentTemplateField, GeneratedDocument } from "../types";

const template: DocumentTemplate = {
    id: "template-lease",
    name: "Lease agreement",
    fields: [],
};

const field: DocumentTemplateField = {
    id: "field-clauses",
    template_id: "template-lease",
    name: "clauses",
    type: "array",
    required: false,
};

const dateField: DocumentTemplateField = {
    id: "field-effective-date",
    template_id: "template-lease",
    name: "effective_date",
    type: "date",
    required: false,
};

const generatedDocument: GeneratedDocument = {
    id: "document-1",
    input: {
        template_id: "template-lease",
        data: {},
    },
    status: "completed",
    createdAt: "2026-06-08T04:08:17.795Z",
};

describe("document generation helpers", () => {
    it("normalizes array fields from one item per line", () => {
        expect(normalizeFieldValue(field, "First clause\n\n Second clause ")).toEqual([
            "First clause",
            "Second clause",
        ]);
    });

    it("detects empty array fields after trimming blank lines", () => {
        expect(isFieldValueEmpty(field, "\n \n")).toBe(true);
    });

    it("resolves template names from snake_case history input", () => {
        expect(getDocumentTemplateName(generatedDocument, [template])).toBe("Lease agreement");
    });

    it("resolves template names from camelCase history input", () => {
        expect(
            getDocumentTemplateName(
                {
                    ...generatedDocument,
                    input: {
                        templateId: "template-lease",
                        data: {},
                    },
                },
                [template]
            )
        ).toBe("Lease agreement");
    });

    it("accepts valid date field values", () => {
        expect(isValidDateFieldValue("2026-06-08")).toBe(true);
    });

    it("rejects invalid date field values", () => {
        expect(isValidDateFieldValue("2026-02-31")).toBe(false);
        expect(isValidDateFieldValue("not-a-date")).toBe(false);
    });

    it("allows empty optional date fields", () => {
        expect(hasInvalidDateFieldValue(dateField, "")).toBe(false);
    });

    it("flags filled invalid date fields", () => {
        expect(hasInvalidDateFieldValue(dateField, "2026-13-01")).toBe(true);
    });
});
