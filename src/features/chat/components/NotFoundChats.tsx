import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function NotFoundChats() {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center px-4"
        >
            <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 opacity-30" />
            </div>
            <p className="text-muted-foreground text-xs font-sans leading-relaxed whitespace-pre-wrap">
                {t("chat.ui.startNewChatInfo")}
            </p>
        </motion.div>
    )
}

export default NotFoundChats