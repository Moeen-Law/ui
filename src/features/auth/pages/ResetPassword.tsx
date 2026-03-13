import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resetPasswordSchema } from "../schema";
import type { ResetPasswordValues } from "../types";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import ResetPasswordVerifying from "../components/ResetPasswordVerifying";
import ResetPasswordError from "../components/ResetPasswordError";
import ResetPasswordSuccess from "../components/ResetPasswordSuccess";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    
    const title = isVerifying ? "جاري التحقق من الرابط..." : isError ? "الرابط غير صالح" : isSuccess ? "تم بنجاح" : "تعيين كلمة مرور جديدة";
    const subtitle = isVerifying ? "يرجى الانتظار" : isError ? "يرجى التحقق من الرابط" : isSuccess ? "تم تغيير كلمة المرور بنجاح" : "يرجى إدخال كلمة المرور الجديدة وتأكيدها";

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        // Simulate token verification
        const verifyToken = async () => {
            setIsVerifying(true);
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (!token || token === "invalid") {
                setIsError(true);
            }
            setIsVerifying(false);
        };

        verifyToken();
    }, [token]);

    const onSubmit = async (data: ResetPasswordValues) => {
        console.log("Resetting with token:", token, data);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
    };


    return (
        <AuthLayout
            title={title}
            subtitle={subtitle}
        >
            {
                isVerifying ? (
                    <ResetPasswordVerifying />
                ) : isError ? (
                    <ResetPasswordError />
                ) : isSuccess ? (
                    <ResetPasswordSuccess />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">كلمة المرور الجديدة</label>
                            <div className="relative group">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className="w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 pl-11 pr-11 text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                                    placeholder="••••••••"
                                    dir="ltr"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707070] group-focus-within:text-blue-500 transition-colors" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-4 text-[#707070] hover:text-white transition-colors cursor-pointer"
                                    title={showPassword ? "إخفاء" : "إظهار"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 mr-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">تأكيد كلمة المرور</label>
                            <div className="relative group">
                                <input
                                    {...register("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 pl-11 pr-11 text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                                    placeholder="••••••••"
                                    dir="ltr"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707070] group-focus-within:text-blue-500 transition-colors" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute left-4 top-4 text-[#707070] hover:text-white transition-colors cursor-pointer"
                                    title={showConfirmPassword ? "إخفاء" : "إظهار"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 mr-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full cursor-pointer disabled:cursor-not-allowed bg-white text-[#0a0a0a] font-black rounded-xl py-4 mt-2 hover:bg-[#e0e0e0] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin" />
                            ) : (
                                "تغيير كلمة المرور"
                            )}
                        </motion.button>
                    </form>
                )
            }
        </AuthLayout>
    );
}
