import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { useLocation } from "react-router-dom";

const VideoDemo = lazy(() => import("../components/VideoDemo").then((module) => ({ default: module.VideoDemo })));
const InteractiveDemo = lazy(() => import("../components/InteractiveDemo").then((module) => ({ default: module.InteractiveDemo })));
const About = lazy(() => import("../components/About").then((module) => ({ default: module.About })));

function LandingSectionFallback({ className = "min-h-[420px]" }: { className?: string }) {
  return <div className={className} aria-hidden="true" />;
}

function Landing() {
  const location = useLocation();

  useEffect(() => { 
    const targetId = location.hash.replace("#", "");

    if (!targetId) {
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [location.hash]);

  return (
    <div className="w-full bg-background min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<LandingSectionFallback className="min-h-[100vh]" />}>
        <VideoDemo />
      </Suspense>
      <Suspense fallback={<LandingSectionFallback />}>
        <InteractiveDemo />
      </Suspense>
      <Features />
      <Pricing />
      <FAQ />
      <Suspense fallback={<LandingSectionFallback />}>
        <About />
      </Suspense>
      <Footer />
    </div>
  )
}

export default Landing
