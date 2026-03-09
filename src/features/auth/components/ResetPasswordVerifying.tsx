import { motion } from 'framer-motion';

function ResetPasswordVerifying() {
    return (
       
            <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                    />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-blue-500/10 blur-2xl rounded-full h-16" />
                </div>
            </div>
        
    );
}

export default ResetPasswordVerifying