import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {BrandLogo } from "../../components/Logo"; 
import { Eye, Sparkles, Music, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-burnt-brown selection:text-canvas">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        
        {/* Editorial Header Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pb-12 md:pb-16 border-b border-[#E5E2DA]">
          <div className="flex justify-center mb-4">
            {/* Brand Logo Import used at the top of her manifesto */}
            <div className="w-24 md:w-32 hover:scale-105 transition-transform duration-300">
              <BrandLogo />
            </div>
          </div>
          
          <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown block">
            The Manifesto
          </span>
          
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-ink">
            Where culture meets the surreal.
          </h1>
          
          <p className="font-serif text-base sm:text-lg text-muted-ink italic leading-relaxed">
            "We do not just document the movement—we shape the visual language that carries it forward."
          </p>
        </div>

        {/* Two-Column Brand Narrative & Founder Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-16">
          
          {/* Left Side: The Magazine's Identity */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
                Who We Are
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-ink">
                Documenting the Sonic & Visual Revolution of African Music
              </h2>
            </div>

            <div className="font-serif text-sm sm:text-base text-ink/90 leading-relaxed space-y-6">
              <p>
                Born in the heart of Lagos, <strong>Bee Magazine</strong> is an editorial sanctuary dedicated to the architects of new-age sound and vision. We exist at the vital intersection where grounded African realities meet elevated, almost supernatural creative expressions.
              </p>
              <p>
                While the fast-moving digital landscape favors the temporary, we believe in <strong>narrative longevity</strong>. Bee Magazine serves as a curated catalog of visual identity, profound music reviews, and deep-dive features that capture the true essence of West African creativity before it goes global.
              </p>
              <p>
                Through rich multimedia integrations—from immersive audio tracks to visual-first archives—we build a cohesive home for projects that don't just support the culture, but boldly expand its reach and impact across the globe.
              </p>
            </div>

            {/* Core Values / Pillar Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="p-5 border border-[#E5E2DA] bg-[#FDFDFC] rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-full bg-cream/30 flex items-center justify-center text-burnt-brown">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-black text-ink uppercase tracking-tight">The Surreal Real</h4>
                <p className="font-serif text-xs text-muted-ink leading-relaxed">
                  Blurring the lines between everyday reality and high-concept creative design.
                </p>
              </div>

              <div className="p-5 border border-[#E5E2DA] bg-[#FDFDFC] rounded-sm space-y-3">
                <div className="w-8 h-8 rounded-full bg-cream/30 flex items-center justify-center text-burnt-brown">
                  <Music className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-black text-ink uppercase tracking-tight">Sonic Depth</h4>
                <p className="font-serif text-xs text-muted-ink leading-relaxed">
                  Deconstructing the soundscapes, visual rollouts, and identities of emerging innovators.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: The Founder's Profile (Sticky Frame Layout) */}
          <div className="lg:col-span-5">
            <div className="border border-[#E5E2DA] bg-[#FDFDFC] p-6 sm:p-8 rounded-sm space-y-6 lg:sticky lg:top-24 shadow-xs">
              
              <div className="space-y-1.5">
                <span className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-burnt-brown">
                  The Visionary
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-ink">
                  Director Bee
                </h3>
                <p className="font-sans text-[10px] font-bold text-muted-ink uppercase tracking-wider">
                  Creative Director & Visual Strategist
                </p>
              </div>

              {/* Decorative line divider */}
              <div className="h-px bg-[#E5E2DA]" />

              <div className="font-serif text-xs sm:text-sm text-ink/80 leading-relaxed space-y-4">
                <p>
                  As a Lagos-based visual strategist and director, Director Bee crafts immersive visual worlds that push African music beyond conventional boundaries. Her work is defined by bold concepts translated into striking, strategic visual realities.
                </p>
                <p>
                  From shaping an artist's visual identity to directing full-scale productions, she builds cohesive rollouts designed for narrative longevity. Based out of Nigeria, her curation works across global markets, bringing a refined West African perspective to the international stage.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E2DA] flex flex-wrap gap-4 items-center justify-between text-muted-ink text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-burnt-brown" />
                  Lagos, Nigeria
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-burnt-brown" />
                  Visual Strategy
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}