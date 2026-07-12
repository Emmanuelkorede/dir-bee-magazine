import { useEffect, useState } from "react";
import DashboardMenu from "../../components/dashboardMenu" ;
import axios from "axios";
import { useNavigate } from "react-router";
import { Eye, Calendar, FileEdit, Plus } from "lucide-react";

type Stories = {
    id: string;
    admin_user_id: string;
    category_id: string;
    category_name : string ;
    category_url : string ; 
    title: string;
    content: string;
    url: string;
    published: boolean;
    views: number;
    created_at: string; 
    updated_at: string;
    scheduled_date: string;
    video_urls: string[];
    music_urls: string[];
    image_urls: string[]; 
}

export default function DashBoard() {
    const [message , setMessage] = useState('') ;
    const [stories ,setStories] = useState<Stories[]>([]) ;
    const [status , setStatus] = useState('') ;
    const navigate = useNavigate();

    const getAuthHeader =  () => {
        const token = localStorage.getItem('token') ; 
        return { headers: { Authorization: `Bearer ${token}` } };
    }


    const getStories = async () => {
        try {
            const params = new URLSearchParams();  ; 
            if(status) params.append('status' , status) ;
            const url = `http://localhost:8000/story/admin?${params.toString()}`
            const response = await axios.get(url , getAuthHeader()) ;
            setStories(response.data.result)
        } catch(error) {
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data.message)
            } else {
                setMessage('An unexpected error occurred')
            }
        }
    }
    

    useEffect(() => {
        getStories() ;
    } , [status])

    return (
    <div className="min-h-screen bg-canvas selection:bg-cream selection:text-burnt-brown">
      <DashboardMenu />
      
      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">
              Content Engine
            </h1>
            <p className="font-sans text-xs text-muted-ink mt-1 tracking-normal">
              Compose, update, and manage your multimedia stories.
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-end md:self-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="options" className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink">
                Filter:
              </label>
              <select 
                id="options"  
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="bg-white border border-gray-200 px-3 py-2 font-sans text-xs font-bold tracking-wider uppercase text-ink outline-none focus:border-burnt-brown cursor-pointer rounded-none"
              >
                <option value="">All Stories</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <button 
              onClick={() => navigate('/admin/stories/new')}
              className="inline-flex items-center justify-center gap-2 bg-burnt-brown hover:bg-[#342013] text-canvas font-sans text-xs font-bold tracking-widest uppercase px-4 py-2.5 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="size-4" />
              Write New Story
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 bg-red-50 border-l border-red-500 text-red-700 px-4 py-3 text-xs tracking-wide font-sans font-medium">
            {message}
          </div>
        )}

        {stories.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 bg-white">
            <p className="font-serif text-base text-muted-ink italic">No matching stories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div 
                key={story.id}
                onClick={() => navigate(`/admin/story/${story.id}`)}
                className="group bg-white border border-gray-200 flex flex-col justify-between cursor-pointer hover:border-burnt-brown transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
              >
                <div>
                  <div className="aspect-video w-full bg-gray-50 overflow-hidden relative border-b border-gray-100">
                    {story.image_urls && story.image_urls.length > 0 ? (
                      <img 
                        src={story.image_urls[0]} 
                        alt={story.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1.5 bg-[#FAF9F6]">
                        <FileEdit className="size-6 text-muted-ink/40" />
                        <span className="font-sans text-[10px] uppercase tracking-widest text-muted-ink/60 font-bold">No Cover Media</span>
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3">
                      {story.published ? (
                        <span className="bg-emerald-600 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 shadow-xs">
                          Published
                        </span>
                      ) : (
                        <span className="bg-amber-500 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 shadow-xs">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <span className="font-sans font-extrabold text-[10px] tracking-widest text-burnt-brown uppercase">
                      Category Name: {story.category_name}
                    </span>
                    
                    <h2 className="font-serif text-base font-bold text-ink leading-snug group-hover:text-burnt-brown transition-colors line-clamp-2">
                      {story.title}
                    </h2>
                    
                    <p className="font-sans text-xs text-muted-ink leading-relaxed line-clamp-2 tracking-normal">
                      {story.content || 'Empty draft configuration.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between font-sans text-[10px] text-muted-ink font-semibold tracking-wider uppercase">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3.5 text-ink/70" />
                    <span>{story.views || 0} Reads</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3.5 text-ink/70" />
                    <span>
                      {new Date(story.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}