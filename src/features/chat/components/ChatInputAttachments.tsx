import { AlertCircle, FileText, LoaderCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatFileSize } from "../helpers/files";
import type { ChatInputFile } from "./ChatInput";

interface Props {
    files: ChatInputFile[];
    disabled: boolean;
    onRemove: (id: string) => void;
}

export default function ChatInputAttachments({ files, disabled, onRemove }: Props) {
    const { t } = useTranslation();
    if (files.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 border-b border-border/60 px-2 pb-2 mb-1">
            {files.map((item) => (
                <div key={item.id} className={`flex max-w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-xs ${item.status === "error" ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-blue-500/20 bg-blue-500/10 text-foreground"}`}>
                    {item.status === "uploading" ? <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-400" /> : item.status === "error" ? <AlertCircle className="h-4 w-4 shrink-0 text-red-300" /> : <FileText className="h-4 w-4 shrink-0 text-blue-400" />}
                    <span className="min-w-0 max-w-[180px] truncate font-semibold">{item.file.name}</span>
                    <span className="shrink-0 text-muted-foreground">{formatFileSize(item.file.size)}</span>
                    <button type="button" onClick={() => onRemove(item.id)} disabled={disabled} className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40" title={t("chat.ui.removeFile", { defaultValue: "Remove file" })}>
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
