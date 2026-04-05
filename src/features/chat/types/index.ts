


export interface ChatResponse {
    data: ChatResponseDatum[];
    meta: Meta;
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
}

export type Sender = "ai" | "user";

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
    isStreaming?: boolean;
    isError?: boolean;
    isStopped?: boolean;
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

