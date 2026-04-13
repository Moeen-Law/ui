import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

function OAuthProcessing() {
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
                <h2 className="text-2xl font-black text-foreground">جاري المصادقة...</h2>
                <p className="text-muted-foreground">يرجى الانتظار بينما نقوم بإنهاء تسجيل دخولك</p>
            </div>
        </motion.div>
    );
}

export default OAuthProcessing