import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

function OAuthSuccess() {
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
}

export default OAuthSuccess