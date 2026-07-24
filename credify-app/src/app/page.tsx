import HeroScene from "@/components/canvas/HeroScene";
import Hero from "@/components/sections/Hero";
import Metrics from "@/components/sections/Metrics";
import Features from "@/components/sections/Features";
import Protocol from "@/components/sections/Protocol";
import Philosophy from "@/components/sections/Philosophy";
import Pricing from "@/components/sections/Pricing";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void overflow-x-hidden selection:bg-plasma selection:text-void">
      {/* 3D Background - Fixed behind everything */}
      <HeroScene />
      
      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        
        {/* Navbar */}
        <div className="pointer-events-auto">
          <Navbar />
        </div>
        
        {/* Sections */}
        <Hero />
        <Metrics />
        <Features />
        <Protocol />
        <Philosophy />
        <Pricing />
        <Footer />
        
      </div>
    </main>
  );
}
