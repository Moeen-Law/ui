import { motion } from "framer-motion";

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 py-1 px-1">
            <motion.span
                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.span
                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
}

export default TypingIndicator