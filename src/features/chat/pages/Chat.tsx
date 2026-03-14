import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages, { type Message } from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { useChats } from "../hooks/useChats";

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: "user"
        };

        setMessages([...messages, newUserMessage]);
        setInputValue("");

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                text: "أنا مساعدك القانوني الذكي. كيف يمكنني مساعدتك اليوم؟",
                sender: "ai"
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const { chats } = useChats();
    console.log(chats);
   

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white font-['Cairo'] overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col relative w-full">
                <ChatHeader />
                <ChatMessages messages={messages} />
                <ChatInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSendMessage={handleSendMessage}
                />
            </main>
        </div>
    );
}
