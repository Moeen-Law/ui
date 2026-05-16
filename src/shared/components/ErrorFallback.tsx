import { AlertCircle, RefreshCw, ChevronLeft, Terminal } from "lucide-react";
import { useState } from "react";

interface ErrorFallbackProps {
    error?: Error;
    message?: string;
    onRetry?: () => void;
    showBackButton?: boolean;
}

export default function ErrorFallback({ 
    error,
    message = "حدث خطأ ما أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.", 
    onRetry,
    showBackButton = true
}: ErrorFallbackProps) {
    const [showDetails, setShowDetails] = useState(false);

    const handleBackToHome = () => {
        window.location.href = window.location.origin;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-6 text-center bg-[#0a0a0a] text-white selection:bg-red-500/30 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05),transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
            
            <div
                className="relative z-10 w-full max-w-2xl animate-in fade-in-0 slide-in-from-bottom-5 zoom-in-95 px-4 duration-300"
            >
                {/* Icon Container */}
                <div className="relative mb-8 mx-auto w-24 h-24">
                    <div
                        className="absolute inset-0 animate-pulse rounded-[2.5rem] bg-red-500/5 blur-xl"
                    />
                    <div className="relative w-full h-full bg-linear-to-b from-[#1a1a1a] to-[#0d0d0d] border border-red-500/20 rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-2xl">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl md:text-4xl font-black mb-4 font-['Cairo'] tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
                    عذراً، حدث خطأ غير متوقع
                </h2>
                <p className="text-[#a0a0a0] max-w-md mx-auto mb-10 leading-relaxed text-base md:text-lg font-['Cairo'] font-medium">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-bold text-sm hover:bg-[#f0f0f0] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group shadow-2xl shadow-white/5 border border-transparent"
                        >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                            <span className="font-['Cairo']">إعادة المحاولة</span>
                        </button>
                    )}

                    {showBackButton && (
                        <button
                            onClick={handleBackToHome}
                            className="flex items-center gap-3 bg-[#111] border border-white/5 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-[#1a1a1a] hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-['Cairo']">العودة للرئيسية</span>
                        </button>
                    )}
                </div>

                {/* Technical Details Toggle */}
                {error && (
                    <div className="mt-6 border-t border-white/5 pt-8">
                        <button 
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-[#555] cursor-pointer hover:text-[#888] transition-colors text-xs flex items-center gap-2 mx-auto font-['Cairo'] group"
                        >
                            <Terminal className="w-3.5 h-3.5 group-hover:text-red-500/50 transition-colors" />
                            <span className="border-b border-transparent group-hover:border-[#888] transition-colors">
                                {showDetails ? "إخفاء التفاصيل التقنية" : "عرض التفاصيل التقنية للخطأ"}
                            </span>
                        </button>
                        
                        {showDetails && (
                            <div className="overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
                                <div className="mt-6 relative">
                                    <div className="absolute inset-0 bg-red-500/5 blur-3xl pointer-events-none" />
                                    <pre className="relative p-6 bg-[#0d0d0d] border border-white/5 rounded-3xl text-left text-red-400/80 font-mono text-[10px] md:text-xs max-w-full overflow-auto max-h-64 whitespace-pre-wrap leading-relaxed shadow-inner custom-scrollbar">
                                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5 text-white/20 uppercase tracking-widest text-[9px] font-sans">
                                            <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                            Error Stack Trace
                                        </div>
                                        {error.stack || error.message}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-[#222] font-mono tracking-widest uppercase pointer-events-none">
                System Error Boundary • v1.0.0
            </div>
        </div>
    );
}
