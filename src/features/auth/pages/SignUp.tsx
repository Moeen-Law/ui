import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { signUpSchema } from "../schema";
import type { SignUpValues } from "../types";
import { useSignUp } from "../hooks/useSignUp";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { Lock, Eye, EyeOff } from "lucide-react";





export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { handleGoogleAuth, loading } = useGoogleAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
    });

    const { handleSignUp } = useSignUp();

    const onSubmit = async (data: SignUpValues) => {
        await handleSignUp(data);
    };

    return (
        <AuthLayout title="إنشاء حساب جديد" subtitle="أدخل بياناتك لإنشاء حساب مع مُعين">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">الاسم</label>
                    <input
                        {...register("name")}
                        className="w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="أدخل اسمك الكامل"
                        dir="rtl"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 mr-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">البريد الإلكتروني</label>
                    <input
                        {...register("email")}
                        className="w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="m@example.com"
                        dir="ltr"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 mr-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[#a0a0a0] mb-2 mr-1">كلمة المرور</label>
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070] hover:text-white transition-colors cursor-pointer"
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070] hover:text-white transition-colors cursor-pointer"
                                title={showConfirmPassword ? "إخفاء" : "إظهار"}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 mr-1">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-white text-[#0a0a0a] font-black rounded-xl py-3 mt-4 hover:bg-[#e0e0e0] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                </button>

                <div className="relative my-8 text-center flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#2a2a2a]"></span>
                    </div>
                    <span className="relative z-10 bg-[#111111] px-4 text-[#707070] text-xs font-bold uppercase tracking-wider">
                        أو المتابعة باستخدام
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    
                    <button type="button" disabled={loading} onClick={handleGoogleAuth} className="flex disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center border border-[#3a3a3a] rounded-xl py-3 hover:bg-[#4285F4]/10 hover:border-[#4285F4] transition-all group cursor-pointer">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    </button>
                    
                </div>

                <p className="text-center text-[#a0a0a0] text-sm mt-8">
                    لديك حساب بالفعل؟{" "}
                    <Link to="/login" className="text-white font-bold hover:underline">
                        تسجيل الدخول
                    </Link>
                </p>

                <p className="text-center text-[#707070] text-xs mt-8 px-4 leading-relaxed">
                    بالنقر فوق الزر أعلاه، فإنك توافق على{" "}
                    <span className="text-[#a0a0a0] underline cursor-pointer">شروط الخدمة</span> و{" "}
                    <span className="text-[#a0a0a0] underline cursor-pointer">سياسة الخصوصية</span>
                </p>
            </form>
        </AuthLayout>
    );
}
