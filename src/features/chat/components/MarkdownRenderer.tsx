import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-invert prose-lg max-w-none
            prose-p:my-2 prose-p:leading-relaxed
            prose-headings:text-white prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
            prose-strong:text-white prose-strong:font-bold
            prose-ul:my-2 prose-ul:pr-5
            prose-ol:my-2 prose-ol:pr-5
            prose-li:my-0.5
            prose-blockquote:border-r-blue-500 prose-blockquote:border-r-2 prose-blockquote:border-l-0 prose-blockquote:pr-4 prose-blockquote:pl-0 prose-blockquote:text-[#a0a0a0] prose-blockquote:not-italic
            prose-code:text-blue-300 prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#111122] prose-pre:border prose-pre:border-[#2a2a3a] prose-pre:rounded-xl
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-table:border-collapse
            prose-th:border prose-th:border-[#333] prose-th:px-3 prose-th:py-2
            prose-td:border prose-td:border-[#333] prose-td:px-3 prose-td:py-2
            text-right"
            dir="rtl"
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
