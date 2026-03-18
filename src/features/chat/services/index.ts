import api from "@/shared/api";
import request from "@/shared/api/request";
import type { ChatResponse, CreateChatResponse, fetchAndUpdateTitleChatResponse } from "../types";
import { chatService } from "../helpers";

export const fetchChats = () => request(api.get<ChatResponse>(`${chatService}/chat`));

export const createChat = (title: string) => request(api.post<CreateChatResponse>(`${chatService}/chat`, { title }));

export const fetchChat = (id: string) => request(api.get<fetchAndUpdateTitleChatResponse>(`${chatService}/chat/${id}`));

export const updateChatTitle = ({ id, title }: { id: string, title: string }) => request(api.patch<fetchAndUpdateTitleChatResponse>(`${chatService}/chat/${id}`, { title }));

export const deleteChat = (id: string) => request(api.delete<void>(`${chatService}/chat/${id}`));
