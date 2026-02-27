import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";

function Landing() {
  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
    </div>
  )
}

export default Landing