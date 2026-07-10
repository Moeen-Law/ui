import type { ChatMessageFile } from "../types";

export const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const toOptimisticMessageFiles = (files: File[], fileIds: string[]): ChatMessageFile[] =>
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
