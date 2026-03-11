import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { forgotPasswordSchema } from "../schema";
import type { ForgotPasswordValues } from "../types";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { formatTime } from "../helpers";

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { forgotPassword, loading, cooldown } = useForgotPassword();

    const onSubmit = async (data: ForgotPasswordValues) => {
        if (cooldown > 0) return;
        await forgotPassword(data.email);
    };

    const isCooldownActive = cooldown > 0;

    return (
        <AuthLayout
            title="نسيت كلمة المرور؟"
            subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">البريد الإلكتروني</label>
                    <div className="relative group">
                        <input
                            {...register("email")}
                            disabled={isCooldownActive}
                            className={`w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 pr-11 text-white focus:outline-none focus:border-blue-500 transition-all ${isCooldownActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="m@example.com"
                            dir="ltr"
                        />
                        <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isCooldownActive ? 'text-[#3a3a3a]' : 'text-[#707070] group-focus-within:text-blue-500'}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 mr-1">{errors.email.message}</p>}
                </div>

                <motion.button
                    whileHover={!isCooldownActive && !loading ? { scale: 1.01 } : {}}
                    whileTap={!isCooldownActive && !loading ? { scale: 0.99 } : {}}
                    disabled={loading || isCooldownActive}
                    type="submit"
                    className="w-full cursor-pointer disabled:cursor-not-allowed bg-white text-[#0a0a0a] font-black rounded-xl py-4 mt-2 hover:bg-[#e0e0e0] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin" />
                    ) : isCooldownActive ? (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>يرجى الانتظار {formatTime(cooldown)}</span>
                        </div>
                    ) : (
                        <>
                            إرسال الرابط
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </>
                    )}
                </motion.button>

                {isCooldownActive && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-center text-amber-500 font-medium"
                    >
                        تم إرسال الطلب. يمكنك طلب رابط جديد بعد انتهاء الوقت.
                    </motion.p>
                )}

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
