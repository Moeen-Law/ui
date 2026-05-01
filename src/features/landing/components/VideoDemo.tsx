import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

export function VideoDemo() {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true); // Autoplay is on
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const videoScale = useTransform(
        scrollYProgress,
        [0, 0.35, 1],
        shouldReduceMotion ? [1, 1, 1] : [1, 0.82, 0.82]
    );
    const videoY = useTransform(
        scrollYProgress,
        [0, 0.35, 1],
        shouldReduceMotion ? [0, 0, 0] : [0, -42, -42]
    );
    const videoOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.82]);

    const contentOpacity = useTransform(scrollYProgress, [0.28, 0.48], [0, 1]);
    const contentY = useTransform(
        scrollYProgress,
        [0.28, 0.48],
        shouldReduceMotion ? [0, 0] : [24, 0]
    );
    const progressScale = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <section
            id="video-demo"
            ref={sectionRef}
            className="relative min-h-[155vh] bg-background scroll-mt-20 snap-start"
        >
            <div className="sticky top-20 h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden">
                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-center gap-3">
                    <div className="relative h-24 w-1 overflow-hidden rounded-full bg-border">
                        <motion.div
                            style={{ scaleY: progressScale }}
                            className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-blue-500"
                        />
                    </div>
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                </div>

                <motion.div
                    style={{
                        scale: videoScale,
                        y: videoY,
                        opacity: videoOpacity,
                    }}
                    className="relative w-full max-w-[1180px] aspect-video will-change-transform"
                >
                    <div className="relative w-full h-full bg-linear-to-br from-card to-muted rounded-2xl overflow-hidden shadow-2xl border border-border">
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover bg-muted"
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=675&fit=crop"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        >
                            <source src="/Law firm Promo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Play/Pause Overlay */}
                        <button
                            onClick={togglePlay}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/95 text-black rounded-full px-8 py-5 flex items-center gap-3 font-['Cairo'] text-[1.1rem] font-bold cursor-pointer transition-all duration-300 shadow-2xl hover:scale-105 ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
                                }`}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>{t("videoDemo.playBtn")}</span>
                        </button>
                    </div>
                </motion.div>

                {/* Content that appears after video transitions */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute bottom-[8%] left-0 right-0 text-center px-6 md:px-8 pointer-events-none"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 font-['Cairo'] text-foreground">
                        {t("videoDemo.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-['Cairo']">
                        {t("videoDemo.subtitle")}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
