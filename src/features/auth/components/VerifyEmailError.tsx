import { XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerifyEmailErrorProps {
    message?: string | null;
}

function VerifyEmailError({ message }: VerifyEmailErrorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
        >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-foreground text-lg font-bold">فشل التحقق</p>
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{message || "حدث خطأ أثناء محاولة التحقق من بريدك الإلكتروني."}</p>
            </div>
            <p className="text-muted-foreground text-sm">
                قد يكون الرابط قد انتهت صلاحيته أو تم استخدامه بالفعل.
            </p>
        </motion.div>
    );
}

export default VerifyEmailError;
