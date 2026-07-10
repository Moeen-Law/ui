import type { Meta, Sender } from "./common";
import type { ChatMessageFile } from "./files";

export interface ChatResponse { data: ChatResponseDatum[]; meta: Meta; }
export interface FetchChatsParams { page?: number; size?: number; search?: string; }
export interface ChatResponseDatum {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}
export interface Message { id: string; content: string; sender: Sender; createdAt: Date; chatId: string; files?: ChatMessageFile[]; }
export interface CreateChatResponse { id: string; userId: string; title: string; createdAt: Date; updatedAt: Date; }
export interface fetchAndUpdateTitleChatResponse extends CreateChatResponse { messages: unknown[]; }
