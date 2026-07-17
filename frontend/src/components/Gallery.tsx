import { useRef , useEffect } from "react";
import { ChevronLeft , ChevronRight , X } from "lucide-react";

interface LightboxProps {
  images: string[]; 
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const handleNext = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scroll

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, images]);

  if (!isOpen || !images.length) return null;

  

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (difference > minSwipeDistance) {
      handleNext(); // Swiped Left
    } else if (difference < -minSwipeDistance) {
      handlePrev(); // Swiped Right
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {/* Top Controls Bar */}
      <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 text-white bg-gradient-to-b from-black/55 to-transparent z-10">
        <span className="font-sans text-[11px] font-extrabold tracking-widest uppercase opacity-75">
          Viewing Image {currentIndex + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center px-4 md:px-16"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-6 p-3 bg-black/40 hover:bg-black/60 border border-white/10 text-white rounded-full transition-colors duration-200 hidden sm:block z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Display Image */}
        <div className="max-w-full max-h-[85vh] flex items-center justify-center overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`Viewer slide ${currentIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-fade-in duration-300"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-6 p-3 bg-black/40 hover:bg-black/60 border border-white/10 text-white rounded-full transition-colors duration-200 hidden sm:block z-10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Swipe Info Overlay (Mobile Only) */}
      <div className="absolute bottom-6 inset-x-0 text-center sm:hidden">
        <span className="font-sans text-[9px] font-bold tracking-widest text-white/50 uppercase">
          Swipe left or right to navigate
        </span>
      </div>
    </div>
  );
}