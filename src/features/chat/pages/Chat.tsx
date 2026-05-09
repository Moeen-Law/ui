import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput, { type ChatInputFile } from "../components/ChatInput";
import ChatDesktopHeader from "../components/ChatDesktopHeader";
import { useChatStream } from "../hooks/useChatStream";
import { createChat, uploadMessageFiles } from "../services";
import { toast } from "sonner";
import type { ChatMessageFile, StreamStatus, ChatResponse } from "../types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const createInputFile = (file: File): ChatInputFile => ({
    id: crypto.randomUUID(),
    file,
    status: "selected",
});

const toOptimisticMessageFiles = (files: File[], fileIds: string[]): ChatMessageFile[] =>
    fileIds.map((fileId, index) => {
        const file = files[index];

        return {
            fileId,
            status: "pending",
            originalName: file?.name ?? fileId,
            contentType: file?.type || "application/octet-stream",
            size: file?.size ?? 0,
        };
    });

export default function Chat() {
    const { t } = useTranslation();
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [inputValue, setInputValue] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<ChatInputFile[]>([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
    const [pendingUserFiles, setPendingUserFiles] = useState<ChatInputFile[]>([]);

    // Stream hook — active only when we have a chatId
    const {
        messages: streamMessages,
        status: streamStatus,
        isLoading,
        hasOlderMessages,
        isFetchingOlderMessages,
        fetchOlderMessages,
        sendMessage,
        stopStreaming,
    } = useChatStream({ chatId });

    const handleSelectFiles = useCallback((files: File[]) => {
        setSelectedFiles((prev) => {
            const existing = new Set(prev.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`));
            const nextFiles = files
                .filter((file) => !existing.has(`${file.name}-${file.size}-${file.lastModified}`))
                .map(createInputFile);

            return [...prev, ...nextFiles];
        });
    }, []);

    const handleRemoveFile = useCallback((id: string) => {
        setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const uploadSelectedFiles = useCallback(async (attachments: ChatInputFile[]) => {
        if (attachments.length === 0) {
            return {
                fileIds: [] as string[],
                optimisticFiles: [] as ChatMessageFile[],
            };
        }

        const files = attachments.map((attachment) => attachment.file);
        setIsUploadingFiles(true);
        setSelectedFiles((prev) =>
            prev.map((item) => attachments.some((attachment) => attachment.id === item.id)
                ? { ...item, status: "uploading" }
                : item
            )
        );

        const fileIds = await uploadMessageFiles(files);

        return {
            fileIds,
            optimisticFiles: toOptimisticMessageFiles(files, fileIds),
        };
    }, []);

    // ─── Handle sending a message ──────────────────────────────────────
    const handleSendMessage = useCallback(async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        const attachmentsToSend = selectedFiles;

        // Clear input immediately for responsive feel
        setInputValue("");

        // If there's no chatId, we need to create a chat first
        if (!chatId) {
            setPendingUserMessage(trimmedInput);
            setPendingUserFiles(attachmentsToSend);
            setIsCreatingChat(true);
            try {
                // Use the first ~30 chars of the message as the chat title
                const title = trimmedInput.length > 30
                    ? trimmedInput.substring(0, 30) + "..."
                    : trimmedInput;

                const newChat = await createChat(title);

                // Eagerly update the cache so the sidebar shows the new chat instantly
                queryClient.setQueryData<InfiniteData<ChatResponse>>(["chats"], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page, index) => {
                            if (index === 0) {
                                return {
                                    ...page,
                                    data: [{ ...newChat, messages: [] }, ...page.data],
                                    meta: {
                                        ...page.meta,
                                        total: page.meta.total + 1,
                                    }
                                };
                            }
                            return page;
                        }),
                    };
                });

                const { fileIds, optimisticFiles } = await uploadSelectedFiles(attachmentsToSend);

                // Start streaming IMMEDIATELY for the new chat
                // We clear our temporary local optimistic state FIRST, then start the stream 
                // which will handle its own optimistic message management.
                setSelectedFiles([]);
                setIsCreatingChat(false);
                setPendingUserMessage(null);
                setPendingUserFiles([]);

                await sendMessage(trimmedInput, newChat.id, fileIds, optimisticFiles);

                // Navigate to the new chat URL
                navigate(`/chat/${newChat.id}`, { replace: true });
            } catch (error: unknown) {
                console.error("Failed to create chat:", error);
                const errorMsg =
                    error instanceof Error
                        ? error.message
                        : t("chat.errors.createFailed");
                toast.error(errorMsg);
                setInputValue(trimmedInput);
                setSelectedFiles(attachmentsToSend.map((item) => ({ ...item, status: "error", error: errorMsg })));
                // Only clear if there was an error, since we cleared earlier on success
                setIsCreatingChat(false);
                setPendingUserMessage(null);
                setPendingUserFiles([]);
            } finally {
                setIsUploadingFiles(false);
                queryClient.invalidateQueries({ queryKey: ["chats"] });
            }
            return;
        }

        // If we already have a chatId, stream directly
        try {
            const { fileIds, optimisticFiles } = await uploadSelectedFiles(attachmentsToSend);
            setSelectedFiles([]);
            await sendMessage(trimmedInput, undefined, fileIds, optimisticFiles);
        } catch (error: unknown) {
            console.error("Failed to upload files:", error);
            const errorMsg =
                error instanceof Error
                    ? error.message
                    : t("chat.errors.processingError");
            toast.error(errorMsg);
            setInputValue(trimmedInput);
            setSelectedFiles(attachmentsToSend.map((item) => ({ ...item, status: "error", error: errorMsg })));
        } finally {
            setIsUploadingFiles(false);
        }
    }, [inputValue, selectedFiles, chatId, navigate, sendMessage, queryClient, t, uploadSelectedFiles]);

    // ─── Compute overall status and messages ────────────────────────────────────────
    const effectiveStatus: StreamStatus = isCreatingChat ? "creating" : streamStatus;

    // Combine actual stream messages with our optimistic message during creation
    const displayMessages = [...streamMessages];
    if (isCreatingChat && pendingUserMessage) {
        displayMessages.push({
            id: "temp-user",
            content: pendingUserMessage,
            sender: "user",
            files: pendingUserFiles.map((item) => ({
                fileId: item.id,
                status: item.status,
                originalName: item.file.name,
                contentType: item.file.type || "application/octet-stream",
                size: item.file.size,
            })),
        });
        displayMessages.push({
            id: "temp-ai",
            content: "",
            sender: "ai",
            isStreaming: true
        });
    }

    return (
        <div className="flex h-dvh bg-background text-foreground font-['Cairo'] overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                {/* Desktop Header */}
                <ChatDesktopHeader />

                {/* Mobile Header */}
                <ChatHeader />
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <ChatMessages
                        chatId={chatId}
                        messages={displayMessages}
                        isStreaming={effectiveStatus === "streaming" || effectiveStatus === "creating"}
                        isLoading={isLoading}
                        hasOlderMessages={hasOlderMessages}
                        isFetchingOlderMessages={isFetchingOlderMessages}
                        fetchOlderMessages={fetchOlderMessages}
                    />
                    <ChatInput
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        streamStatus={effectiveStatus}
                        onStopStreaming={stopStreaming}
                        selectedFiles={selectedFiles}
                        onSelectFiles={handleSelectFiles}
                        onRemoveFile={handleRemoveFile}
                        isUploadingFiles={isUploadingFiles}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
}
