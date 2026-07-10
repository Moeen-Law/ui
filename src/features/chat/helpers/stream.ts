export interface TextStreamChunk {
    type?: string;
    text: string;
    extras?: Record<string, unknown>;
}

export interface StreamPrefix {
    visible: string;
    remaining: string;
}

const createGraphemeSegmenter = () => {
    if (typeof Intl.Segmenter !== "function") return null;
    return new Intl.Segmenter(undefined, { granularity: "grapheme" });
};

const graphemeSegmenter = createGraphemeSegmenter();

export const getStreamGraphemesPerUpdate = (queueLength: number) => {
    if (queueLength > 1200) return 32;
    if (queueLength > 600) return 20;
    if (queueLength > 250) return 12;
    return 6;
};

export const takeStreamPrefix = (content: string, maximumGraphemes: number): StreamPrefix => {
    if (!content || maximumGraphemes <= 0) {
        return { visible: "", remaining: content };
    }

    if (graphemeSegmenter) {
        let count = 0;
        let splitIndex = content.length;

        for (const segment of graphemeSegmenter.segment(content)) {
            if (count === maximumGraphemes) {
                splitIndex = segment.index;
                break;
            }
            count += 1;
        }

        return {
            visible: content.slice(0, splitIndex),
            remaining: content.slice(splitIndex),
        };
    }

    const codePoints = Array.from(content);
    const visible = codePoints.slice(0, maximumGraphemes).join("");
    return {
        visible,
        remaining: content.slice(visible.length),
    };
};

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

