import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { MusicEmbed, VideoEmbed } from "../../components/MediaEmbeds";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Loader2, Calendar, Eye, ArrowLeft, Disc, Video, Images } from "lucide-react";

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

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getStoryDetails = async () => {
  if (!id || !url) return null;
  try {
    // 1. Fetch story using clean slash parameters
    const response = await axios.get(`http://localhost:8000/story/${url}/${id}`, getAuthHeader());
    const fetchedStory = response.data.result;
    setStory(fetchedStory);
    console.log("Current Story:", fetchedStory);
    
    // Fire the view counter silently
    await axios.patch(`http://localhost:8000/story/${id}/view`);
    
    // Return the story so our loader can use its category_url!
    return fetchedStory;
  } catch (error) {
    console.error("Error fetching story details:", error);
    setMessage("Failed to load the article details.");
    return null;
  }
};

const getCategoryAndTrending = async (activeCategoryUrl: string) => {
  try {
    // 2. Fetch category-specific stories using the REAL category slug from the story object
    if (activeCategoryUrl) {
      const catResponse = await axios.get(`http://localhost:8000/story/?category_url=${activeCategoryUrl}`, getAuthHeader());
      setCategoryStories(catResponse.data.result);
    }

    // 3. Fetch all stories globally to extract top-viewed trending content
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
  
  // First, get the story details so we can extract its category_url
  const currentStory = await getStoryDetails();
  
  if (currentStory && currentStory.category_url) {
    // Then, fetch context content based on that specific category URL
    await getCategoryAndTrending(currentStory.category_url);
  } else {
    // Fallback in case story fails to load or has no category
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

  // Exclude current story from related list
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

  const additionalImages = story.image_urls?.slice(1) || [];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-burnt-brown selection:text-canvas">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink hover:text-burnt-brown transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* 2-Column Grid Layout: Main & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          
          {/* Main Article Side */}
          <article className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
                {story.category_name}
              </span>
              
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-ink">
                {story.title}
              </h1>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 py-2 border-y border-[#E5E2DA] text-muted-ink text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(story.created_at)}
                </span>
                <span className="w-1 h-1 rounded-full bg-border-color/60" />
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {story.views} Views
                </span>
              </div>
            </div>

            {/* Primary Hero Image */}
            <div className="overflow-hidden bg-cream/25 aspect-[16/9] max-h-[480px] w-full border border-[#E5E2DA]">
              {story.image_urls?.[0] ? (
                <img
                  src={story.image_urls[0]}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-ink text-xs uppercase tracking-widest">No Image Available</span>
                </div>
              )}
            </div>

            {/* Content Text Body */}
            <div 
              className="prose prose-sm sm:prose max-w-none font-serif text-sm sm:text-base text-ink/90 leading-relaxed space-y-6 pt-4"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />

            {/* Additional Editorial Gallery Grid */}
            {additionalImages.length > 0 && (
              <div className="pt-8 border-t border-[#E5E2DA]">
                <div className="flex items-center gap-2 mb-4">
                  <Images className="w-4 h-4 text-burnt-brown" />
                  <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown">
                    Visual Gallery
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {additionalImages.map((imgUrl, index) => (
                    <div 
                      key={index} 
                      className="overflow-hidden aspect-square bg-cream/15 border border-[#E5E2DA] group cursor-pointer"
                    >
                      <img
                        src={imgUrl}
                        alt={`Additional view ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrated Media Section */}
            {((story.music_urls && story.music_urls.length > 0) || 
              (story.video_urls && story.video_urls.length > 0)) && (
              <div className="pt-8 border-t border-[#E5E2DA] space-y-6">
                <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown block">
                  Media Attachments
                </span>
                
                {/* Audio Embeds */}
                {story.music_urls && story.music_urls.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <Disc className="w-4 h-4 animate-spin-slow text-muted-ink" />
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

                {/* Video Embeds */}
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

          {/* Sticky Editorial Sidebar */}
          <aside className="lg:col-span-4 lg:border-l lg:border-[#E5E2DA] lg:pl-8 space-y-8 h-fit lg:sticky lg:top-24">
            <div className="border-b border-burnt-brown pb-3">
              <span className="font-sans text-[11px] font-black tracking-widest uppercase text-burnt-brown">
                Trending Stories
              </span>
            </div>

            <div className="divide-y divide-[#E5E2DA]">
              {trendingStories.map((trend, index) => (
                <div
                  key={trend.id}
                  onClick={() => navigate(`/storydetails/${trend.url}/${trend.id}`)}
                  className="group cursor-pointer flex gap-4 py-4 first:pt-0 last:pb-0 items-start"
                >
                  <span className="font-serif font-black italic text-2xl text-burnt-brown/20 group-hover:text-burnt-brown transition-colors">
                    {index + 1}
                  </span>
                  
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown block">
                      {trend.category_name}
                    </span>
                    <h4 className="font-serif text-sm font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
                      {trend.title}
                    </h4>
                  </div>

                  {trend.image_urls?.[0] && (
                    <div className="w-14 h-14 overflow-hidden shrink-0 aspect-square bg-cream/20">
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

        {/* Bottom Panel: Related Stories Section */}
        {relatedStories.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#E5E2DA] space-y-6">
            <div className="border-b border-[#E5E2DA] pb-3">
              <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink">
                Related Reading
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedStories.map((relStory) => (
                <article
                  key={relStory.id}
                  onClick={() => navigate(`/storydetails/${relStory.url}/${relStory.id}`)}
                  className="group cursor-pointer flex flex-row sm:flex-col gap-3 items-start"
                >
                  <div className="overflow-hidden bg-cream/30 aspect-video w-20 sm:w-full shrink-0 border border-[#E5E2DA]">
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

                  <div className="flex flex-col space-y-1 flex-1 min-w-0">
                    <span className="font-sans text-[8px] font-extrabold tracking-widest uppercase text-burnt-brown">
                      {relStory.category_name}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-black tracking-tight leading-snug text-ink group-hover:text-burnt-brown transition-colors line-clamp-2">
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
    </div>
  );
}