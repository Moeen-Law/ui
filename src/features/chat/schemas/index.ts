import z from "zod";
import type { TFunction } from "i18next";

export const getChatTitleSchema = (t: TFunction) => z.object({
    title: z.string()
        .min(2, { message: t("chat.validation.titleMin") })
        .max(100, { message: t("chat.validation.titleMax") }),
});

// For type inference only
const dummyT = (() => "") as any;
export const ChatTitleSchema = getChatTitleSchema(dummyT);

export type ChatTitleSchemaType = z.infer<typeof ChatTitleSchema>;
