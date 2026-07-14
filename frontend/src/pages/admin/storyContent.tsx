import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, Calendar, Eye, Image as ImageIcon, Video, 
  Music, Pencil, Trash2, Plus, X, Globe, FileText, CheckCircle 
} from "lucide-react";
import { VideoEmbed , MusicEmbed } from "../../components/MediaEmbeds";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [publishingConfirm, setPublishingConfirm] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false); 
  const [scheduledDate, setScheduledDate] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]); 
  const [musicUrls, setMusicUrls] = useState<string[]>([]); 
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token'); 
    return { headers: { Authorization: `Bearer ${token}` } };
  };
    
  const getStory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/story/admin/${id}`, getAuthHeader());
      const data = response.data.result;
      setStory(data);
      
      setTitle(data.title || '');
      setContent(data.content || '');
      setPublished(data.published ?? false);
      setScheduledDate(data.scheduled_date ? data.scheduled_date.split('T')[0] : '');
      setVideoUrls(data.video_urls || []);
      setMusicUrls(data.music_urls || []);
      setExistingImages(data.image_urls || []);
      setNewImageFiles([]);
    } catch(error) {
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Failed to fetch story details');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getStory();
  }, [id]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:8000/story/admin/${id}`, getAuthHeader());
      navigate('/admin', { state: { message: response.data.message } });
    } catch(error) {
      setDeleting(false);
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Deletion failed');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublishDirectly = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('url', generateSlug(title));
      formData.append('published', 'true');
      formData.append('scheduled_date', ''); 
      formData.append('category_id', story?.category_id || '');
      formData.append('video_urls', JSON.stringify(videoUrls));
      formData.append('music_urls', JSON.stringify(musicUrls));
      formData.append('existing_images', JSON.stringify(existingImages));

      await axios.patch(`http://localhost:8000/story/admin/${id}`, formData, getAuthHeader());
      setPublishingConfirm(false);
      await getStory();
    } catch(error) {
      setPublishingConfirm(false);
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Publish operations failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const computedUrlSlug = generateSlug(title);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('url', computedUrlSlug);
      formData.append('published', String(published));
      formData.append('scheduled_date', published ? '' : scheduledDate);
      formData.append('category_id', story?.category_id || '');
      formData.append('video_urls', JSON.stringify(videoUrls));
      formData.append('music_urls', JSON.stringify(musicUrls));
      formData.append('existing_images', JSON.stringify(existingImages));

      newImageFiles.forEach((file) => {
        formData.append('image_urls', file); 
      });

      const response = await axios.patch(`http://localhost:8000/story/admin/${id}`, formData, {
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message);
      setEditing(false);
      await getStory();
    } catch(error) {
      if(axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Failed to update story');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const chosenFile = e.target.files[0];

    if (replaceIndex !== null) {
      setExistingImages(prev => prev.filter((_, idx) => idx !== replaceIndex));
      setNewImageFiles(prev => [...prev, chosenFile]);
      setReplaceIndex(null);
    } else {
      if (existingImages.length + newImageFiles.length < 10) {
        setNewImageFiles(prev => [...prev, chosenFile]);
      }
    }
    e.target.value = '';
  };

  const triggerReplacementPicker = (indexToReplace: number) => {
    setReplaceIndex(indexToReplace);
    fileInputRef.current?.click();
  };

  const removeNewUploadedImage = (indexToRemove: number) => {
    setNewImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const totalImageCount = existingImages.length + newImageFiles.length;

  if (loading && !editing && !deleting && !publishingConfirm) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-pulse font-sans font-extrabold text-xs tracking-widest uppercase text-burnt-brown">
          Processing Request Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-20 selection:bg-cream selection:text-burnt-brown">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-ink hover:text-burnt-brown transition-colors font-sans text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {!story?.published && !editing && (
              <button 
                onClick={() => setPublishingConfirm(true)}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Globe className="size-3.5" />
                Publish Story
              </button>
            )}
            <button 
              onClick={() => setEditing(!editing)}
              className={`p-2 transition-colors cursor-pointer ${editing ? 'text-burnt-brown' : 'text-muted-ink hover:text-ink'}`}
              title="Toggle Edit Canvas"
            >
              <Pencil className="size-4" />
            </button>
            <button 
              onClick={() => setDeleting(true)}
              className="p-2 text-muted-ink hover:text-red-600 transition-colors cursor-pointer" 
              title="Purge Document"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {message && (
          <div className="mb-8 bg-cream/20 border-l border-burnt-brown text-ink px-4 py-3 text-xs tracking-wide font-sans font-medium flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage('')}><X className="size-3" /></button>
          </div>
        )}

        {editing ? (
          <form onSubmit={handleEditSubmit} className="bg-white border border-gray-200 p-6 md:p-10 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Edit Story Configuration</h2>
              <p className="text-muted-ink font-sans text-xs tracking-normal mt-0.5">Slug generation runs directly in the layout background context.</p>
            </div>

            <div>
              <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink mb-1.5">Core Story Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-canvas border border-gray-200 px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-burnt-brown transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink mb-1.5">Editorial Content Box</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows={12}
                className="w-full bg-canvas border border-gray-200 px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-burnt-brown transition-colors whitespace-pre-wrap"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border border-gray-100">
              <div>
                <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink mb-1.5">Workflow Lifecycle State</label>
                <select 
                  value={String(published)}
                  onChange={(e) => setPublished(e.target.value === 'true')}
                  className="bg-white border border-gray-200 px-3 py-2 font-sans text-xs font-bold tracking-wider uppercase text-ink outline-none focus:border-burnt-brown cursor-pointer w-full"
                >
                  <option value="true">Published</option>
                  <option value="false">Save to Draft Mode</option>
                </select>
              </div>

              <div>
                <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink mb-1.5">Scheduling Target Block</label>
                <input 
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  disabled={published}
                  className={`w-full bg-white border border-gray-200 px-3 py-1.5 font-sans text-xs text-ink outline-none focus:border-burnt-brown ${published ? 'opacity-40 cursor-not-allowed bg-gray-100' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink mb-3">
                Image Matrix Storage ({totalImageCount} / 10 Allocations Max)
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {existingImages.map((imgUrl, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square border border-gray-200 group bg-gray-50">
                    <img src={imgUrl} className="w-full h-full object-cover" alt="Stored node" />
                    <button 
                      type="button"
                      onClick={() => triggerReplacementPicker(idx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-sans text-[9px] text-white tracking-widest uppercase font-bold cursor-pointer"
                    >
                      Replace Asset
                    </button>
                  </div>
                ))}

                {newImageFiles.map((file, idx) => {
                  const localUrl = URL.createObjectURL(file);
                  return (
                    <div key={`new-${idx}`} className="relative aspect-square border border-amber-300 group bg-gray-50">
                      <img src={localUrl} className="w-full h-full object-cover" alt="Pending node" />
                      <button 
                        type="button"
                        onClick={() => removeNewUploadedImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-none cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[8px] font-sans font-bold uppercase tracking-wider text-center py-0.5">Staged</span>
                    </div>
                  );
                })}

                {totalImageCount < 10 && (
                  <button 
                    type="button"
                    onClick={() => { setReplaceIndex(null); fileInputRef.current?.click(); }}
                    className="aspect-square border-2 border-dashed border-gray-200 hover:border-burnt-brown transition-colors flex flex-col items-center justify-center text-muted-ink gap-1 cursor-pointer bg-canvas"
                  >
                    <Plus className="size-4" />
                    <span className="font-sans text-[9px] tracking-widest font-extrabold uppercase">Add Photo</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink">Video Platform Links Matrix</label>
                  <button 
                    type="button" 
                    onClick={() => setVideoUrls([...videoUrls, ''])}
                    className="text-[10px] font-sans font-extrabold tracking-widest uppercase text-burnt-brown hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" /> Add Link
                  </button>
                </div>
                {videoUrls.map((urlStr, idx) => (
                  <div key={`video-in-${idx}`} className="flex gap-2 items-center mb-2">
                    <input 
                      type="text" 
                      value={urlStr} 
                      onChange={(e) => {
                        const next = [...videoUrls];
                        next[idx] = e.target.value;
                        setVideoUrls(next);
                      }}
                      placeholder="Paste YouTube, TikTok or Instagram Video Link"
                      className="flex-1 bg-canvas border border-gray-200 px-3 py-1.5 font-sans text-xs text-ink outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => setVideoUrls(videoUrls.filter((_, i) => i !== idx))}
                      className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-sans text-[10px] font-extrabold tracking-widest uppercase text-muted-ink">Music Stream Links Matrix</label>
                  <button 
                    type="button" 
                    onClick={() => setMusicUrls([...musicUrls, ''])}
                    className="text-[10px] font-sans font-extrabold tracking-widest uppercase text-burnt-brown hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" /> Add Track
                  </button>
                </div>
                {musicUrls.map((urlStr, idx) => (
                  <div key={`music-in-${idx}`} className="flex gap-2 items-center mb-2">
                    <input 
                      type="text" 
                      value={urlStr} 
                      onChange={(e) => {
                        const next = [...musicUrls];
                        next[idx] = e.target.value;
                        setMusicUrls(next);
                      }}
                      placeholder="Paste Spotify, Audiomack or Apple Music Link"
                      className="flex-1 bg-canvas border border-gray-200 px-3 py-1.5 font-sans text-xs text-ink outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => setMusicUrls(musicUrls.filter((_, i) => i !== idx))}
                      className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100 justify-end">
              <button 
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-200 text-ink font-sans text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-burnt-brown hover:bg-[#342013] text-canvas font-sans text-xs font-bold tracking-widest uppercase transition-colors shadow-xs cursor-pointer"
              >
                Save Engine Parameters
              </button>
            </div>
          </form>
        ) : (
          story && (
            <article className="bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
              {story.image_urls && story.image_urls.length > 0 && (
                <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gray-50 overflow-hidden relative border-b border-gray-100">
                  <img src={story.image_urls[0]} alt="Story Layout Cover" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-extrabold text-[10px] tracking-widest text-burnt-brown uppercase bg-cream/30 px-2.5 py-1">
                      {story.category_name || "Editorial Entry"}
                    </span>
                    {story.published ? (
                      <span className="bg-emerald-600 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1">Published</span>
                    ) : (
                      <span className="bg-amber-500 text-white font-sans text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1">Draft</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-muted-ink font-sans text-[10px] font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-1.5"><Eye className="size-3.5" /><span>{story.views || 0} Reads</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="size-3.5" /><span>{new Date(story.created_at).toLocaleDateString()}</span></div>
                  </div>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight text-ink mb-8">
                  {story.title}
                </h1>

                <div className="font-sans text-base md:text-lg text-gray-800 leading-relaxed tracking-normal whitespace-pre-wrap mb-12">
                  {story.content || "No text payload configuration processed."}
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 space-y-6">
                  <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FileText className="size-4 text-burnt-brown" /> Integrated Media Engine Views
                  </h3>

                  {(!story.video_urls?.length && !story.music_urls?.length && story.image_urls?.length <= 1) ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white border border-gray-100 p-3">
                        <div className="bg-cream/50 p-2 text-burnt-brown"><ImageIcon className="size-5" /></div>
                        <div>
                          <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">Images</p>
                          <p className="font-serif text-lg font-bold text-ink leading-none mt-1">{story.image_urls?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white border border-gray-100 p-3">
                        <div className="bg-gray-100 p-2 text-ink"><Video className="size-5" /></div>
                        <div>
                          <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">Videos</p>
                          <p className="font-serif text-lg font-bold text-ink leading-none mt-1">0</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white border border-gray-100 p-3">
                        <div className="bg-gray-100 p-2 text-ink"><Music className="size-5" /></div>
                        <div>
                          <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-muted-ink">Audio Tracks</p>
                          <p className="font-serif text-lg font-bold text-ink leading-none mt-1">0</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {story.image_urls && story.image_urls.length > 1 && (
                        <div>
                          <h4 className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink mb-2">Gallery Matrix Assets</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {story.image_urls.slice(1).map((urlStr, index) => (
                              <a href={urlStr} target="_blank" rel="noreferrer" key={index} className="aspect-square border border-gray-200 overflow-hidden block">
                                <img src={urlStr} alt="Internal asset segment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {story.video_urls && story.video_urls.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink">Embedded Video Streams</h4>
                          {story.video_urls.map((vUrl, index) => <VideoEmbed key={index} rawUrl={vUrl} />)}
                        </div>
                      )}

                      {story.music_urls && story.music_urls.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink">Embedded Audio Components</h4>
                          {story.music_urls.map((mUrl, index) => <MusicEmbed key={index} rawUrl={mUrl} />)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        )}
      </main>

      {/* Confirmation Modal Overlay Pipeline */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-200 max-w-sm w-full p-6 text-center shadow-lg">
            <h3 className="font-serif text-lg font-bold text-ink mb-2">Purge Content Record</h3>
            <p className="font-sans text-xs text-muted-ink mb-6">Are you sure you want to permanently drop this row asset and its associated Cloudinary files?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setDeleting(false)} className="px-4 py-2 border border-gray-200 text-ink font-sans text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {publishingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-200 max-w-sm w-full p-6 text-center shadow-lg">
            <CheckCircle className="size-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-ink mb-2">Publish Engine Ready</h3>
            <p className="font-sans text-xs text-muted-ink mb-6">This flags the story as live, wiping any scheduled draft timestamp parameters. Run transmission?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setPublishingConfirm(false)} className="px-4 py-2 border border-gray-200 text-ink font-sans text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handlePublishDirectly} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer">Go Live</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}