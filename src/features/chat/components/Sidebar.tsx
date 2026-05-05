import { useChatUIStore } from "../store/ui";
import { cn } from "@/lib/utils";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
    const { isSidebarOpen } = useChatUIStore();

    return (
        <aside className={cn(
            "hidden md:flex flex-col w-[300px] bg-background border-e border-border relative overflow-hidden transition-all duration-300 ease-in-out",
            !isSidebarOpen && "md:w-0 md:border-none"
        )}>
            <div className={cn(
                "h-full w-[300px] p-5 transition-all duration-300 ease-in-out",
                !isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <SidebarContent />
            </div>
        </aside>
    );
}
