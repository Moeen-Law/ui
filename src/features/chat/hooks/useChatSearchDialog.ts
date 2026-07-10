import { useCallback, useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useChatSearch } from "./useChatSearch";

export function useChatSearchDialog() {
    const navigate = useNavigate();
    const [, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const query = useChatSearch(useDebounce(search, 300));
    const close = useCallback(() => { setOpen(false); setSearch(""); }, []);
    const selectChat = useCallback((chatId: string) => {
        close();
        startTransition(() => navigate(`/chat/${chatId}`));
    }, [close, navigate]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close, open]);

    return { open, setOpen, search, setSearch, close, selectChat, query };
}
