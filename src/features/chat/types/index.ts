


export interface ChatResponse {
    data: ChatResponseDatum[];
    meta: Meta;
}

export interface FetchChatsParams {
    page?: number;
    size?: number;
    search?: string;
}

export interface ChatResponseDatum {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}

export interface Message {
    id: string;
    content: string;
    sender: Sender;
    createdAt: Date;
    chatId: string;
    files?: ChatMessageFile[];
}

export type Sender = "ai" | "user" | "system";

export interface Meta {
    page: number;
    size: number;
    results: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}


export interface ChatUIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}

export interface CreateChatResponse {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface fetchAndUpdateTitleChatResponse {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: unknown[];
}


// ─── Streaming Types ────────────────────────────────────────

export type StreamStatus = "idle" | "creating" | "streaming" | "error" | "done";

export interface StreamMessage {
    id: string;
    content: string;
    sender: Sender;
    files?: ChatMessageFile[];
    isStreaming?: boolean;
    isError?: boolean;
    isStopped?: boolean;
    isOptimistic?: boolean;
}

export interface SourceMetadata {
    law_name: string;
    article_number: string;
    article_text: string;
    kitab: string | null;
    bab: string | null;
    fasl: string | null;
    law_number: string;
    law_year: string;
    law_type: string;
    domain: string;
}

export interface LawSource {
    metadata: SourceMetadata;
}

// ─── Messages Endpoint Types ────────────────────────────────────────

export interface MessageResponse {
    data: MessageDatum[];
    meta: Meta;
}

export interface FetchMessagesParams {
    page?: number;
    size?: number;
    sortOrder?: "ASC" | "DESC";
}

export interface MessageDatum {
    id:             string;
    content:        string;
    sender:         Sender;
    createdAt:      Date;
    chatId:         string;
    responseSource: ResponseSource | null;
    files:          ChatMessageFile[];
}

export interface ResponseSource {
    id:        string;
    data:      LawSource[] | Record<string, unknown>;
    messageId: string;
}



// ─── File Manager Types ────────────────────────────────────────


// endpoint -> /messages/files/upload-url
export interface RequestFileUpload {
    fileName: string;
    mimeType: string;
}


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

export interface FilesStreamEvent {
    messageId?: string;
    files: ChatMessageFile[];
}


// bucket
export interface FileUploadUrl { 
    fileName: string;
    mimeType: string;
    bucket: string;
    uploaderId: string;
    maxSizeBytes: number;
 } 

export interface FileUploadUrlResponse {
    fileId: string;
    uploadUrl: string;
    expiresInSeconds: number;
    httpMethod: string;
}


// daily quota
export interface DailyQuotaRes {
    date:   Date;
    quotas: Quota[];
}

export interface Quota {
    feature:   "chat" | "doc_analysis" | "doc_gen";
    limit:     number;
    remaining: number;
    used:      number;
}
