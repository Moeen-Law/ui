export interface ActiveStreamSession {
    id: string;
    chatId: string;
    userMessageId: string;
    aiMessageId: string;
    controller: AbortController;
    queue: string;
    visibleContent: string;
    frameId: number | null;
    lastCommitAt: number;
    transportComplete: boolean;
    transportOpen: boolean;
    finalized: boolean;
}

export class TokenExpiredError extends Error {
    constructor() {
        super("TOKEN_EXPIRED_RETRY");
        this.name = "TokenExpiredError";
    }
}

export class StreamConnectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StreamConnectionError";
    }
}
