import { z } from "zod";

export const ChatTitleSchema = z.object({
  title: z
    .string()
    .min(2, { message: "عنوان المحادثة مطلوب" })
    .max(100, { message: "عنوان المحادثة طويل جداً" }),
});

export type ChatTitleSchemaType = z.infer<typeof ChatTitleSchema>;
