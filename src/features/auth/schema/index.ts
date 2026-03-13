import z from "zod";



export const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
});


export const signUpSchema = z.object({
    name: z.string().min(2, "يجب أن يكون الاسم حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string()
        .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
        .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
        .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
        .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
        .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل"),
    confirmPassword: z.string().min(8, "يجب تأكيد كلمة المرور"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صالح"),
});

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
        .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
        .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
        .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
        .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل"),
    confirmPassword: z.string().min(8, "يجب تأكيد كلمة المرور"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});