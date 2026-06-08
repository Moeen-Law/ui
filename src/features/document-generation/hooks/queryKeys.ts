import type { FetchGeneratedDocumentsParams } from "../types";

export const documentGenerationKeys = {
    all: ["document-generation"] as const,
    templates: () => [...documentGenerationKeys.all, "templates"] as const,
    template: (templateId: string) =>
        [...documentGenerationKeys.templates(), templateId] as const,
    documents: () => [...documentGenerationKeys.all, "documents"] as const,
    documentsList: (params: FetchGeneratedDocumentsParams) =>
        [...documentGenerationKeys.documents(), params] as const,
};
