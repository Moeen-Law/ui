import { useEffect, useMemo } from "react"
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
import { getChatTitleSchema, type ChatTitleSchemaType } from "../schemas"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation();

  const schema = useMemo(() => getChatTitleSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatTitleSchemaType>({
    resolver: zodResolver(schema),
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
          toast.success(t("chat.ui.updateSuccess"), { style: successToastStyle })
        },
      }
    )
  }

  return (
    <Dialog  open={openAlertModal} onOpenChange={setOpenAlertModal}>
      <DialogContent className="bg-background border border-border rounded-[28px] shadow-2xl p-0 overflow-hidden gap-0 sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 pb-6 flex flex-col items-center text-center">
            <DialogHeader className="items-center gap-4">
              <div className="bg-primary/10 text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.15)] rounded-2xl size-16 mb-2 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <Edit3 className="size-7 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black font-['Cairo']">
                  {t("chat.ui.editTitle")}
                </DialogTitle>
                <DialogDescription className="font-['Cairo'] text-sm leading-relaxed max-w-[260px]">
                  {t("chat.ui.editTitleDesc")}
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          <div className="px-8 pb-8">
            <Field>
              <FieldLabel htmlFor="title" className="font-['Cairo'] mb-2 block text-sm">
                {t("chat.ui.newTitle")}
              </FieldLabel>
              <Input
                id="title"
                {...register("title")}
                className="rounded-xl h-12 transition-all"
                placeholder={t("chat.ui.titlePlaceholder")}
                autoComplete="off"
              />
              <FieldError errors={[errors.title]} className="font-['Cairo'] text-xs mt-1 text-red-400" />
            </Field>
          </div>

          <DialogFooter className="border-t border-border p-6 flex-row gap-3 sm:justify-stretch sm:space-x-0 mx-0 mb-0 rounded-none">
            <DialogClose asChild>
              <Button
                type="button"
                disabled={isPending}
                variant="outline"
                className="flex-1 cursor-pointer font-['Cairo'] rounded-xl transition-all h-12 text-sm font-bold"
              >
                {t("chat.ui.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 cursor-pointer disabled:cursor-not-allowed font-['Cairo'] bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl shadow-[0_0_25px_rgba(var(--primary),0.25)] transition-all h-12 text-sm font-bold active:scale-[0.98]"
            >
              {isPending ? t("chat.ui.saving") : t("chat.ui.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateChatTitleModal