import type { StreamMessage } from "../types";

const normalizeContent = (content: string) => content.trim();

const shouldDropResolvedOptimistic = (
    message: StreamMessage,
    serverMessages: StreamMessage[],
    existingServerIds: Set<string>
) => {
    if (!message.isOptimistic) return false;

    if (message.sender === "user") {
        return serverMessages.some(
            (serverMessage) =>
                !serverMessage.isOptimistic &&
                serverMessage.sender === "user" &&
                normalizeContent(serverMessage.content) === normalizeContent(message.content)
        );
    }

    if (message.sender === "ai") {
        return serverMessages.some(
            (serverMessage) =>
                !serverMessage.isOptimistic &&
                !existingServerIds.has(serverMessage.id) &&
                serverMessage.sender === "ai"
        );
    }

    return false;
};

const shouldDropResolvedSyntheticError = (
    message: StreamMessage,
    serverMessages: StreamMessage[],
    serverIds: Set<string>
) => {
    if (!message.isError || !message.id.startsWith("error-") || serverIds.has(message.id)) return false;

    const userId = message.id.replace(/^error-/, "");
    return serverMessages.some((serverMessage) => serverMessage.id === userId);
};

export const mergeStreamMessages = (
    currentMessages: StreamMessage[],
    serverMessages: StreamMessage[]
): StreamMessage[] => {
    const serverIds = new Set(serverMessages.map((message) => message.id));
    const currentNonOptimisticIds = new Set(
        currentMessages
            .filter((message) => !message.isOptimistic)
            .map((message) => message.id)
    );
    const serverById = new Map(serverMessages.map((message) => [message.id, message]));
    const result = currentMessages
        .filter((message) => !shouldDropResolvedOptimistic(message, serverMessages, currentNonOptimisticIds))
        .filter((message) => !shouldDropResolvedSyntheticError(message, serverMessages, serverIds))
        .map((message) => serverById.get(message.id) ?? message);

    const resultIds = new Set(result.map((message) => message.id));

    for (let serverIndex = 0; serverIndex < serverMessages.length; serverIndex++) {
        const serverMessage = serverMessages[serverIndex];
        if (resultIds.has(serverMessage.id)) continue;

        const nextAnchor = serverMessages
            .slice(serverIndex + 1)
            .find((message) => resultIds.has(message.id));

        if (nextAnchor) {
            const nextIndex = result.findIndex((message) => message.id === nextAnchor.id);
            result.splice(nextIndex, 0, serverMessage);
            resultIds.add(serverMessage.id);
            continue;
        }

        const previousAnchor = serverMessages
            .slice(0, serverIndex)
            .reverse()
            .find((message) => resultIds.has(message.id));

        if (previousAnchor) {
            const previousIndex = result.findIndex((message) => message.id === previousAnchor.id);
            result.splice(previousIndex + 1, 0, serverMessage);
        } else {
            result.push(serverMessage);
        }

        resultIds.add(serverMessage.id);
    }

    return result;
};
