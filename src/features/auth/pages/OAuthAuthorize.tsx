import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import useAuthStore from "../store/auth";

export default function OAuthAuthorize() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const success = searchParams.get("success");
    const accessToken = searchParams.get("accessToken"); 
    const { setAccessToken } = useAuthStore();

    const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

    useEffect(() => {
        if (success === null) {
            navigate("/", { replace: true });
            return;
        }

        const processAuth = async () => {
            // Artificial delay for modern feel
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (success === "true") {
                if (accessToken) {
                    setAccessToken(accessToken);
                }
                setStatus("success");
                setTimeout(() => navigate("/"), 3000);
            } else {
                setStatus("error");
            }
        };

        processAuth();
    }, [success, accessToken, navigate, setAccessToken]);


    const renderContent = () => {
        switch (status) {
            case "processing":
                return (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                            />
                            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white">جاري المصادقة...</h2>
                            <p className="text-[#a0a0a0]">يرجى الانتظار بينما نقوم بإنهاء تسجيل دخولك</p>
                        </div>
                    </motion.div>
                );
            case "success":
                return (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                    >
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 bg-green-500/20 rounded-full"
                            />
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white">تم تسجيل الدخول بنجاح!</h2>
                            <p className="text-[#a0a0a0]">أهلاً بك في معين، سيتم توجيهك الآن...</p>
                        </div>
                    </motion.div>
                );
            case "error":
                return (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-8 text-center"
                    >
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-white">فشل تسجيل الدخول</h2>
                            <p className="text-[#a0a0a0] max-w-xs mx-auto">
                                حدث خطأ أثناء محاولة تسجيل الدخول عبر جوجل. يرجى المحاولة مرة أخرى.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-white text-[#0a0a0a] px-8 py-4 rounded-xl font-black hover:bg-[#e0e0e0] transition-all"
                        >
                            العودة لتسجيل الدخول
                        </button>
                    </motion.div>
                );
        }
    };

    return (
        <AuthLayout
            title={status === "error" ? "خطأ في المصادقة" : "مصادقة جوجل"}
            subtitle={status === "error" ? "فشل الاتصال" : "نقوم بالتحقق من بياناتك"}
        >
            <div className="relative overflow-hidden min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}
