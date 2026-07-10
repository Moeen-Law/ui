import i18n from "@/lib/i18n";
import type { FilesStreamEvent, LawSource } from "../types";
import { StreamConnectionError } from "./types";

export const getStreamResponseError = async (response: Response) => {
    const responseText = await response.text();
    let message = responseText || i18n.t("toast.connectionError");
    try {
        const parsed = JSON.parse(responseText) as { message?: unknown };
        if (typeof parsed.message === "string") message = parsed.message;
    } catch {
        // Plain-text backend errors are already useful.
    }
    return new StreamConnectionError(message);
};

export const parseSourcesEvent = (data: string): LawSource[] | null => {
    try { return JSON.parse(data) as LawSource[]; }
    catch { return null; }
};

export const parseFilesEvent = (data: string): FilesStreamEvent | null => {
    try { return JSON.parse(data) as FilesStreamEvent; }
    catch { return null; }
};

export const toStreamErrorMessage = (error: unknown) => error instanceof Error
    ? error.message
    : typeof error === "string" ? error : i18n.t("toast.connectionError");
