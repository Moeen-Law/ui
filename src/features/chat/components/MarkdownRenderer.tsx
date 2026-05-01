import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memo } from "react";

interface MarkdownRendererProps {
    content: string;
}

const remarkPlugins = [remarkGfm];

function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-lg max-w-none
            dark:prose-invert
            prose-p:my-2 prose-p:leading-relaxed
            prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
            prose-strong:text-foreground prose-strong:font-bold
            prose-ul:my-2 prose-ul:pr-5
            prose-ol:my-2 prose-ol:pr-5
            prose-li:my-0.5
            prose-blockquote:border-r-blue-500 prose-blockquote:border-r-2 prose-blockquote:border-l-0 prose-blockquote:pr-4 prose-blockquote:pl-0 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
            prose-code:text-blue-500 dark:prose-code:text-blue-300 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-table:border-collapse
            prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2
            prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2
            text-right"
            dir="rtl"
        >
            <ReactMarkdown remarkPlugins={remarkPlugins}>
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default memo(MarkdownRenderer);
