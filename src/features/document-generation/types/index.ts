import type { Meta } from "@/features/chat/types";

export interface DocumentTemplatesResponse {
    items: DocumentTemplateSummary[];
}

export interface DocumentTemplateSummary {
    id: string;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface DocumentTemplate extends DocumentTemplateSummary {
    markdown_content?: string | null;
    fields: DocumentTemplateField[];
}

export interface DocumentTemplateField {
    id: string;
    template_id: string;
    name: string;
    type: DocumentTemplateFieldType;
    required: boolean;
    description?: string | null;
    example?: string | null;
}

export type DocumentTemplateFieldType = "array" | "date" | "string";

export interface GenerateDocumentRequest {
    templateId: string;
    data: Record<string, string | string[]>;
}

export interface GeneratedDocumentsResponse {
    data: GeneratedDocument[];
    meta?: Meta;
}

export interface GeneratedDocument {
    id: string;
    userId?: string;
    taskType?: string;
    input: GeneratedDocumentInput;
    result?: GeneratedDocumentResult;
    status: DocumentGenerationStatus | string;
    aiTaskId?: string | null;
    createdAt: string;
    updatedAt?: string;
    generatedFile?: GeneratedFile | null;
}

export interface GeneratedDocumentInput {
    template_id?: string;
    templateId?: string;
    data: Record<string, string | string[]>;
}

export interface GeneratedDocumentResult {
    file_id?: string;
}

export interface GeneratedFile {
    fileId: string;
    status?: string;
    originalName: string;
    contentType?: string;
    size?: number;
    downloadUrl?: string;
    downloadUrlExpiresInSeconds?: number;
}

export type DocumentGenerationStatus = "success" | "completed" | "pending" | "processing" | "failed";

export interface FetchGeneratedDocumentsParams {
    page?: number;
    size?: number;
    sortOrder?: "ASC" | "DESC";
}
