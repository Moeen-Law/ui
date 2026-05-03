export interface TextStreamChunk {
    type?: string;
    text: string;
    extras?: Record<string, unknown>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

export const extractTextFromStreamData = (data: string): string | null => {
    try {
        const parsed: unknown = JSON.parse(data);

        if (!isRecord(parsed)) {
            return data;
        }

        const text = parsed.text;
        const type = parsed.type;

        if (typeof text !== "string") {
            return null;
        }

        if (typeof type === "string" && type !== "text") {
            return null;
        }

        return text;
    } catch {
        return data;
    }
};

