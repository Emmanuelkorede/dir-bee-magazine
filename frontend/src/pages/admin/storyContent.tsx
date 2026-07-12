import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Eye, Image as ImageIcon, Video, Music, Pencil, Trash2 } from "lucide-react";

type Story = {
  id: string;
  admin_user_id: string;
  category_id: string;
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
  category_name: string;
  category_url: string; 
}

export default function StoryContent() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState(false);
  const[editing , setEditing] = useState(false) ; 
  const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [url, setUrl] = useState('');
const [published, setPublished] = useState(true); 
const [scheduledDate, setScheduledDate] = useState('');
const [categoryId, setCategoryId] = useState('');
const [videoUrls, setVideoUrls] = useState([]); 
const [musicUrls, setMusicUrls] = useState([]); 
const [updatedAt, setUpdatedAt] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token'); 
    return { headers: { Authorization: `Bearer ${token}` } };
  }
    
  const getStory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/story/admin/${id}`, getAuthHeader());
      
      setStory(response.data.result);
    } catch(error) {
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Failed to fetch story details');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getStory();
    }
  }, [id]);

  const handleDelete = async (id : string) => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:8000/story/admin/${id}`, getAuthHeader());
      
      setMessage(response.data.message);
    } catch(error) {
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Failed to fetch story details');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = async (id :string) => {
    try {
       const payload =  { title, content, url, published, scheduled_date, category_id, video_urls, music_urls , updated_at } ;
       const response = await axios.patch(`http://localhost:8000/story/admin/${id}`,payload ,  getAuthHeader());
      setMessage(response.data.message);
    } catch(error) {
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Failed to fetch story details');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-pulse font-sans font-extrabold text-xs tracking-widest uppercase text-burnt-brown">
          Retrieving Editorial...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-20 selection:bg-cream selection:text-burnt-brown">
      {/* Editorial Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ink hover:text-burnt-brown transition-colors font-sans text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back to Stories
          </button>

          {/* Admin Action Controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-ink hover:text-ink transition-colors cursor-pointer" title="Edit Story">
              <Pencil className="size-4" />
            </button>
            <button className="p-2 text-muted-ink hover:text-red-600 transition-colors cursor-pointer" title="Delete Story" onClick={setDeleting(true)}>
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </header>


     {editing === true  ? 
     <>
     <button onClick={() => handleEdit(story?.id)}>Save</button>
     <button onClick={() => setEditing(false)}>Cancel</button>
     </>
     :
           <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {message && (
          <div className="mb-8 bg-red-50 border-l border-red-500 text-red-700 px-4 py-3 text-xs tracking-wide font-sans font-medium">
            {message}
          </div>
        )}

        {!story && !message ? (
          <div className="text-center py-20 border border-dashed border-gray-200 bg-white">
            <p className="font-serif text-lg text-muted-ink italic">Story payload could not be located.</p>
          </div>
        ) : story && (
          <article className="bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            
            {/* Hero Cover Image (Uses the first image if available) */}
            {story.image_urls && story.image_urls.length > 0 && (
              <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gray-100 overflow-hidden relative">
                <img 
                  src={story.image_urls[0]} 
                  alt="Story Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Meta Tags & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="font-sans font-extrabold text-[10px] tracking-widest text-burnt-brown uppercase bg-cream/30 px-2.5 py-1">
                    {story.category_name || story.category_id.slice(0,8)}
                  </span>
                  {story.published ? (
                    <span className="bg-emerald-600 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1">
                      Published
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-muted-ink font-sans text-[10px] font-bold tracking-widest uppercase">
                  <div className="flex items-center gap-1.5">
                    <Eye className="size-3.5" />
                    <span>{story.views || 0} Reads</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>{new Date(story.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Title & Body */}
              <h1 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight text-ink mb-8">
                {story.title}
              </h1>

              <div className="font-sans text-base md:text-lg text-gray-800 leading-relaxed tracking-normal whitespace-pre-wrap mb-12">
                {story.content || "No editorial content written yet."}
              </div>

              {/* Attached Media Asset Database */}
              <div className="bg-gray-50 border border-gray-100 p-6">
                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-4 pb-2 border-b border-gray-200">
                  Attached Media Assets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Images Summary */}
                  <div className="flex items-center gap-3 bg-white border border-gray-100 p-3">
                    <div className="bg-cream/50 p-2 text-burnt-brown">
                      <ImageIcon className="size-5" />
                    </div>
                    <div>
                      <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">Images</p>
                      <p className="font-serif text-lg font-bold text-ink leading-none mt-1">{story.image_urls?.length || 0}</p>
                    </div>
                  </div>

                  {/* Videos Summary */}
                  <div className="flex items-center gap-3 bg-white border border-gray-100 p-3">
                    <div className="bg-gray-100 p-2 text-ink">
                      <Video className="size-5" />
                    </div>
                    <div>
                      <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">Videos</p>
                      <p className="font-serif text-lg font-bold text-ink leading-none mt-1">{story.video_urls?.length || 0}</p>
                    </div>
                  </div>

                  {/* Audio Summary */}
                  <div className="flex items-center gap-3 bg-white border border-gray-100 p-3">
                    <div className="bg-gray-100 p-2 text-ink">
                      <Music className="size-5" />
                    </div>
                    <div>
                      <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">Audio Tracks</p>
                      <p className="font-serif text-lg font-bold text-ink leading-none mt-1">{story.music_urls?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </article>
        )}
      </main>
     }

      {deleting && <div>
        ARE YOU SURE YOU WANT TO delete 
        <button onClick={() => handleDelete(story?.id)}>yes</button>
        <button onClick={setDeleting(false)}>no</button>
        </div>}
    </div>
  );
}