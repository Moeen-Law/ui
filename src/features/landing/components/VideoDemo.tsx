import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export function VideoDemo() {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

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

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
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

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    const toggleFullscreen = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            try {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            } catch (err) {
                console.error("Error attempting to enable full-screen mode:", err);
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || shouldLoadVideo) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShouldLoadVideo(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "360px 0px" }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [shouldLoadVideo]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <section
            id="video-demo"
            ref={sectionRef}
            className="content-visibility-auto relative min-h-[155vh] bg-background scroll-mt-20 snap-start"
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
                        scale: isFullscreen ? 1 : videoScale,
                        y: isFullscreen ? 0 : videoY,
                        opacity: isFullscreen ? 1 : videoOpacity,
                    }}
                    className={`relative w-full aspect-video will-change-transform z-10 ${isFullscreen ? "max-w-none h-screen" : "max-w-[1180px]"
                        }`}
                >
                    <div
                        ref={containerRef}
                        className={`group relative w-full h-full bg-linear-to-br from-card to-muted overflow-hidden shadow-2xl border border-border cursor-pointer ${isFullscreen ? "rounded-none" : "rounded-2xl"
                            }`}
                        onClick={togglePlay}
                    >
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover bg-muted"
                            autoPlay={shouldLoadVideo}
                            loop
                            muted={isMuted}
                            playsInline
                            preload={shouldLoadVideo ? "metadata" : "none"}
                            poster="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=675&fit=crop"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={handleTimeUpdate}
                        >
                            {shouldLoadVideo ? <source src="/Law firm Promo.mp4" type="video/mp4" /> : null}
                            Your browser does not support the video tag.
                        </video>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <button
                            onClick={togglePlay}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md text-white rounded-full p-6 flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-white/30 border border-white/20 ${isPlaying
                                    ? "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                                    : "opacity-100 scale-100"
                                }`}
                        >
                            {isPlaying ? (
                                <Pause className="w-8 h-8 fill-current" />
                            ) : (
                                <Play className="w-8 h-8 fill-current ml-1" />
                            )}
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between z-20">
                            <button
                                onClick={toggleMute}
                                className="bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 transition-colors border border-white/10"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-5 h-5" />
                                ) : (
                                    <Volume2 className="w-5 h-5" />
                                )}
                            </button>

                            <button
                                onClick={toggleFullscreen}
                                className="bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 transition-colors border border-white/10"
                            >
                                {isFullscreen ? (
                                    <Minimize className="w-5 h-5" />
                                ) : (
                                    <Maximize className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                            <div
                                className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute bottom-[8%] left-0 right-0 text-center px-6 md:px-8 pointer-events-none"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 font-sans text-foreground">
                        {t("videoDemo.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl font-sans">
                        {t("videoDemo.subtitle")}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
