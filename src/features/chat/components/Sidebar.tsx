import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside className="hidden md:flex flex-col w-[300px] bg-[#111111] border-l border-[#2a2a2a] p-5">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer text-[#a0a0a0] hover:text-white transition-colors mb-8 group self-start"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm">العودة للرئيسية</span>
            </button>

            <button className="flex items-center cursor-pointer justify-center gap-2 w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg py-3 px-4 font-bold text-sm transition-all hover:bg-[#252525] hover:border-white mb-8">
                <Plus className="w-4 h-4" />
                <span>محادثة جديدة</span>
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="text-[#707070] text-xs font-bold uppercase tracking-wider mb-4">المحادثات السابقة</h3>
                <div className="space-y-2 text-[#a0a0a0] text-sm italic">
                    لا توجد محادثات سابقة بعد.
                </div>
            </div>

            <div className="mt-auto pt-5 border-t border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-[#0a0a0a] font-bold text-lg">
                        م
                    </div>
                    <span className="font-bold text-[0.95rem]">مستخدم</span>
                </div>
            </div>
        </aside>
    );
}
