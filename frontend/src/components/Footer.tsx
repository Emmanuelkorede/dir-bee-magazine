import { useNavigate } from "react-router";
import { BrandLogo } from "./Logo";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = 2026;

  return (
    <footer className="w-full bg-canvas border-t border-[#E5E2DA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#E5E2DA]">
          
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-12 h-12 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <BrandLogo className="h-28 w-auto" />
              </div>
              <span className="font-serif text-xl font-black tracking-tight leading-none text-ink">
                Bee's Magz
              </span>
            </div>
            <p className="font-serif italic text-xs text-ink/75 max-w-xs leading-relaxed">
              A carefully curated publication celebrating culture, design, and beautiful narratives.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
              Explore
            </span>
            <nav className="flex flex-col gap-3">
              <button 
                onClick={() => navigate("/about")} 
                className="text-left font-sans text-xs font-bold text-ink/85 hover:text-burnt-brown tracking-widest uppercase transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button 
                onClick={() => navigate("/get-featured")} 
                className="text-left font-sans text-xs font-bold text-ink/85 hover:text-burnt-brown tracking-widest uppercase transition-colors cursor-pointer"
              >
                Get Featured
              </button>
              <a 
                href="https://director-bee.vercel.app/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-left font-sans text-xs font-bold text-ink/85 hover:text-burnt-brown tracking-widest uppercase transition-colors cursor-pointer"
              >
                Dir Bee
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
              Social House
            </span>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 border border-[#E5E2DA] hover:border-burnt-brown text-ink hover:text-burnt-brown transition-all cursor-pointer"
                title="Instagram"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 border border-[#E5E2DA] hover:border-burnt-brown text-ink hover:text-burnt-brown transition-all cursor-pointer"
                title="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.14.99 1.13 2.37 1.83 3.84 2.1v3.91c-1.78-.02-3.5-.63-4.93-1.74-.15-.12-.3-.24-.44-.37v6.86c.01 1.6-.42 3.19-1.25 4.54a8.31 8.31 0 01-8.52 3.98A8.252 8.252 0 011.02 15c-.4-3.13.91-6.32 3.39-8.24a8.21 8.21 0 016.22-1.63V9.1c-1.3-.36-2.73-.02-3.73.87-.99.89-1.46 2.27-1.24 3.59.21 1.3 1.12 2.39 2.36 2.85 1.25.47 2.68.18 3.65-.72.48-.44.75-1.07.75-1.72V0h1.125z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 border border-[#E5E2DA] hover:border-burnt-brown text-ink hover:text-burnt-brown transition-all cursor-pointer"
                title="YouTube"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink/75">
            © {currentYear} BEE'S MAGZ. ALL RIGHTS RESERVED.
          </span>
          <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-burnt-brown/80">
            Designed for the inspired
          </span>
        </div>

      </div>
    </footer>
  );
}