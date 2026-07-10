import type { Sender } from "./common";
import type { ChatMessageFile } from "./files";

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
export interface LawSource { metadata: SourceMetadata; }
