import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatDesktopHeader from "../components/ChatDesktopHeader";
import { useChatStream } from "../hooks/useChatStream";
import { createChat } from "../services";
import { toast } from "sonner";
import type { StreamStatus, ChatResponse } from "../types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

export default function Chat() {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [inputValue, setInputValue] = useState("");
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);

    // Stream hook — active only when we have a chatId
    const {
        messages: streamMessages,
        status: streamStatus,
        isLoading,
        sendMessage,
        stopStreaming,
    } = useChatStream({ chatId });

    // ─── Handle sending a message ──────────────────────────────────────
    const handleSendMessage = useCallback(async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        // Clear input immediately for responsive feel
        setInputValue("");

        // If there's no chatId, we need to create a chat first
        if (!chatId) {
            setPendingUserMessage(trimmedInput);
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

                // Start streaming IMMEDIATELY for the new chat
                // We clear our temporary local optimistic state FIRST, then start the stream 
                // which will handle its own optimistic message management.
                setIsCreatingChat(false);
                setPendingUserMessage(null);

                await sendMessage(trimmedInput, newChat.id);

                // Navigate to the new chat URL
                navigate(`/chat/${newChat.id}`, { replace: true });
            } catch (error: any) {
                console.error("Failed to create chat:", error);
                const errorMsg = error?.message || error?.error || "حدث خطأ غير متوقع أثناء إنشاء المحادثة. المرجو المحاولة مجدداً.";
                toast.error(errorMsg);
                setInputValue(trimmedInput);
                // Only clear if there was an error, since we cleared earlier on success
                setIsCreatingChat(false);
                setPendingUserMessage(null);
            } finally {
                queryClient.invalidateQueries({ queryKey: ["chats"] });
            }
            return;
        }

        // If we already have a chatId, stream directly
        await sendMessage(trimmedInput);
    }, [inputValue, chatId, navigate, sendMessage, queryClient]);

    // ─── Compute overall status and messages ────────────────────────────────────────
    const effectiveStatus: StreamStatus = isCreatingChat ? "creating" : streamStatus;

    // Combine actual stream messages with our optimistic message during creation
    const displayMessages = [...streamMessages];
    if (isCreatingChat && pendingUserMessage) {
        displayMessages.push({
            id: "temp-user",
            content: pendingUserMessage,
            sender: "user"
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
                        messages={displayMessages}
                        isStreaming={effectiveStatus === "streaming" || effectiveStatus === "creating"}
                        isLoading={isLoading}
                    />
                    <ChatInput
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        streamStatus={effectiveStatus}
                        onStopStreaming={stopStreaming}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    );
}
