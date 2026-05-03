import { useEffect, useRef, type ChangeEvent } from "react";
import { AlertCircle, FileText, LoaderCircle, Paperclip, Send, ShieldCheck, Square, X } from "lucide-react";
import type { StreamStatus } from "../types";
import { useTranslation } from "react-i18next";

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
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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
}: ChatInputProps) {
    const { t } = useTranslation();
    const isProcessing = streamStatus === "streaming" || streamStatus === "creating" || isLoading || isUploadingFiles;
    const canSend = inputValue.trim().length > 0 && !isProcessing;
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
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-background via-background/90 to-transparent pt-10 pb-4 md:pb-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto relative">
                <div className="relative bg-card border border-border rounded-2xl p-2 focus-within:border-blue-500/50 transition-all shadow-2xl backdrop-blur-sm">
                    {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-b border-border/60 px-2 pb-2 mb-1">
                            {selectedFiles.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex max-w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-xs ${
                                        item.status === "error"
                                            ? "border-red-500/30 bg-red-500/10 text-red-200"
                                            : "border-blue-500/20 bg-blue-500/10 text-foreground"
                                    }`}
                                >
                                    {item.status === "uploading" ? (
                                        <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-400" />
                                    ) : item.status === "error" ? (
                                        <AlertCircle className="h-4 w-4 shrink-0 text-red-300" />
                                    ) : (
                                        <FileText className="h-4 w-4 shrink-0 text-blue-400" />
                                    )}
                                    <span className="min-w-0 max-w-[180px] truncate font-semibold">
                                        {item.file.name}
                                    </span>
                                    <span className="shrink-0 text-muted-foreground">
                                        {formatFileSize(item.file.size)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveFile(item.id)}
                                        disabled={isProcessing}
                                        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                                        title={t("chat.ui.removeFile", { defaultValue: "Remove file" })}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
                            disabled={isProcessing}
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
