import { useNavigate, useParams } from "react-router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import { Loader2, BookOpen } from "lucide-react";

export interface Story {
  id: string;
  title: string;
  content: string;
  url: string;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  scheduled_date: string | null;
  video_urls: string[];
  music_urls: string[];
  image_urls: string[];
  admin_user_id: string;
  category_id: string;
  category_name: string;
}

export default function CategoryPage() {
  const { url } = useParams<{ url: string }>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL ;
  
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getStoryBYCatUrl = async () => {
    if (!url) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get(`${API_BASE}/story/?category_url=${url}`, getAuthHeader());
      setStories(response.data.result || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'An error occurred while loading articles.');
      } else {
        setMessage('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoryBYCatUrl();
  }, [url]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExcerpt = (htmlContent: string, maxLength: number = 160) => {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getCategoryTitle = () => {
    if (stories.length > 0) {
      return stories[0].category_name;
    }
    return url ? url.replace(/-/g, ' ').toUpperCase() : 'Category';
  };

  const heroStory = stories[0];
  const gridStories = stories.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-burnt-brown selection:text-canvas">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-burnt-brown" />
            <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">
              Curating Articles...
            </p>
          </div>
        ) : message ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <p className="font-serif text-base text-ink/80 mb-6">{message}</p>
            <button
              onClick={() => getStoryBYCatUrl()}
              className="px-5 py-2 bg-burnt-brown text-canvas font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-[#342013] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight uppercase text-ink mb-3">
              {getCategoryTitle()}
            </h1>
            <div className="w-10 h-[1px] bg-burnt-brown mx-auto my-4" />
            <p className="font-serif italic text-xs text-ink/65 mb-6">
              No stories are published under this category yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 border border-burnt-brown text-burnt-brown font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-burnt-brown hover:text-canvas transition-all"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10 sm:mb-12">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-ink">
                {getCategoryTitle()}
              </h1>
              <div className="w-12 h-0.5 bg-burnt-brown mx-auto mt-4" />
            </div>

            {heroStory && (
              <section 
                onClick={() => navigate(`/storydetails/${heroStory.url}/${heroStory.id}`)}
                className="group cursor-pointer mb-14 border-b border-[#E5E2DA] pb-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-7 overflow-hidden bg-cream/30 aspect-[16/9] max-h-[380px] w-full">
                    {heroStory.image_urls?.[0] ? (
                      <img
                        src={heroStory.image_urls[0]}
                        alt={heroStory.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center border border-[#E5E2DA]">
                        <BookOpen className="w-10 h-10 text-ink/20" />
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                    <div className="flex items-center gap-2 font-sans text-[9px] font-extrabold tracking-widest uppercase text-burnt-brown">
                      <span>{heroStory.category_name}</span>
                      <span className="w-1 h-1 rounded-full bg-burnt-brown/40" />
                      <span className="text-muted-ink">{formatDate(heroStory.created_at)}</span>
                    </div>
                    
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-ink group-hover:text-burnt-brown transition-colors">
                      {heroStory.title}
                    </h2>
                    
                    <p className="font-serif text-xs sm:text-sm text-ink/75 leading-relaxed line-clamp-3">
                      {getExcerpt(heroStory.content, 180)}
                    </p>
                    
                    <div className="pt-1">
                      <span className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-burnt-brown inline-flex items-center gap-2 border-b border-burnt-brown pb-0.5">
                        Read full article
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {gridStories.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
                  <span className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink">
                    More from {getCategoryTitle()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {gridStories.map((story) => (
                    <article
                      key={story.id}
                      onClick={() => navigate(`/storydetails/${story.url}/${story.id}`)}
                      className="group cursor-pointer flex flex-row sm:flex-col gap-4 sm:gap-3 items-start"
                    >
                      <div className="overflow-hidden bg-cream/30 aspect-video w-24 sm:w-full shrink-0">
                        {story.image_urls?.[0] ? (
                          <img
                            src={story.image_urls[0]}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center border border-[#E5E2DA]">
                            <BookOpen className="w-6 h-6 text-ink/20" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown">
                          <span>{story.category_name}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-burnt-brown/40" />
                          <span className="text-muted-ink">{formatDate(story.created_at)}</span>
                        </div>

                        <h3 className="font-serif text-sm sm:text-base font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
                          {story.title}
                        </h3>

                        <p className="font-serif text-[11px] sm:text-xs text-ink/70 leading-relaxed line-clamp-2 hidden sm:block">
                          {getExcerpt(story.content, 90)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}