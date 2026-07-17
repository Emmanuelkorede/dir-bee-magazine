import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { MusicEmbed, VideoEmbed } from "../../components/MediaEmbeds";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Loader2, Calendar, Disc, Video, Images,} from "lucide-react";
import { ImageLightbox } from "../../components/Gallery";


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
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

export default function StoryDetails() {
  const { url, id } = useParams<{ url: string; id: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [categoryStories, setCategoryStories] = useState<Story[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // --------------------------------------------------------------------------
  // Core Business Logics - UNTOUCHED (as requested)
  // --------------------------------------------------------------------------
  const getStoryDetails = async () => {
    if (!id || !url) return null;
    try {
      const response = await axios.get(`http://localhost:8000/story/${url}/${id}`, getAuthHeader());
      const fetchedStory = response.data.result;
      setStory(fetchedStory);
      console.log("Current Story:", fetchedStory);
      
      await axios.patch(`http://localhost:8000/story/${id}/view`);
      
      return fetchedStory;
    } catch (error) {
      console.error("Error fetching story details:", error);
      setMessage("Failed to load the article details.");
      return null;
    }
  };

  const getCategoryAndTrending = async (activeCategoryUrl: string) => {
    try {
      if (activeCategoryUrl) {
        const catResponse = await axios.get(`http://localhost:8000/story/?category_url=${activeCategoryUrl}`, getAuthHeader());
        setCategoryStories(catResponse.data.result);
      }

      const allResponse = await axios.get(`http://localhost:8000/story/`, getAuthHeader());
      const all = allResponse.data.result || [];
      const sorted = [...all].sort((a, b) => b.views - a.views).slice(0, 5);
      setTrendingStories(sorted);
    } catch (error) {
      console.error("Error fetching context content:", error);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    const currentStory = await getStoryDetails();
    
    if (currentStory && currentStory.category_url) {
      await getCategoryAndTrending(currentStory.category_url);
    } else {
      await getCategoryAndTrending("");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, url]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const relatedStories = categoryStories
    .filter((item) => item.id !== id)
    .slice(0, 4);

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

  if (message || !story) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4 max-w-md mx-auto">
          <p className="font-serif text-base text-ink/80 mb-6">{message || "Story not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-burnt-brown text-canvas font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-[#342013] transition-colors"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Slice image arrays safely
  const allImages = story.image_urls || [];
  const additionalImages = allImages.slice(1);

  // Helper trigger to launch Lightbox
  const openImageAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-burnt-brown selection:text-canvas">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          
          {/* LEFT COLUMN: Main Editorial Story Column */}
          <article className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
                {story.category_name}
              </span>
              
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-ink">
                {story.title}
              </h1>

              {/* Redesigned Premium Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 py-3.5 border-y border-[#E5E2DA] text-muted-ink text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-burnt-brown" />
                  Published on {formatDate(story.created_at)} by Admin
                </span>
              </div>
            </div>

            {/* Main Interactive Hero Image (Launch on slide 0) */}
            <div 
              onClick={() => allImages.length > 0 && openImageAt(0)}
              className="group overflow-hidden bg-cream/25 aspect-[16/9] max-h-[480px] w-full border border-[#E5E2DA] cursor-zoom-in relative"
            >
              {allImages[0] ? (
                <>
                  <img
                    src={allImages[0]}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/65 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-sm transition-opacity duration-300">
                      Expand Photo
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-ink text-xs uppercase tracking-widest">No Image Available</span>
                </div>
              )}
            </div>

            {/* Rich Content Text Box */}
            <div 
              className="prose prose-sm sm:prose max-w-none font-serif text-sm sm:text-base text-ink/90 leading-relaxed space-y-6 pt-4"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />

            {/* Redesigned Gallery Grid (Additional Images) */}
            {additionalImages.length > 0 && (
              <div className="pt-8 border-t border-[#E5E2DA]">
                <div className="flex items-center gap-2 mb-5">
                  <Images className="w-4 h-4 text-burnt-brown" />
                  <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
                    Visual Gallery
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {additionalImages.map((imgUrl, index) => (
                    <div 
                      key={index} 
                      onClick={() => openImageAt(index + 1)} // Index offsets primary hero
                      className="overflow-hidden aspect-square bg-cream/15 border border-[#E5E2DA] group cursor-zoom-in relative"
                    >
                      <img
                        src={imgUrl}
                        alt={`Additional view ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Audio & Video Embeds section */}
            {((story.music_urls && story.music_urls.length > 0) || 
              (story.video_urls && story.video_urls.length > 0)) && (
              <div className="pt-8 border-t border-[#E5E2DA] space-y-6">
                <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown block">
                  Media Attachments
                </span>
                
                {story.music_urls && story.music_urls.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <Disc className="w-4 h-4 text-muted-ink" />
                      <span className="font-sans text-[9px] font-extrabold tracking-wider uppercase text-muted-ink">
                        Featured Tracks
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {story.music_urls.map((musicUrl, index) => (
                        <MusicEmbed key={index} rawUrl={musicUrl} />
                      ))}
                    </div>
                  </div>
                )}

                {story.video_urls && story.video_urls.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <Video className="w-4 h-4 text-muted-ink" />
                      <span className="font-sans text-[9px] font-extrabold tracking-wider uppercase text-muted-ink">
                        Clips & Visuals
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {story.video_urls.map((videoUrl, index) => (
                        <VideoEmbed key={index} rawUrl={videoUrl} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>

          {/* RIGHT COLUMN: Sticky Sidebar containing Events / Trending Stories */}
          <aside className="lg:col-span-4 lg:border-l lg:border-[#E5E2DA] lg:pl-8 space-y-8 h-fit lg:sticky lg:top-24">
            <div className="border-b border-burnt-brown pb-3">
              <span className="font-sans text-[11px] font-black tracking-widest uppercase text-burnt-brown">
                Trending Stories
              </span>
            </div>

            {/* Clean Boxed Cards Container */}
            <div className="space-y-4">
              {trendingStories.map((trend, index) => (
                <div
                  key={trend.id}
                  onClick={() => navigate(`/storydetails/${trend.url}/${trend.id}`)}
                  className="group cursor-pointer flex gap-4 p-4 border border-[#E5E2DA] bg-[#FDFDFC] hover:bg-[#F9F7F2] rounded-sm hover:shadow-xs transition-all duration-300 items-center"
                >
                  <span className="font-serif font-black italic text-2xl text-burnt-brown/30 group-hover:text-burnt-brown transition-colors">
                    {index + 1}
                  </span>
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown block">
                      {trend.category_name}
                    </span>
                    <h4 className="font-serif text-xs sm:text-sm font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
                      {trend.title}
                    </h4>
                  </div>

                  {trend.image_urls?.[0] && (
                    <div className="w-12 h-12 overflow-hidden shrink-0 aspect-square bg-cream/20 border border-[#E5E2DA]">
                      <img
                        src={trend.image_urls[0]}
                        alt={trend.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* BOTTOM PANEL: Related Reading Section */}
        {relatedStories.length > 0 && (
          <section className="mt-20 pt-12 border-t-2 border-[#E5E2DA] space-y-8">
            <div className="border-b border-[#E5E2DA] pb-4">
              {/* Maximized Section Header */}
              <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                Related Reading
              </h2>
              <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-muted-ink mt-1 block">
                Handpicked articles curated under {story.category_name}
              </span>
            </div>

            {/* Boxed Related Reading Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedStories.map((relStory) => (
                <article
                  key={relStory.id}
                  onClick={() => navigate(`/storydetails/${relStory.url}/${relStory.id}`)}
                  className="group cursor-pointer flex flex-row sm:flex-col gap-4 sm:gap-0 border border-[#E5E2DA] bg-[#FDFDFC] hover:bg-[#F9F7F2] p-3 sm:p-0 rounded-sm hover:shadow-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="overflow-hidden bg-cream/30 aspect-video w-20 sm:w-full shrink-0 border-b-0 sm:border-b border-[#E5E2DA]">
                    {relStory.image_urls?.[0] ? (
                      <img
                        src={relStory.image_urls[0]}
                        alt={relStory.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cream/20">
                        <span className="text-[8px] text-muted-ink tracking-widest uppercase">No Visual</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5 flex-1 min-w-0 sm:p-4">
                    <span className="font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown">
                      {relStory.category_name}
                    </span>
                    <h3 className="font-serif text-sm font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
                      {relStory.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Reusable Image Gallery Lightbox Overlay */}
      <ImageLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}