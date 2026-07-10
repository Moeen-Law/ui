import type { Meta, Sender } from "./common";
import type { ChatMessageFile } from "./files";
import type { LawSource } from "./stream";

export interface MessageResponse { data: MessageDatum[]; meta: Meta; }
export interface FetchMessagesParams { page?: number; size?: number; sortOrder?: "ASC" | "DESC"; }
export interface MessageDatum {
    id: string;
    content: string;
    sender: Sender;
    createdAt: Date;
    chatId: string;
    responseSource: ResponseSource | null;
    files: ChatMessageFile[];
}
export interface ResponseSource { id: string; data: LawSource[] | Record<string, unknown>; messageId: string; }
