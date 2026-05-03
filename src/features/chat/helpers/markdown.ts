const KNOWN_SECTION_LABELS = [
    "📌 الإجابة المختصرة",
    "📖 التفاصيل القانونية",
];

export const normalizeAssistantMarkdown = (content: string) =>
    content
        .replace(/\*\*\s+([^*\n]+?)\s*\*\*/g, "**$1**")
        .split("\n")
        .map((line) => {
            const trimmed = line.trim();

            if (KNOWN_SECTION_LABELS.includes(trimmed)) {
                return `## ${trimmed}`;
            }

            return line;
        })
        .join("\n");

