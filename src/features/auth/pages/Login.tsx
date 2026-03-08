import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { Apple, Facebook } from "lucide-react";
import { loginSchema } from "../schema";
import type { LoginValues } from "../types";
import { useLogin } from "../hooks/useLogin";




export default function Login() {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const { handleLogin } = useLogin();

    const onSubmit = async (data: LoginValues) => {
        await handleLogin(data);
    };

    return (
        <AuthLayout title="تسجيل الدخول" subtitle="أدخل بريدك الإلكتروني للدخول إلى حسابك">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-bold text-[#a0a0a0] mr-1">كلمة المرور</label>
                        <Link to="#" className="text-xs text-[#707070] hover:text-white transition-colors">نسيت كلمة المرور؟</Link>
                    </div>
                    <input
                        {...register("password")}
                        type="password"
                        className="w-full placeholder:opacity-25 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="••••••••"
                        dir="ltr"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1 mr-1">{errors.password.message}</p>}
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-white text-[#0a0a0a] font-black rounded-xl py-3 mt-4 hover:bg-[#e0e0e0] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>

                <div className="relative my-8 text-center flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#2a2a2a]"></span>
                    </div>
                    <span className="relative z-10 bg-[#111111] px-4 text-[#707070] text-xs font-bold uppercase tracking-wider">
                        أو المتابعة باستخدام
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <button type="button" className="flex items-center justify-center border border-[#3a3a3a] rounded-xl py-3 hover:bg-white hover:border-white transition-all group cursor-pointer">
                        <Apple className="w-5 h-5 group-hover:text-black" />
                    </button>
                    <button type="button" className="flex items-center justify-center border border-[#3a3a3a] rounded-xl py-3 hover:bg-[#4285F4]/10 hover:border-[#4285F4] transition-all group cursor-pointer">
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
                    <button type="button" className="flex items-center justify-center border border-[#3a3a3a] rounded-xl py-3 hover:bg-[#1877F2]/10 hover:border-[#1877F2] transition-all group cursor-pointer">
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                    </button>
                </div>

                <p className="text-center text-[#a0a0a0] text-sm mt-8">
                    ليس لديك حساب؟{" "}
                    <Link to="/signup" className="text-white font-bold hover:underline">
                        إنشاء حساب جديد
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
