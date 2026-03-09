import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { forgotPasswordSchema } from "../schema";
import type { ForgotPasswordValues } from "../types";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        // Simulate API call
        console.log(data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    };

    return (
        <AuthLayout
            title="نسيت كلمة المرور؟"
            subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">البريد الإلكتروني</label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            className="w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 pr-11 text-white focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="m@example.com"
                            dir="ltr"
                        />
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707070]" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 mr-1">{errors.email.message}</p>}
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full cursor-pointer disabled:cursor-not-allowed bg-white text-[#0a0a0a] font-black rounded-xl py-4 mt-2 hover:bg-[#e0e0e0] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin" />
                    ) : (
                        <>
                            إرسال الرابط
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </>
                    )}
                </motion.button>

                <div className="pt-4 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-[#707070] hover:text-white transition-colors group"
                    >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
