import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import VerifyEmailVerifying from "../components/VerifyEmailVerifying";
import VerifyEmailSuccess from "../components/VerifyEmailSuccess";
import VerifyEmailError from "../components/VerifyEmailError";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function VerifyEmail() {
    const { verifyEmail, loading, error, success, token } = useVerifyEmail();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    const title = loading ? "جاري التحقق..." : error ? "فشل التحقق" : success ? "تم التحقق بنجاح" : "التحقق من البريد الإلكتروني";
    const subtitle = loading
        ? "يرجى الانتظار قليلاً بينما نتحقق من بريدك الإلكتروني"
        : error
            ? "حدثت مشكلة أثناء محاولة تفعيل حسابك"
            : success
                ? "تهانينا! تم تفعيل حسابك بنجاح"
                : "يرجى الضغط على زر التحقق لتفعيل حسابك";

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            {loading && <VerifyEmailVerifying />}

            {error && <VerifyEmailError message={error} />}

            {success && (
                <div className="space-y-6">
                    <VerifyEmailSuccess />
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate("/login")}
                        className="w-full cursor-pointer bg-blue-500 text-white font-black rounded-xl py-4 mt-2 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group"
                    >
                        <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        الذهاب لتسجيل الدخول
                    </motion.button>
                </div>
            )}

            {!token && !loading && !success && !error && (
                <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">عذراً، يبدو أن رابط التحقق غير موجود في العنوان.</p>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate("/signup")}
                        className="w-full cursor-pointer bg-blue-500 text-white font-black rounded-xl py-3 hover:bg-blue-600 transition-all"
                    >
                        العودة لإنشاء حساب
                    </motion.button>
                </div>
            )}
        </AuthLayout>
    );
}
