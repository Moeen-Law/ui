import { memo } from "react";
import { Download, FileText } from "lucide-react";
import type { ChatMessageFile } from "../types";
import { formatFileSize } from "../helpers/files";

export default memo(function MessageFiles({ files }: { files: ChatMessageFile[] }) {
    if (files.length === 0) return null;

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file) => {
                const content = (
                    <>
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 truncate">{file.originalName}</span>
                        {file.size > 0 && <span className="shrink-0 opacity-70">{formatFileSize(file.size)}</span>}
                        {file.downloadUrl && <Download className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                    </>
                );
                const className = "flex max-w-[240px] items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-xs font-semibold";

                return file.downloadUrl ? (
                    <a key={file.fileId} href={file.downloadUrl} target="_blank" rel="noreferrer" className={`${className} transition-colors hover:bg-white/15`}>
                        {content}
                    </a>
                ) : (
                    <div key={file.fileId} className={className}>{content}</div>
                );
            })}
        </div>
    );
});
