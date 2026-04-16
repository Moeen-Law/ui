import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { getLoginSchema } from "../schema";
import type { LoginValues } from "../types";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";




export default function Login() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { handleGoogleAuth, loading } = useGoogleAuth();


    const schema = useMemo(() => getLoginSchema(t), [t]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
        resolver: zodResolver(schema),
    });

    const { handleLogin } = useLogin();

    const onSubmit = async (data: LoginValues) => {
        await handleLogin(data);
    };

    return (
        <AuthLayout title={t("auth.login")} subtitle={t("auth.loginSubtitle")}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2 ms-1">{t("auth.email")}</label>
                    <input
                        {...register("email")}
                        className="w-full placeholder:opacity-60 bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="m@example.com"
                        dir="ltr"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ms-1">{errors.email.message}</p>}
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-bold text-muted-foreground ms-1">{t("auth.password")}</label>
                        <Link to="/forgot-password" title={t("auth.forgotPassword")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("auth.forgotPassword")}</Link>
                    </div>
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
                            className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title={showPassword ? t("auth.hide") : t("auth.show")}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 ms-1">{errors.password.message}</p>}
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-500 text-white font-black rounded-xl py-3 mt-4 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? t("common.loading") : t("auth.login")}
                </button>

                <div className="relative my-8 text-center flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border"></span>
                    </div>
                    <span className="relative z-10 bg-card px-4 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        {t("auth.orContinueWith")}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">

                    <button type="button" disabled={loading} onClick={handleGoogleAuth} className="flex disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center bg-muted/50 border border-border rounded-xl py-3 hover:bg-muted transition-all group cursor-pointer">
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

                <p className="text-center text-muted-foreground text-sm mt-8">
                    {t("auth.noAccount")} {" "}
                    <Link to="/signup" className="text-foreground font-bold hover:underline">
                        {t("auth.signup")}
                    </Link>
                </p>

                <p className="text-center text-muted-foreground/60 text-xs mt-8 px-4 leading-relaxed">
                    {t("auth.agreeTo")}{" "}
                    <span className="text-muted-foreground underline cursor-pointer">{t("auth.termsOfService")}</span> {t("auth.and")}{" "}
                    <span className="text-muted-foreground underline cursor-pointer">{t("auth.privacyPolicy")}</span>
                </p>
            </form>
        </AuthLayout>
    );
}
