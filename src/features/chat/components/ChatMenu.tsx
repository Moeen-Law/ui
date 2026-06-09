import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ChatResponseDatum } from '../types';
import { useTranslation } from 'react-i18next';

interface ChatMenuProps {
    setOpenAlertModal: (open: boolean) => void;
    setSelectedId: (chatId: string) => void;
    setOpenUpdateChatTitleModal: (open: boolean) => void;
    setSelectedChat: (chat: ChatResponseDatum) => void;
    chat: ChatResponseDatum;
}

function ChatMenu({ setOpenAlertModal, setSelectedId, setOpenUpdateChatTitleModal, setSelectedChat, chat }: ChatMenuProps) {
    const { t } = useTranslation();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border border-border min-w-[160px] p-1.5 rounded-xl shadow-2xl">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenUpdateChatTitleModal(true);
                        setSelectedChat(chat);
                    }}
                    className="flex items-center gap-2 font-sans text-xs p-2 rounded-lg cursor-pointer hover:bg-muted"
                >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t("chat.ui.editTitle")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenAlertModal(true);
                        setSelectedId(chat.id); 
                    }}
                    variant="destructive"
                    className="flex items-center gap-2 font-sans text-xs p-2 rounded-lg cursor-pointer text-red-400 hover:text-red-400 hover:bg-red-400/10"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t("chat.ui.deleteChat")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ChatMenu