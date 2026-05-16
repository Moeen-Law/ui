import i18n from "@/lib/i18n";

export function getSessionValue(value: string | undefined, fallback: string) {
    if (!value || value.trim() === "") {
        return fallback;
    }

    return value;
}

export function formatLoginDate(value: Date | string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat(i18n.language.startsWith("ar") ? "ar-EG" : "en-EG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}
