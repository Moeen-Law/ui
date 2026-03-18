import api from "@/shared/api";
import request from "@/shared/api/request";
import type { ChatResponse, CreateChatResponse, fetchAndUpdateTitleChatResponse } from "../types";
import { chatService } from "../helpers";

export const fetchChats = () => request<ChatResponse>(api.get(`${chatService}/chat?size=40`));

export const createChat = (title: string) => request<CreateChatResponse>(api.post(`${chatService}/chat`, { title }));

export const fetchChat = (id: string) => request<fetchAndUpdateTitleChatResponse>(api.get(`${chatService}/chat/${id}`));

export const updateChatTitle = ({ id, title }: { id: string, title: string }) => request<fetchAndUpdateTitleChatResponse>(api.patch(`${chatService}/chat/${id}`, { title }));

export const deleteChat = (id: string) => request<Promise<void>>(api.delete(`${chatService}/chat/${id}`));

export const fetchMessages = (chatId: string) => request<ChatResponse>(api.get(`${chatService}/messages/${chatId}`));
