import { useEffect, useRef, type ChangeEvent } from "react";
import { Paperclip, Send, ShieldCheck, Square } from "lucide-react";
import type { StreamStatus } from "../types";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import ChatInputAttachments from "./ChatInputAttachments";

export interface ChatInputFile {
    id: string;
    file: File;
    status: "selected" | "uploading" | "error";
    error?: string;
}

interface ChatInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
    streamStatus: StreamStatus;
    onStopStreaming: () => void;
    selectedFiles: ChatInputFile[];
    onSelectFiles: (files: File[]) => void;
    onRemoveFile: (id: string) => void;
    isUploadingFiles?: boolean;
    isLoading?: boolean;
    isQuotaExhausted?: boolean;
    quotaNotice?: ReactNode;
}

export default function ChatInput({
    inputValue,
    setInputValue,
    handleSendMessage,
    streamStatus,
    onStopStreaming,
    selectedFiles,
    onSelectFiles,
    onRemoveFile,
    isUploadingFiles,
    isLoading,
    isQuotaExhausted,
    quotaNotice,
}: ChatInputProps) {
    const { t } = useTranslation();
    const isProcessing = streamStatus === "streaming" || streamStatus === "creating" || isLoading || isUploadingFiles;
    const canSend = inputValue.trim().length > 0 && !isProcessing && !isQuotaExhausted;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length > 0) {
            onSelectFiles(files);
        }
        event.target.value = "";
    };

    // Reset height when input is cleared
    useEffect(() => {
        if (inputValue === "" && textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, [inputValue]);


    return (
        <div className="absolute inset-x-0 bottom-0 w-full bg-linear-to-t from-background via-background/90 to-transparent pt-10 pb-4 md:pb-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto relative">
                {quotaNotice ? <div className="mb-3">{quotaNotice}</div> : null}
                <div className="relative bg-card border border-border rounded-2xl p-2 focus-within:border-blue-500/50 transition-all shadow-2xl backdrop-blur-sm">
                    <ChatInputAttachments files={selectedFiles} disabled={!!isProcessing} onRemove={onRemoveFile} />
                    <div className="flex items-end gap-2 px-2 py-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileInputChange}
                            disabled={isProcessing}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing || isQuotaExhausted}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-40"
                            title={t("chat.ui.attachFiles", { defaultValue: "Attach files" })}
                        >
                            <Paperclip className="w-5 h-5 mb-1 cursor-pointer" />
                        </button>
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (canSend) {
                                        handleSendMessage();
                                    }
                                }
                            }}
                            placeholder={t("chat.ui.inputPlaceholder")}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            disabled={isProcessing}
                            className="w-full bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder-muted-foreground text-[1.1rem] py-2 resize-none max-h-[200px] min-h-[44px] custom-scrollbar disabled:opacity-50"
                            rows={1}
                        />
                        {(streamStatus === "streaming" || streamStatus === "creating") ? (
                            <button
                                type="button"
                                onClick={onStopStreaming}
                                className="p-3 bg-red-500/80 text-white rounded-xl hover:bg-red-500 transition-all shrink-0 cursor-pointer shadow-lg shadow-red-500/20"
                                title={t("chat.ui.stopGeneration")}
                            >
                                <Square className="w-5 h-5 fill-current" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!canSend}
                                title={isQuotaExhausted ? t("quota.exhausted.chat") : undefined}
                                className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-lg shadow-blue-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-center text-muted-foreground text-[10px] md:text-xs mt-3 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t("chat.ui.disclaimer")}</span>
                </p>
            </div>
        </div>
    );
}
