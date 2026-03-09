import z from "zod";



export const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
});


export const signUpSchema = z.object({
    name: z.string().min(2, "يجب أن يكون الاسم حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
    confirmPassword: z.string().min(8, "يجب تأكيد كلمة المرور"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});  