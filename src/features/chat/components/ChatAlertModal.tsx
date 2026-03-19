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


interface ChatAlertModalProps {
    openAlertModal: boolean;
    setOpenAlertModal: (open: boolean) => void;
    chatIdToDelete: string | null;
}

function ChatAlertModal({ openAlertModal, setOpenAlertModal, chatIdToDelete }: ChatAlertModalProps) {
    const { deleteChat, isPending } = useDeleteChat();
    const { chatId } = useParams();
    const navigate = useNavigate();

    const handleDeleteChat = () => {
        deleteChat(chatIdToDelete!, {
            onSuccess: () => {
                setOpenAlertModal(false);
                toast.success("تم حذف المحادثة بنجاح", { style: successToastStyle });
                if (chatIdToDelete === chatId) {
                    navigate("/chat");
                }
            }
        })
    };

    return (
        <AlertDialog open={openAlertModal} onOpenChange={setOpenAlertModal}>
            <AlertDialogContent size="sm" className="bg-[#0d0d0d] border-white/10 rounded-[28px] shadow-2xl p-0 overflow-hidden gap-0">
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <AlertDialogHeader className="items-center gap-4">
                        <AlertDialogMedia className="bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] rounded-2xl size-16 mb-2 transition-transform hover:scale-105 duration-300">
                            <Trash2Icon className="size-7" />
                        </AlertDialogMedia>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-black font-['Cairo'] text-white">حذف المحادثة؟</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/50 font-['Cairo'] text-sm leading-relaxed max-w-[260px]">
                                هل أنت متأكد من حذف هذه المحادثة؟ سيتم مسح كافة الرسائل ولا يمكن تراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                </div>
                
                <AlertDialogFooter className="bg-white/[0.02] border-t border-white/5 p-6 flex-row gap-3 sm:justify-stretch sm:space-x-0 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 mx-0 mb-0 rounded-none">
                    <AlertDialogCancel
                        disabled={isPending}
                        className="cursor-pointer font-['Cairo'] bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl transition-all h-12 text-sm font-bold"
                    >
                        إلغاء
                    </AlertDialogCancel>
                    <Button
                        disabled={isPending}
                        onClick={handleDeleteChat}
                        className="cursor-pointer disabled:cursor-not-allowed font-['Cairo'] bg-red-500 hover:bg-red-600 text-white border-none rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all h-12 text-sm font-bold active:scale-[0.98]"
                    >
                        {isPending ? "جاري الحذف..." : "حذف المحادثة"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ChatAlertModal