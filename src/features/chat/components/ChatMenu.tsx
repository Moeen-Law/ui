import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';


function ChatMenu({ chatId }: { chatId: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/10 text-[#a0a0a0] hover:text-white transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white min-w-[160px] p-1.5 rounded-xl shadow-2xl">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("edit", chatId);
                    }}
                    className="flex items-center gap-2 font-['Cairo'] text-xs p-2 rounded-lg cursor-pointer hover:bg-white/5"
                >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل العنوان</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("delete", chatId);
                    }}
                    className="flex items-center gap-2 font-['Cairo'] text-xs p-2 rounded-lg cursor-pointer text-red-400 hover:text-red-400 hover:bg-red-400/10"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف المحادثة</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ChatMenu