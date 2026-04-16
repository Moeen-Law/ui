import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../components/AuthLayout";
import { getResetPasswordSchema } from "../schema";
import type { ResetPasswordValues } from "../types";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import ResetPasswordVerifying from "../components/ResetPasswordVerifying";
import ResetPasswordError from "../components/ResetPasswordError";
import ResetPasswordSuccess from "../components/ResetPasswordSuccess";
import { useResetPassword } from "../hooks/useResetPassword";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {  
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {isError , isSuccess , isVerifying , resetPassword } = useResetPassword();

    const title = isVerifying ? t("auth.verifying") : isError ? t("auth.linkInvalid") : isSuccess ? t("auth.verificationSuccess") : t("auth.resetPasswordTitle");
    const subtitle = isVerifying ? t("auth.wait") : isError ? t("auth.linkInvalidSub") : isSuccess ? t("auth.passwordChangedSub") : t("auth.resetPasswordSubtitle");

    const schema = useMemo(() => getResetPasswordSchema(t), [t]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(schema),
    });
   
    const onSubmit = async (data: ResetPasswordValues) => { 
        await resetPassword(data);
    };

    return (
        <AuthLayout
            title={title}
            subtitle={subtitle}
        > 
            {isVerifying ? <ResetPasswordVerifying /> :  isSuccess ? <ResetPasswordSuccess /> : isError ? <ResetPasswordError /> : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ms-1">{t("auth.password")}</label>
                    <div className="relative group">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="w-full placeholder:opacity-60 bg-muted border border-border rounded-xl px-4 py-3 ps-11 pe-11 text-foreground focus:outline-none focus:border-blue-500 transition-all font-sans"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                        <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute end-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title={showPassword ? t("auth.hide") : t("auth.show")}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 ms-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ms-1">{t("auth.confirmPassword")}</label>
                    <div className="relative group">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full placeholder:opacity-60 bg-muted border border-border rounded-xl px-4 py-3 ps-11 pe-11 text-foreground focus:outline-none focus:border-blue-500 transition-all font-sans"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                        <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute end-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title={showConfirmPassword ? t("auth.hide") : t("auth.show")}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ms-1">{errors.confirmPassword.message}</p>}
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full cursor-pointer disabled:cursor-not-allowed bg-blue-500 text-white font-black rounded-xl py-4 mt-2 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        t("auth.resetPassword")
                    )}
                </motion.button>
            </form>
            )}
        </AuthLayout>
    );
}
