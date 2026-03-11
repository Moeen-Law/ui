import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyEmailSuccess() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
        >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-white text-lg font-bold">تم التحقق بنجاح!</p>
            <p className="text-[#a0a0a0]">تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول واستخدام جميع المميزات.</p>
        </motion.div>
    );
}

export default VerifyEmailSuccess;
