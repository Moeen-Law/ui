import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { ChatInputFile } from "../components/ChatInput";
import { toOptimisticMessageFiles } from "../helpers/files";
import { createChat, uploadMessageFiles } from "../services";
import type { ChatMessageFile, ChatResponse, StreamMessage, StreamStatus } from "../types";
import { dailyQuotaKeys } from "./useDailyQuota";

type SendMessage = (
    content: string,
    overrideChatId?: string,
    fileIds?: string[],
    optimisticFiles?: ChatMessageFile[],
) => Promise<void>;

interface Options {
    chatId?: string;
    quotaExhausted: boolean;
    streamMessages: StreamMessage[];
    streamStatus: StreamStatus;
    sendMessage: SendMessage;
}

const createInputFile = (file: File): ChatInputFile => ({ id: crypto.randomUUID(), file, status: "selected" });
const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;
const createChatTitle = (message: string) => message.length > 30 ? `${message.substring(0, 30)}...` : message;

export function useChatComposer({ chatId, quotaExhausted, streamMessages, streamStatus, sendMessage }: Options) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [inputValue, setInputValue] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<ChatInputFile[]>([]);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
    const [pendingUserFiles, setPendingUserFiles] = useState<ChatInputFile[]>([]);

    const selectFiles = useCallback((files: File[]) => {
        setSelectedFiles((previous) => {
            const existing = new Set(previous.map((item) => fileKey(item.file)));
            return [...previous, ...files.filter((file) => !existing.has(fileKey(file))).map(createInputFile)];
        });
    }, []);

    const removeFile = useCallback((id: string) => {
        setSelectedFiles((previous) => previous.filter((item) => item.id !== id));
    }, []);

    const uploadFiles = useCallback(async (attachments: ChatInputFile[]) => {
        if (attachments.length === 0) return { fileIds: [], optimisticFiles: [] };
        const files = attachments.map((attachment) => attachment.file);
        setIsUploadingFiles(true);
        setSelectedFiles((previous) => previous.map((item) =>
            attachments.some((attachment) => attachment.id === item.id) ? { ...item, status: "uploading" } : item
        ));
        const fileIds = await uploadMessageFiles(files);
        return { fileIds, optimisticFiles: toOptimisticMessageFiles(files, fileIds) };
    }, []);

    const restoreFailedSubmission = useCallback((message: string, attachments: ChatInputFile[], errorMessage: string) => {
        setInputValue(message);
        setSelectedFiles(attachments.map((item) => ({ ...item, status: "error", error: errorMessage })));
    }, []);

    const clearPendingCreation = useCallback(() => {
        setIsCreatingChat(false);
        setPendingUserMessage(null);
        setPendingUserFiles([]);
    }, []);

    const submit = useCallback(async () => {
        const content = inputValue.trim();
        if (!content) return;
        if (quotaExhausted) {
            toast.error(t("quota.exhausted.chat"));
            return;
        }
        const attachments = selectedFiles;
        setInputValue("");

        if (!chatId) {
            setPendingUserMessage(content);
            setPendingUserFiles(attachments);
            setIsCreatingChat(true);
            try {
                const newChat = await createChat(createChatTitle(content));
                queryClient.setQueryData<InfiniteData<ChatResponse>>(["chats"], (old) => old ? ({
                    ...old,
                    pages: old.pages.map((page, index) => index === 0 ? {
                        ...page,
                        data: [{ ...newChat, messages: [] }, ...page.data],
                        meta: { ...page.meta, total: page.meta.total + 1 },
                    } : page),
                }) : old);
                const { fileIds, optimisticFiles } = await uploadFiles(attachments);
                setSelectedFiles([]);
                clearPendingCreation();
                await sendMessage(content, newChat.id, fileIds, optimisticFiles);
                void queryClient.invalidateQueries({ queryKey: dailyQuotaKeys.all });
                navigate(`/chat/${newChat.id}`, { replace: true });
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : t("chat.errors.createFailed");
                toast.error(errorMessage);
                restoreFailedSubmission(content, attachments, errorMessage);
                clearPendingCreation();
            } finally {
                setIsUploadingFiles(false);
                void queryClient.invalidateQueries({ queryKey: ["chats"] });
            }
            return;
        }

        try {
            const { fileIds, optimisticFiles } = await uploadFiles(attachments);
            setSelectedFiles([]);
            await sendMessage(content, undefined, fileIds, optimisticFiles);
            void queryClient.invalidateQueries({ queryKey: dailyQuotaKeys.all });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t("chat.errors.processingError");
            toast.error(errorMessage);
            restoreFailedSubmission(content, attachments, errorMessage);
        } finally {
            setIsUploadingFiles(false);
        }
    }, [chatId, clearPendingCreation, inputValue, navigate, queryClient, quotaExhausted, restoreFailedSubmission, selectedFiles, sendMessage, t, uploadFiles]);

    const messages = useMemo(() => {
        if (!isCreatingChat || !pendingUserMessage) return streamMessages;
        return [...streamMessages, {
            id: "temp-user",
            content: pendingUserMessage,
            sender: "user" as const,
            files: pendingUserFiles.map((item) => ({
                fileId: item.id,
                status: item.status,
                originalName: item.file.name,
                contentType: item.file.type || "application/octet-stream",
                size: item.file.size,
            })),
        }, { id: "temp-ai", content: "", sender: "ai" as const, isStreaming: true }];
    }, [isCreatingChat, pendingUserFiles, pendingUserMessage, streamMessages]);

    return {
        inputValue,
        setInputValue,
        selectedFiles,
        selectFiles,
        removeFile,
        isUploadingFiles,
        submit,
        messages,
        status: (isCreatingChat ? "creating" : streamStatus) as StreamStatus,
    };
}
