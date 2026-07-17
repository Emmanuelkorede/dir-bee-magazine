import { useEffect, useState } from "react"; 
import axios from "axios";
import { BrandLogo } from "./Logo";
import { useNavigate, useLocation } from "react-router";
import { 
  Menu, 
  X, 
  ArrowRight,
  Loader2
} from "lucide-react";

type CategoryType = {
  id: string;
  name: string;
  url: string;
  created_at: string;
};

export default function Header() {
  const [, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]); 
  const [isOpen, setIsOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE_URL ;



  const getCategories = async () => {
    setMessage(''); 
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/category/`); 
      setCategories(response.data.result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'An error occurred'); 
      } else {
        setMessage('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleNavigation = (url: string) => {
    navigate(`/category/${url}`);
    setIsOpen(false); 
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-md border-b border-[#E5E2DA] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <BrandLogo 
                  className="h-28 w-auto" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-black tracking-tight leading-none text-ink">
                  Bee's Magz
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-ink" />
              ) : (
                categories.slice(0, 5).map((cat) => {
                  const isActive = location.pathname === `/category/${cat.url}`;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleNavigation(cat.url)}
                      className={`font-sans text-[11px] font-bold tracking-widest uppercase transition-all duration-200 relative py-2 cursor-pointer
                        ${isActive ? 'text-burnt-brown' : 'text-ink hover:text-burnt-brown'}
                      `}
                    >
                      {cat.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burnt-brown animate-fade-in" />
                      )}
                    </button>
                  );
                })
              )}
            </nav>

            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-4 border-r border-[#E5E2DA] pr-6">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-ink hover:text-burnt-brown transition-colors cursor-pointer"
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
                  className="text-ink hover:text-burnt-brown transition-colors cursor-pointer"
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
                  className="text-ink hover:text-burnt-brown transition-colors cursor-pointer"
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

              <button 
                onClick={() => navigate('/get-featured')}
                className="px-5 py-2.5 bg-burnt-brown hover:bg-[#342013] text-canvas font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xs cursor-pointer flex items-center gap-2"
              >
                Get Featured
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-[#E5E2DA] hover:border-burnt-brown bg-white text-ink transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />

        <div 
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[340px] bg-canvas border-l border-[#E5E2DA] p-6 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#E5E2DA]">
              <span className="font-serif text-lg font-black text-ink tracking-tight">Navigation</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 border border-[#E5E2DA] text-ink cursor-pointer hover:bg-cream/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5 pt-6">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-burnt-brown" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center p-4 text-xs font-sans text-muted-ink">
                  No categories found.
                </div>
              ) : (
                categories.map((cat) => {
                  const isActive = location.pathname === `/category/${cat.url}`;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleNavigation(cat.url)}
                      className={`w-full text-left py-3 px-4 transition-all duration-200 font-serif text-lg font-bold flex items-center justify-between border-b border-gray-100 group
                        ${isActive ? 'bg-cream/30 text-burnt-brown pl-6 border-l-2 border-burnt-brown' : 'text-ink hover:bg-cream/15'}
                      `}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </nav>
          </div>

          <div className="pt-6 pb-16 border-t border-[#E5E2DA] space-y-6">
            <div className="space-y-3">
              <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink block">
                Connect with us
              </span>
              <div className="flex items-center gap-6">
                <a 
                  href="https://instagram.com" 
                  className="p-2 border border-[#E5E2DA] text-ink hover:text-burnt-brown hover:border-burnt-brown transition-colors cursor-pointer"
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
                  className="p-2 border border-[#E5E2DA] text-ink hover:text-burnt-brown hover:border-burnt-brown transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.14.99 1.13 2.37 1.83 3.84 2.1v3.91c-1.78-.02-3.5-.63-4.93-1.74-.15-.12-.3-.24-.44-.37v6.86c.01 1.6-.42 3.19-1.25 4.54a8.31 8.31 0 01-8.52 3.98A8.252 8.252 0 011.02 15c-.4-3.13.91-6.32 3.39-8.24a8.21 8.21 0 016.22-1.63V9.1c-1.3-.36-2.73-.02-3.73.87-.99.89-1.46 2.27-1.24 3.59.21 1.3 1.12 2.39 2.36 2.85 1.25.47 2.68.18 3.65-.72.48-.44.75-1.07.75-1.72V0h1.125z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com" 
                  className="p-2 border border-[#E5E2DA] text-ink hover:text-burnt-brown hover:border-burnt-brown transition-colors cursor-pointer"
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

            <button 
              onClick={() => {
                navigate('');
                setIsOpen(false);
              }}
              className="w-full py-3 bg-burnt-brown hover:bg-[#342013] text-canvas font-sans text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              Get Featured
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}