import z from "zod";
import type { TFunction } from "i18next";

export const getLoginSchema = (t: TFunction) => z.object({
    email: z.string().email(t("auth.errors.invalidEmail")),
    password: z.string().min(8, t("auth.errors.passwordMin")),
});

export const getSignUpSchema = (t: TFunction) => z.object({
    name: z.string().min(2, t("auth.errors.nameMin")),
    email: z.string().email(t("auth.errors.invalidEmail")),
    password: z.string()
        .min(8, t("auth.errors.passwordMin"))
        .regex(/[A-Z]/, t("auth.errors.upperCase"))
        .regex(/[a-z]/, t("auth.errors.lowerCase"))
        .regex(/[0-9]/, t("auth.errors.number"))
        .regex(/[^A-Za-z0-9]/, t("auth.errors.specialChar")),
    confirmPassword: z.string().min(8, t("auth.errors.passwordMin")),
}).refine((data) => data.password === data.confirmPassword, {
    message: t("auth.errors.passwordMismatch"),
    path: ["confirmPassword"],
});

export const getForgotPasswordSchema = (t: TFunction) => z.object({
    email: z.string().email(t("auth.errors.invalidEmail")),
});

export const getResetPasswordSchema = (t: TFunction) => z.object({
    password: z.string()
        .min(8, t("auth.errors.passwordMin"))
        .regex(/[A-Z]/, t("auth.errors.upperCase"))
        .regex(/[a-z]/, t("auth.errors.lowerCase"))
        .regex(/[0-9]/, t("auth.errors.number"))
        .regex(/[^A-Za-z0-9]/, t("auth.errors.specialChar")),
    confirmPassword: z.string().min(8, t("auth.errors.passwordMin")),
}).refine((data) => data.password === data.confirmPassword, {
    message: t("auth.errors.passwordMismatch"),
    path: ["confirmPassword"],
});

// For type inference
const dummyT = (() => "") as any;
export const loginSchema = getLoginSchema(dummyT);
export const signUpSchema = getSignUpSchema(dummyT);
export const forgotPasswordSchema = getForgotPasswordSchema(dummyT);
export const resetPasswordSchema = getResetPasswordSchema(dummyT);