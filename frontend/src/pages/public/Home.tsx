import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Loader2, TrendingUp, ArrowRight } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  url: string;
  image_urls: string[];
  category_name: string;
  category_url: string;
  views: number;
}

const Home = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL ;

  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/story/`);
        setStories(response.data.result || []);
      } catch (err) {
        console.error('Error fetching homepage stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const stripHtml = (html: string) => {
    return html ? html.replace(/<[^>]*>/g, '') : '';
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-burnt-brown" />
          <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">
            Opening Archive...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4 max-w-md mx-auto">
          <p className="font-serif text-base text-ink/80 mb-6">No stories found. Check back later!</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Frontend Data Organization
  const heroStory = stories[0];
  const gridStories = stories.slice(1);
  const trendingStories = [...stories].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-burnt-brown selection:text-canvas">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        

        {heroStory && (
          <div 
            onClick={() => navigate(`/storydetails/${heroStory.url}/${heroStory.id}`)}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 border border-[#E5E2DA] bg-[#FDFDFC] hover:bg-[#F9F7F2] rounded-sm overflow-hidden transition-all duration-500 shadow-xs mb-16"
          >
            {/* Visual Frame */}
            <div className="lg:col-span-7 aspect-video lg:aspect-auto lg:h-[480px] overflow-hidden bg-cream/25 border-b lg:border-b-0 lg:border-r border-[#E5E2DA]">
              <img 
                src={heroStory.image_urls?.[0] || 'https://via.placeholder.com/1200x500'} 
                alt={heroStory.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
            </div>

            {/* Typography Frame */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center space-y-4">
              <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
                Featured Cover Story • {heroStory.category_name}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-ink group-hover:text-burnt-brown transition-colors">
                {heroStory.title}
              </h1>
              <p className="font-serif text-sm text-ink/80 leading-relaxed line-clamp-4">
                {stripHtml(heroStory.content)}
              </p>
              <div className="pt-2 flex items-center gap-1.5 font-sans text-[9px] font-extrabold tracking-widest uppercase text-burnt-brown">
                Read Feature <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        )}

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          
          {/* Left Column: Recent Stories Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-burnt-brown pb-3">
              <span className="font-sans text-[11px] font-black tracking-widest uppercase text-burnt-brown">
                Latest Stories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridStories.map((story) => (
                <article 
                  key={story.id} 
                  onClick={() => navigate(`/storydetails/${story.url}/${story.id}`)}
                  className="group cursor-pointer flex flex-col border border-[#E5E2DA] bg-[#FDFDFC] hover:bg-[#F9F7F2] rounded-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden bg-cream/30 border-b border-[#E5E2DA]">
                    <img 
                      src={story.image_urls?.[0] || 'https://via.placeholder.com/400x250'} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow space-y-2">
                    <span className="font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown">
                      {story.category_name}
                    </span>
                    <h3 className="font-serif text-base font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="font-serif text-xs text-ink/80 leading-relaxed line-clamp-3 flex-grow">
                      {stripHtml(story.content)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Sticky Trending Sidebar */}
          <aside className="lg:col-span-4 lg:border-l lg:border-[#E5E2DA] lg:pl-8 space-y-6 h-fit lg:sticky lg:top-24">
            <div className="border-b border-burnt-brown pb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-burnt-brown" />
              <span className="font-sans text-[11px] font-black tracking-widest uppercase text-burnt-brown">
                Trending Stories
              </span>
            </div>

            <div className="space-y-4">
              {trendingStories.map((story, index) => (
                <div 
                  key={story.id} 
                  onClick={() => navigate(`/storydetails/${story.url}/${story.id}`)}
                  className="group cursor-pointer flex gap-4 p-4 border border-[#E5E2DA] bg-[#FDFDFC] hover:bg-[#F9F7F2] rounded-sm transition-all duration-300 items-center animate-fade-in"
                >
                  {/* Elegant Numbering */}
                  <span className="font-serif font-black italic text-2xl text-burnt-brown/25 group-hover:text-burnt-brown transition-colors">
                    {index + 1}
                  </span>
                  
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown block">
                      {story.category_name}
                    </span>
                    <h4 className="font-serif text-xs sm:text-sm font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
                      {story.title}
                    </h4>
                  </div>

                  {story.image_urls?.[0] && (
                    <div className="w-12 h-12 overflow-hidden shrink-0 aspect-square bg-cream/20 border border-[#E5E2DA]">
                      <img 
                        src={story.image_urls[0]} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;