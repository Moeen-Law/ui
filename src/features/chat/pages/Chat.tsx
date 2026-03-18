import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatDesktopHeader from "../components/ChatDesktopHeader";
import { useChatStream } from "../hooks/useChatStream";
import { createChat, fetchChat } from "../services";
import { toast } from "sonner";
import type { StreamMessage, StreamStatus, ChatResponse } from "../types";
import { useQueryClient } from "@tanstack/react-query";

export default function Chat() {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const [inputValue, setInputValue] = useState("");
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);

    // Stream hook — active only when we have a chatId
    const {
        messages: streamMessages,
        setMessages,
        status: streamStatus,
        sendMessage,
        stopStreaming,
    } = useChatStream({ chatId });

    // ─── Pending message from routing state ──
    const pendingMessage = location.state?.pendingMessage as string | undefined;

    // ─── Load existing messages when navigating to an existing chat ────
    useEffect(() => {
        if (!chatId) {
            // New chat — reset messages
            setMessages([]);
            return;
        }

        // If we just created this chat, we have a pending message that will be 
        // sent immediately. Skip fetching history because the chat is empty on 
        // the server, and a fetch would overwrite our brand new streaming messages!
        if (pendingMessage) {
            return;
        }

        // Fetch messages from the server for the selected chat
        const loadExistingMessages = async () => {
            try {
                const chatData = await fetchChat(chatId);
                if (chatData?.messages && chatData.messages.length > 0) {
                    const typedMessages = chatData.messages as Array<{ id: string; content: string; sender: "user" | "ai" }>;
                    const existingMessages: StreamMessage[] = typedMessages.map(
                        (msg) => ({
                            id: msg.id,
                            content: msg.content,
                            sender: msg.sender,
                            isStreaming: false,
                        })
                    );
                    setMessages(existingMessages);
                } else {
                    setMessages([]);
                }
            } catch {
                // On error, show empty state
                setMessages([]);
            }
        };

        loadExistingMessages();
    }, [chatId, setMessages, pendingMessage]);

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
                queryClient.setQueryData<ChatResponse>(["chats"], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        data: [{ ...newChat, messages: [] }, ...old.data],
                    };
                });

                // Navigate to the new chat URL with the message in state
                // This ensures the pending message survives the component unmount/remount
                navigate(`/chat/${newChat.id}`, {
                    replace: true,
                    state: { pendingMessage: trimmedInput }
                });
            } catch (error: any) {
                console.error("Failed to create chat:", error);
                // Extract the backend's message, fallback to generic if undefined
                const errorMsg = error?.message || error?.error || "حدث خطأ غير متوقع أثناء إنشاء المحادثة. المرجو المحاولة مجدداً.";
                toast.error(errorMsg);
                // Put the text back so user doesn't lose it
                setInputValue(trimmedInput);
            } finally {
                setIsCreatingChat(false);
                setPendingUserMessage(null);
                
                // 🔥 Invalidate chats list so sidebar refreshes, EVEN IF there was an error.
                // (If the server crashed but still inserted the chat into the DB, this will make it appear)
                queryClient.invalidateQueries({ queryKey: ["chats"] });
            }
            return;
        }

        // If we already have a chatId, stream directly
        await sendMessage(trimmedInput);
    }, [inputValue, chatId, navigate, sendMessage, queryClient]);

    // We check router state on mount. If there's a pending message, fire it.
    useEffect(() => {
        if (chatId && pendingMessage) {
            sendMessage(pendingMessage);
            // Clear the state so it doesn't refire if the component re-renders
            navigate(`/chat/${chatId}`, { replace: true, state: {} });
        }
    }, [chatId, pendingMessage, navigate, sendMessage]);

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
        <div className="flex h-dvh bg-[#0a0a0a] text-white font-['Cairo'] overflow-hidden">
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
                    />
                    <ChatInput
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        streamStatus={effectiveStatus}
                        onStopStreaming={stopStreaming}
                    />
                </div>
            </main>
        </div>
    );
}
