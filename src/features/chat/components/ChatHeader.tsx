import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import HistoryDrawer from "./HistoryDrawer";

export default function ChatHeader() {
    const navigate = useNavigate();

    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background z-10">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 hover:text-foreground cursor-pointer text-muted-foreground font-semibold text-sm"
            >
                <ChevronLeft className="w-5 h-5" />
                <span>الرئيسية</span>
            </button>

            <HistoryDrawer />
        </div>
    );
}
