import { useParams } from "react-router-dom";
import ChatDesktopHeader from "../components/ChatDesktopHeader";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import DailyQuotaBadge from "../components/DailyQuotaBadge";
import QuotaNotice from "../components/QuotaNotice";
import Sidebar from "../components/Sidebar";
import { useChatComposer } from "../hooks/useChatComposer";
import { useChatStream } from "../hooks/useChatStream";
import { getFeatureQuota, isQuotaExhausted, isQuotaLow, useDailyQuota } from "../hooks/useDailyQuota";

export default function Chat() {
    const { chatId } = useParams<{ chatId: string }>();
    const { quota: dailyQuota, isLoading: isQuotaLoading, isError: isQuotaError } = useDailyQuota();
    const chatQuota = getFeatureQuota(dailyQuota, "chat");
    const quotaExhausted = isQuotaExhausted(chatQuota);
    const showQuotaNotice = isQuotaLow(chatQuota) || quotaExhausted;
    const stream = useChatStream({ chatId });
    const composer = useChatComposer({
        chatId,
        quotaExhausted,
        streamMessages: stream.messages,
        streamStatus: stream.status,
        sendMessage: stream.sendMessage,
    });
    const quotaStatus = <DailyQuotaBadge quota={chatQuota} isLoading={isQuotaLoading} isError={isQuotaError} />;

    return (
        <div className="flex h-dvh bg-background text-foreground font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                <ChatDesktopHeader quotaStatus={quotaStatus} />
                <ChatHeader quotaStatus={quotaStatus} />
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <ChatMessages
                        chatId={chatId}
                        messages={composer.messages}
                        isStreaming={composer.status === "streaming" || composer.status === "creating"}
                        isLoading={stream.isLoading}
                        hasOlderMessages={stream.hasOlderMessages}
                        isFetchingOlderMessages={stream.isFetchingOlderMessages}
                        fetchOlderMessages={stream.fetchOlderMessages}
                    />
                    <ChatInput
                        inputValue={composer.inputValue}
                        setInputValue={composer.setInputValue}
                        handleSendMessage={composer.submit}
                        streamStatus={composer.status}
                        onStopStreaming={stream.stopStreaming}
                        selectedFiles={composer.selectedFiles}
                        onSelectFiles={composer.selectFiles}
                        onRemoveFile={composer.removeFile}
                        isUploadingFiles={composer.isUploadingFiles}
                        isLoading={stream.isLoading}
                        isQuotaExhausted={quotaExhausted}
                        quotaNotice={showQuotaNotice ? <QuotaNotice quota={chatQuota} kind="chat" /> : null}
                    />
                </div>
            </main>
        </div>
    );
}
