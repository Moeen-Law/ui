export const formatGovernmentProcessDate = (date: Date | string) =>
    new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));



export function parseSourceUrl(url?: string) {
    const trimmedUrl = url?.trim();

    if (!trimmedUrl) {
        return null;
    }

    const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    try {
        const parsedUrl = new URL(normalizedUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return null;
        }

        return {
            href: parsedUrl.href,
            hostname: parsedUrl.hostname.replace(/^www\./i, ""),
        };
    } catch {
        return null;
    }
}