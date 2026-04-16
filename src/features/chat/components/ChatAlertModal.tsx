import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { useDeleteChat } from "../hooks/useDeleteChat";
import { toast } from "sonner";
import { successToastStyle } from "@/shared/constants";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


interface ChatAlertModalProps {
    openAlertModal: boolean;
    setOpenAlertModal: (open: boolean) => void;
    chatIdToDelete: string | null;
}

function ChatAlertModal({ openAlertModal, setOpenAlertModal, chatIdToDelete }: ChatAlertModalProps) {
    const { t } = useTranslation();
    const { deleteChat, isPending } = useDeleteChat();
    const { chatId } = useParams();
    const navigate = useNavigate();

    const handleDeleteChat = () => {
        deleteChat(chatIdToDelete!, {
            onSuccess: () => {
                setOpenAlertModal(false);
                toast.success(t("chat.ui.deleteSuccess"), { style: successToastStyle });
                if (chatIdToDelete === chatId) {
                    navigate("/chat");
                }
            }
        })
    };

    return (
        <AlertDialog open={openAlertModal} onOpenChange={setOpenAlertModal}>
            <AlertDialogContent size="sm" className="bg-background border border-border rounded-[28px] shadow-2xl p-0 overflow-hidden gap-0">
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <AlertDialogHeader className="items-center gap-4">
                        <AlertDialogMedia className="bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] rounded-2xl size-16 mb-2 transition-transform hover:scale-105 duration-300">
                            <Trash2Icon className="size-7" />
                        </AlertDialogMedia>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-black font-['Cairo']">{t("chat.ui.deleteWarningTitle")}</AlertDialogTitle>
                            <AlertDialogDescription className="font-['Cairo'] text-sm leading-relaxed max-w-[260px]">
                                {t("chat.ui.deleteWarningDesc")}
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                </div>

                <AlertDialogFooter className="bg-muted/50 border-t border-border p-6 flex-row gap-3 sm:justify-stretch sm:space-x-0 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 mx-0 mb-0 rounded-none">
                    <AlertDialogCancel
                        disabled={isPending}
                        className="cursor-pointer font-['Cairo'] rounded-xl transition-all h-12 text-sm font-bold"
                    >
                        {t("chat.ui.cancel")}
                    </AlertDialogCancel>
                    <Button
                        disabled={isPending}
                        onClick={handleDeleteChat}
                        className="cursor-pointer disabled:cursor-not-allowed font-['Cairo'] bg-red-500 hover:bg-red-600 text-white border-none rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all h-12 text-sm font-bold active:scale-[0.98]"
                    >
                        {isPending ? t("chat.ui.deleting") : t("chat.ui.deleteConfirmBtn")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ChatAlertModal