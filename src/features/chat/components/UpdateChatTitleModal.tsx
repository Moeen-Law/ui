"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit3 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { successToastStyle } from "@/shared/constants"

import type { ChatResponseDatum } from "../types"
import { useUpdateChat } from "../hooks/useUpdateChat"
import { ChatTitleSchema, type ChatTitleSchemaType } from "../schemas"

interface UpdateChatTitleModalProps {
  openAlertModal: boolean
  setOpenAlertModal: (open: boolean) => void
  selectedChat: ChatResponseDatum | null
}

function UpdateChatTitleModal({
  openAlertModal,
  setOpenAlertModal,
  selectedChat,
}: UpdateChatTitleModalProps) {
  const { updateChat, isPending } = useUpdateChat()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatTitleSchemaType>({
    resolver: zodResolver(ChatTitleSchema),
    defaultValues: {
      title: selectedChat?.title || "",
    },
  })

  
  useEffect(() => {
    if (selectedChat) {
      reset({ title: selectedChat.title })
    }
  }, [selectedChat, reset])

  const onSubmit = (data: ChatTitleSchemaType) => {
    if (!selectedChat) return

    updateChat(
      { id: selectedChat.id, title: data.title },
      {
        onSuccess: () => {
          setOpenAlertModal(false)
          toast.success("تم تحديث اسم المحادثة بنجاح", { style: successToastStyle })
        },
      }
    )
  }

  return (
    <Dialog  open={openAlertModal} onOpenChange={setOpenAlertModal}>
      <DialogContent  className="bg-[#0d0d0d] border-white/10 rounded-[28px] shadow-2xl p-0 overflow-hidden gap-0 sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 pb-6 flex flex-col items-center text-center">
            <DialogHeader className="items-center gap-4">
              <div className="bg-primary/10 text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.15)] rounded-2xl size-16 mb-2 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <Edit3 className="size-7  text-gray-500" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black font-['Cairo'] text-white">
                  تعديل العنوان
                </DialogTitle>
                <DialogDescription className="text-white/50 font-['Cairo'] text-sm leading-relaxed max-w-[260px]">
                  قم بتغيير عنوان المحادثة لسهولة الوصول إليها لاحقاً.
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          <div className="px-8 pb-8">
            <Field>
              <FieldLabel htmlFor="title" className="text-white/70 font-['Cairo'] mb-2 block text-sm">
                العنوان الجديد
              </FieldLabel>
              <Input
                id="title"
                {...register("title")}
                className="bg-white/5 border-white/10 text-white font-['Cairo'] rounded-xl h-12 focus:border-primary/50 focus:ring-primary/20 transition-all"
                placeholder="أدخل عنوان المحادثة..."
                autoComplete="off"
              />
              <FieldError errors={[errors.title]} className="font-['Cairo'] text-xs mt-1 text-red-400" />
            </Field>
          </div>

          <DialogFooter className="bg-white/2 border-t border-white/5 p-6 flex-row gap-3 sm:justify-stretch sm:space-x-0 mx-0 mb-0 rounded-none">
            <DialogClose asChild>
              <Button
                type="button"
                disabled={isPending}
                variant="outline"
                className="flex-1 cursor-pointer font-['Cairo'] bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl transition-all h-12 text-sm font-bold"
              >
                إلغاء
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 cursor-pointer disabled:cursor-not-allowed font-['Cairo'] bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl shadow-[0_0_25px_rgba(var(--primary),0.25)] transition-all h-12 text-sm font-bold active:scale-[0.98]"
            >
              {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateChatTitleModal