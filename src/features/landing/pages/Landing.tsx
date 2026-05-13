import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { VideoDemo } from "../components/VideoDemo";
import { InteractiveDemo } from "../components/InteractiveDemo";
import { Features } from "../components/Features";
import { Pricing } from "../components/Pricing";
import { About } from "../components/About";
import { Footer } from "../components/Footer";
import { useLocation } from "react-router-dom";

function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#pricing") {
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    });
  }, [location.hash]);

  return (
    <div className="w-full bg-background min-h-screen">
      <Navbar />
      <Hero />
      <VideoDemo />
      <InteractiveDemo />
      <Features />
      <Pricing />
      <About />
      <Footer />
    </div>
  )
}

export default Landing
