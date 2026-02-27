import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { VideoDemo } from "../components/VideoDemo";
import { InteractiveDemo } from "../components/InteractiveDemo";

function Landing() {
  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <VideoDemo />
      <InteractiveDemo />
    </div>
  )
}

export default Landing