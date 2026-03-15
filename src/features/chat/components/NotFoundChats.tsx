import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

function NotFoundChats() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center px-4"
        >
            <div className="w-12 h-12 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center mb-4 text-[#333]">
                <Plus className="w-6 h-6 opacity-20" />
            </div>
            <p className="text-[#444] text-xs font-['Cairo'] leading-relaxed">
                ابدأ محادثة جديدة الآن<br />
                وسوف تظهر هنا
            </p>
        </motion.div>
    )
}

export default NotFoundChats