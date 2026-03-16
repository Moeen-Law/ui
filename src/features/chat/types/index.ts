


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