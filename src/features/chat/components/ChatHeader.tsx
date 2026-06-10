import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import HistoryDrawer from "./HistoryDrawer";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

interface ChatHeaderProps {
    quotaStatus?: ReactNode;
}

export default function ChatHeader({ quotaStatus }: ChatHeaderProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background z-10">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 hover:text-foreground cursor-pointer text-muted-foreground font-semibold text-sm"
            >
                <ChevronLeft className="w-5 h-5" />
                <span>{t("chat.ui.home")}</span>
            </button>

            <div className="flex min-w-0 items-center gap-2">
                {quotaStatus ? <div className="max-w-[52vw]">{quotaStatus}</div> : null}
                <HistoryDrawer />
            </div>
        </div>
    );
}
