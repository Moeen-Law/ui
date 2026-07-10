export interface RequestFileUpload { fileName: string; mimeType: string; }
export interface RequestFileUploadResponse {
    fileId: string;
    uploadUrl: string;
    formFields?: FormFields;
    expiresInSeconds: number;
    maxSizeBytes: number;
    httpMethod: string;
    contentType: string;
}
export type FormFields = Record<string, string>;
export type ChatMessageFileStatus = "available" | "pending" | "processing" | "failed";
export interface ChatMessageFile {
    fileId: string;
    status: ChatMessageFileStatus | string;
    originalName: string;
    contentType: string;
    size: number;
    downloadUrl?: string;
    downloadUrlExpiresInSeconds?: number;
}
export interface FilesStreamEvent { messageId?: string; files: ChatMessageFile[]; }
export interface FileUploadUrl { fileName: string; mimeType: string; bucket: string; uploaderId: string; maxSizeBytes: number; }
export interface FileUploadUrlResponse { fileId: string; uploadUrl: string; expiresInSeconds: number; httpMethod: string; }
