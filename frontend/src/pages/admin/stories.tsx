import FormComponent from "../../components/FormComponent";
import React, { useEffect, useState } from "react";
import DashboardMenu from "../../components/dashboardMenu";
import axios from "axios";
import { 
  X, 
  Plus, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Calendar, 
  FolderOpen, 
  Save, 
  Loader2, 
  FileText, 
  Eye 
} from "lucide-react";

type CategoryType = {
  id: string;
  name: string;
  url: string;
  created_at: string;
};

type ImageStateItem = {
  file: File;
  preview: string;
};

export default function AdminStories() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(true); 
    const [scheduledDate, setScheduledDate] = useState('');
    const [videoUrls, setVideoUrls] = useState<string[]>([]); 
    const [musicUrls, setMusicUrls] = useState<string[]>([]); 
    const [imageFiles, setImageFiles] = useState<ImageStateItem[]>([]); 
    const [message , setMessage] = useState('') ;
    const [loading , setLoading] = useState(false) ;
    const [categories , setCategories] = useState<CategoryType[]>([]) ; 
    const [chosenCatId  ,setChosenCatId] = useState('') ; 

    const getAuthHeader = () => {
        const token = localStorage.getItem('token') ; 
        return { headers: { Authorization: `Bearer ${token}` } };
    }

    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') 
        .replace(/[\s_-]+/g, '-') 
        .replace(/^-+|-+$/g, ''); 
    };

    // LOGIC ADDED: Allows choosing multiple files at once while strictly enforcing a cap of 10.
    const handefileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const currentCount = imageFiles.length;
            const remainingSpace = 10 - currentCount;

            if (remainingSpace <= 0) {
                setMessage("Upload limit reached. Maximum of 10 image assets allowed.");
                return;
            }

            // Slice selected files to prevent exceeding 10 total
            const filesArray = Array.from(files).slice(0, remainingSpace);
            
            const newStagedFiles = filesArray.map((file) => ({
                file,
                preview: URL.createObjectURL(file)
            }));

            setImageFiles([...imageFiles, ...newStagedFiles]);
        }
    };

    const handlegetCategories = async () => {
        setMessage('') ; 
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/category/' , getAuthHeader()) ; 
            setCategories(response.data.result);
            if(response.data.result?.length > 0) {
              setChosenCatId(response.data.result[0].id);
            }
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

    const hanldeSubmit = async () => {
        setLoading(true);
        setMessage('');
        try {
            const url = generateSlug(title);
            
            // LOGIC ADDED: Safely converts standard HTML picker date string to Database-friendly ISO TIMESTAMPTZ
            let formattedTimestamp = scheduledDate;
            if (scheduledDate) {
                try {
                    formattedTimestamp = new Date(scheduledDate).toISOString();
                } catch (err) {
                    console.error("Timestamp conversion exception: ", err);
                }
            }
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('url', url);
            formData.append('published', String(published));
            formData.append('scheduled_date', formattedTimestamp);
            formData.append('category_id', chosenCatId);
            
            formData.append('video_urls', JSON.stringify(videoUrls));
            formData.append('music_urls', JSON.stringify(musicUrls));

            imageFiles.forEach((item) => {
              formData.append('image_urls', item.file);
            });

            const response = await axios.post('http://localhost:8000/story/admin/', formData, {
              headers: {
                ...getAuthHeader().headers,
                'Content-Type': 'multipart/form-data'
              }
            }); 
            setMessage(response.data.message) ; 
        } 
        catch (error) {
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
     handlegetCategories() ; 
    } , []);

    if(loading && categories.length === 0) {
        return (
          <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center font-serif text-[var(--color-muted-ink)]">
            <Loader2 className="animate-spin size-8 text-[var(--color-burnt-brown)] mb-2" />
            <p className="text-xs uppercase tracking-widest font-bold">Initializing Narrative Core...</p>
          </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-canvas)] font-sans text-[var(--color-ink)] selection:bg-[var(--color-cream)]">
            <DashboardMenu />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Action Strip */}
                <div className="border-b border-[var(--color-burnt-brown)]/15 pb-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-serif text-[var(--color-burnt-brown)] tracking-tight">STORY STUDIO</h1>
                        <p className="text-xs text-[var(--color-muted-ink)] mt-1 uppercase tracking-wider">Draft, schedule, and attach multimedia modules to core narrative nodes.</p>
                    </div>
                    
                    <button 
                        onClick={hanldeSubmit}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 bg-[var(--color-burnt-brown)] hover:opacity-90 active:opacity-100 text-[var(--color-canvas)] font-serif font-bold uppercase tracking-wider text-xs px-6 py-3.5 cursor-pointer transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
                        {loading ? 'Processing...' : 'Publish Story Node'}
                    </button>
                </div>

                {/* Status Banners */}
                {message && (
                    <div className="mb-6 p-4 bg-[var(--color-cream)]/20 border-l-4 border-[var(--color-burnt-brown)] text-[var(--color-burnt-brown)] font-serif text-xs flex items-center justify-between shadow-xs">
                        <span>{message}</span>
                        <button onClick={() => setMessage('')} className="text-[var(--color-burnt-brown)] hover:opacity-75 transition-opacity cursor-pointer"><X className="size-4" /></button>
                    </div>
                )}

                {/* Adaptive Two-Column Grid Setup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Primary Form Container */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-[var(--color-burnt-brown)]/10 p-6 space-y-5 shadow-xs">
                            <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-burnt-brown)]/5">
                                <FileText className="size-4 text-[var(--color-burnt-brown)]" />
                                <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-[var(--color-muted-ink)]">Core Content Fields</h2>
                            </div>
                            
                            <FormComponent id="title" label="Story Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
                            
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="content" className="block text-xs font-serif font-bold uppercase tracking-widest text-[var(--color-ink)]">Content Body</label>
                                <textarea 
                                    id="content"
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full border border-[var(--color-burnt-brown)]/20 px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-burnt-brown)] focus:ring-1 focus:ring-[var(--color-burnt-brown)] font-serif leading-relaxed transition-all bg-[var(--color-canvas)]/50"
                                    placeholder="Write your story context or script parameters here..."
                                />
                            </div>
                        </div>

                        {/* Video Links Module */}
                        <div className="bg-white border border-[var(--color-burnt-brown)]/10 p-6 shadow-xs">
                            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-burnt-brown)]/5 mb-4">
                                <div className="flex items-center gap-2">
                                    <Video className="size-4 text-[var(--color-burnt-brown)]" />
                                    <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-[var(--color-muted-ink)]">Video Integration ({videoUrls.length})</h2>
                                </div>
                                <button 
                                    onClick={() => setVideoUrls([...videoUrls, ''])}
                                    className="inline-flex items-center gap-1 border border-[var(--color-burnt-brown)]/20 hover:border-[var(--color-burnt-brown)] hover:text-[var(--color-burnt-brown)] text-[var(--color-muted-ink)] font-serif text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer bg-[var(--color-canvas)]"
                                >
                                    <Plus className="size-3" /> Add Array Element
                                </button>
                            </div>

                            {videoUrls.length === 0 ? (
                                <p className="text-xs text-[var(--color-muted-ink)] font-serif italic text-center py-4">No third-party video paths mapped to this node</p>
                            ) : (
                                <div className="space-y-3">
                                    {videoUrls.map((str, idx) => (
                                        <div key={`video-in-${idx}`} className="flex items-end gap-2 bg-[var(--color-canvas)]/40 p-3 border border-[var(--color-burnt-brown)]/10">
                                            <div className="flex-1">
                                                <FormComponent id={`videoUrl-${idx}`} label={`Stream Anchor Path #${idx + 1}`} value={str} onChange={(e) => {
                                                    const next = [...videoUrls]; 
                                                    next[idx] = e.target.value;  
                                                    setVideoUrls(next);
                                                }} type="text" />
                                            </div>
                                            <button 
                                                onClick={() => setVideoUrls(videoUrls.filter((_, i) => i !== idx))}
                                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 border border-red-100 hover:border-red-600 transition-colors cursor-pointer h-[38px] flex items-center justify-center shadow-2xs"
                                                title="Delete Row"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Music Links Module */}
                        <div className="bg-white border border-[var(--color-burnt-brown)]/10 p-6 shadow-xs">
                            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-burnt-brown)]/5 mb-4">
                                <div className="flex items-center gap-2">
                                    <Music className="size-4 text-[var(--color-burnt-brown)]" />
                                    <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-[var(--color-muted-ink)]">Audio Orchestration ({musicUrls.length})</h2>
                                </div>
                                <button 
                                    onClick={() => setMusicUrls([...musicUrls, ''])}
                                    className="inline-flex items-center gap-1 border border-[var(--color-burnt-brown)]/20 hover:border-[var(--color-burnt-brown)] hover:text-[var(--color-burnt-brown)] text-[var(--color-muted-ink)] font-serif text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer bg-[var(--color-canvas)]"
                                >
                                    <Plus className="size-3" /> Add Array Element
                                </button>
                            </div>

                            {musicUrls.length === 0 ? (
                                <p className="text-xs text-[var(--color-muted-ink)] font-serif italic text-center py-4">No ambient audio tracks mapped to this node</p>
                            ) : (
                                <div className="space-y-3">
                                    {musicUrls.map((str, idx) => (
                                        <div key={`music-in-${idx}`} className="flex items-end gap-2 bg-[var(--color-canvas)]/40 p-3 border border-[var(--color-burnt-brown)]/10">
                                            <div className="flex-1">
                                                <FormComponent id={`musicUrl-${idx}`} label={`Soundscape Path #${idx + 1}`} value={str} onChange={(e) => {
                                                    const next = [...musicUrls]; 
                                                    next[idx] = e.target.value; 
                                                    setMusicUrls(next);
                                                }} type="text"  />
                                            </div>
                                            <button 
                                                onClick={() => setMusicUrls(musicUrls.filter((_, i) => i !== idx))} 
                                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 border border-red-100 hover:border-red-600 transition-colors cursor-pointer h-[38px] flex items-center justify-center shadow-2xs"
                                                title="Delete Row"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Configuration Panel */}
                    <div className="space-y-6">
                        {/* Publishing Meta Controls */}
                        <div className="bg-white border border-[var(--color-burnt-brown)]/10 p-6 space-y-5 shadow-xs">
                            <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-burnt-brown)]/5">
                                <Eye className="size-4 text-[var(--color-burnt-brown)]" />
                                <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-[var(--color-muted-ink)]">Visibility & Taxonomy</h2>
                            </div>

                            {/* Custom Toggle Switch Component */}
                            <div className="flex items-center justify-between bg-[var(--color-canvas)]/50 p-3 border border-[var(--color-burnt-brown)]/10">
                                <span className="text-xs font-serif font-bold uppercase tracking-widest text-[var(--color-ink)]">Visibility State</span>
                                <button 
                                    type="button"
                                    onClick={() => setPublished(!published)}
                                    className={`font-serif text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-all cursor-pointer ${
                                        published 
                                          ? 'bg-[var(--color-burnt-brown)] border-[var(--color-burnt-brown)] text-[var(--color-canvas)]' 
                                          : 'bg-white border-[var(--color-burnt-brown)]/20 text-[var(--color-muted-ink)] hover:bg-[var(--color-canvas)]'
                                    }`}
                                >
                                    {published ? 'Publishing live' : 'Saved to drafts'}
                                </button>
                            </div>

                            {/* Dropdown Field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-widest text-[var(--color-ink)]">
                                    <FolderOpen className="size-3.5 text-[var(--color-muted-ink)]" /> Engine Taxonomy Group
                                </label>
                                <select 
                                    value={chosenCatId} 
                                    onChange={(e) => setChosenCatId(e.target.value)}
                                    className="w-full border border-[var(--color-burnt-brown)]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-burnt-brown)] focus:ring-1 focus:ring-[var(--color-burnt-brown)] font-sans transition-all cursor-pointer rounded-none h-[38px]"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Field Wrapper */}
                            <div className="flex flex-col gap-1.5">
                                <label className="inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-widest text-[var(--color-ink)]">
                                    <Calendar className="size-3.5 text-[var(--color-muted-ink)]" /> Release Schedule Timestamp
                                </label>
                                <FormComponent id="scheduled_date" label="" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} type="date" />
                            </div>
                        </div>

                        {/* Image Media Upload Pipeline */}
                        <div className="bg-white border border-[var(--color-burnt-brown)]/10 p-6 space-y-4 shadow-xs">
                            <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-burnt-brown)]/5">
                                <ImageIcon className="size-4 text-[var(--color-burnt-brown)]" />
                                <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-[var(--color-muted-ink)]">Image Assets ({imageFiles.length}/10)</h2>
                            </div>

                            {/* Custom Styled File Input Trigger */}
                            <div className="relative group border-2 border-dashed border-[var(--color-burnt-brown)]/20 hover:border-[var(--color-burnt-brown)] transition-colors p-4 text-center cursor-pointer bg-[var(--color-canvas)]/30">
                                {/* FIX: 'multiple' attribute appended dynamically */}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    onChange={handefileChange}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                />
                                <div className="space-y-1 text-[var(--color-muted-ink)] font-serif">
                                    <Plus className="size-5 mx-auto text-[var(--color-muted-ink)] group-hover:text-[var(--color-burnt-brown)] transition-colors" />
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink)]">Select Image Binary</p>
                                    <p className="text-[9px] text-[var(--color-muted-ink)]">Select up to 10 PNG, JPG files</p>
                                </div>
                            </div>

                            {/* Visual Local Image Grid Preview */}
                            {imageFiles.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    {imageFiles.map((imgObj, idx) => (
                                        <div key={`img-in-${idx}`} className="relative aspect-square border border-[var(--color-cream)] group bg-[var(--color-canvas)] overflow-hidden"> 
                                            <img src={imgObj.preview} className="w-full h-full object-cover" alt="Staged story file" />
                                            <button 
                                                type="button"
                                                onClick={() => setImageFiles(imageFiles.filter((_ , i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 hover:bg-red-700 transition-colors cursor-pointer shadow-md"
                                                title="Remove Image"
                                            >
                                                <X className="size-3" />
                                            </button>
                                            <span className="absolute bottom-0 inset-x-0 bg-[var(--color-burnt-brown)] text-[var(--color-cream)] text-[8px] font-serif font-bold uppercase tracking-widest text-center py-0.5 opacity-95">
                                                Staged Array
                                            </span>
                                        </div>
                                    ))} 
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}