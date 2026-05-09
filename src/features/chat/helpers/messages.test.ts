import { describe, expect, it } from "vitest";
import type { StreamMessage } from "../types";
import { mergeStreamMessages } from "./messages";

const message = (
    id: string,
    sender: StreamMessage["sender"],
    content: string,
    overrides: Partial<StreamMessage> = {}
): StreamMessage => ({
    id,
    sender,
    content,
    ...overrides,
});

describe("mergeStreamMessages", () => {
    it("preserves already-loaded older messages when refreshed pages shift", () => {
        const current = [
            message("old-1", "user", "older question"),
            message("old-2", "ai", "older answer"),
            message("mid-1", "user", "middle question"),
            message("mid-2", "ai", "middle answer"),
        ];
        const shiftedServerWindow = [
            message("mid-1", "user", "middle question updated"),
            message("mid-2", "ai", "middle answer"),
            message("new-1", "user", "new question"),
            message("new-2", "ai", "new answer"),
        ];

        expect(mergeStreamMessages(current, shiftedServerWindow).map((item) => item.id)).toEqual([
            "old-1",
            "old-2",
            "mid-1",
            "mid-2",
            "new-1",
            "new-2",
        ]);
    });

    it("updates existing messages by server id", () => {
        const merged = mergeStreamMessages(
            [message("msg-1", "ai", "old content")],
            [message("msg-1", "ai", "fresh content")]
        );

        expect(merged).toEqual([message("msg-1", "ai", "fresh content")]);
    });

    it("prepends newly loaded older server messages before existing anchors", () => {
        const merged = mergeStreamMessages(
            [message("newer-user", "user", "newer question"), message("newer-ai", "ai", "newer answer")],
            [
                message("older-user", "user", "older question"),
                message("older-ai", "ai", "older answer"),
                message("newer-user", "user", "newer question"),
                message("newer-ai", "ai", "newer answer"),
            ]
        );

        expect(merged.map((item) => item.id)).toEqual(["older-user", "older-ai", "newer-user", "newer-ai"]);
    });

    it("removes optimistic placeholders when matching server messages arrive", () => {
        const merged = mergeStreamMessages(
            [
                message("older", "ai", "already loaded"),
                message("temp-user", "user", "new question", { isOptimistic: true }),
                message("temp-ai", "ai", "", { isOptimistic: true, isStreaming: false }),
            ],
            [
                message("server-user", "user", "new question"),
                message("server-ai", "ai", "new answer"),
            ]
        );

        expect(merged.map((item) => item.id)).toEqual(["older", "server-user", "server-ai"]);
    });

    it("removes a stale synthetic error when the server window resolves its user message", () => {
        const merged = mergeStreamMessages(
            [
                message("user-1", "user", "question"),
                message("error-user-1", "ai", "error", { isError: true }),
            ],
            [
                message("user-1", "user", "question"),
                message("ai-1", "ai", "answer"),
            ]
        );

        expect(merged.map((item) => item.id)).toEqual(["user-1", "ai-1"]);
    });
});
