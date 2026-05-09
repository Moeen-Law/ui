import api from "@/shared/api";
import request from "@/shared/api/request";
import type {
    ChatResponse,
    CreateChatResponse,
    FetchMessagesParams,
    fetchAndUpdateTitleChatResponse,
    MessageResponse,
    RequestFileUploadResponse
} from "../types";
import { chatService } from "../helpers";

export const fetchChats = ({ page = 1, size = 7 }: { page?: number; size?: number } = {}) => 
    request<ChatResponse>(api.get(`${chatService}/chat?page=${page}&size=${size}&sortOrder=DESC&includeMessages=false`));

export const createChat = (title: string) => request<CreateChatResponse>(api.post(`${chatService}/chat`, { title }));

export const fetchChat = (id: string) => request<fetchAndUpdateTitleChatResponse>(api.get(`${chatService}/chat/${id}`));

export const updateChatTitle = ({ id, title }: { id: string, title: string }) => request<fetchAndUpdateTitleChatResponse>(api.patch(`${chatService}/chat/${id}`, { title }));

export const deleteChat = (id: string) => request<Promise<void>>(api.delete(`${chatService}/chat/${id}`));

export const fetchMessages = (
    chatId: string,
    { page = 1, size = 5, sortOrder = "DESC" }: FetchMessagesParams = {}
) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortOrder,
    });

    return request<MessageResponse>(api.get(`${chatService}/messages/${chatId}?${params.toString()}`));
};

export const stopStream = (chatId: string) => request<Promise<void>>(api.post(`${chatService}/messages/chat/stream/${chatId}/stop`)); 

export const requestMessageFileUploadUrl = (file: File) =>
    request<RequestFileUploadResponse>(api.post(`${chatService}/messages/files/upload-url`, {
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
    }));

export const uploadMessageFile = async (file: File, uploadUrl: RequestFileUploadResponse) => {
    const method = uploadUrl.httpMethod || "POST";

    if (uploadUrl.formFields && Object.keys(uploadUrl.formFields).length > 0) {
        const form = new FormData();
        Object.entries(uploadUrl.formFields).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append("file", file);

        const response = await fetch(uploadUrl.uploadUrl, {
            method,
            body: form,
        });

        if (!response.ok) {
            throw new Error(`upload rejected: ${response.status} ${await response.text()}`);
        }

        return;
    }

    const response = await fetch(uploadUrl.uploadUrl, {
        method,
        headers: {
            "Content-Type": file.type || uploadUrl.contentType || "application/octet-stream",
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error(`upload rejected: ${response.status} ${await response.text()}`);
    }
};

export const uploadMessageFiles = async (files: File[]) => {
    const uploads = files.map(async (file) => {
        const uploadUrl = await requestMessageFileUploadUrl(file);
        await uploadMessageFile(file, uploadUrl);
        return uploadUrl.fileId;
    });

    return Promise.all(uploads);
};
