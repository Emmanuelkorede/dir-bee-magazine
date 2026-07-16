import FormComponent from "../../components/FormComponent";
import  React, { useEffect, useState } from "react";
import DashboardMenu from "../../components/dashboardMenu";
import axios from "axios";

type CategoryType = {
  id: string;
  name: string;
  url: string;
  created_at: string;
};

type StoryInputType = {
  title: string;
  content: string;
  url: string;
  published: boolean;
  scheduled_date: string;
  category_id: string;
  video_urls: string[];
  music_urls: string[];
};

export default function AdminStories() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(true); 
    const [scheduledDate, setScheduledDate] = useState('');
    const [videoUrls, setVideoUrls] = useState<string[]>([]); 
    const [musicUrls, setMusicUrls] = useState<string[]>([]); 
    const [imageFiles, setImageFiles] = useState<string[]>([]); 
    const [message , setMessage] = useState('') ;
    const [loading , setLoading] = useState(false) ;
    const [categories , setCategories] = useState<CategoryType[]>([]) ; 
    const [chosenCatId  ,setChosenCatId] = useState('') ; 
   

    const getAuthHeader =  () => {
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

    const handefileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const objectURL = URL.createObjectURL(file) ; 
            setImageFiles([...imageFiles , objectURL])
        }
        console.log(imageFiles)
    }

    const handlegetCategories = async () => {
        setMessage('') ; 
        setLoading(true)
        try {
            const response = await  axios.get('http://localhost:8000/category/' , getAuthHeader()) ; 
            setCategories(response.data.result)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || 'An error occurred'); 
            } else {
                setMessage('Something went wrong');
            }
            } finally {
            setLoading(false);
            }
    }

   const hanldeSubmit = async () => {

        try {
            const url = generateSlug(title)
            const payload : StoryInputType = {title , content , url , published , scheduled_date : scheduledDate , category_id:chosenCatId ,  video_urls: videoUrls, music_urls: musicUrls}
            const response = await  axios.post('http://localhost:8000/story/admin/' ,payload ,  getAuthHeader()) ; 
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
   }

    useEffect(() => {
     handlegetCategories() ; 
    } , [])
    if(loading) {
        <div>loading...</div>
    }
    return (
        <>
        <DashboardMenu></DashboardMenu>
        {message && <p>{message}</p>}
         <div>
            <FormComponent  id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text"  />
            <FormComponent  id="content" label="Content" value={content} onChange={(e) => setContent(e.target.value)} type="text" />
            <div>
                <button onClick={() => setPublished(!published)}>{published ? 'publsihing' : 'Save to drafts'}</button>
                <select value={chosenCatId} onChange={(e) => setChosenCatId(e.target.value)}>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <FormComponent  id="scheduled_date" label="Schedule a date for post" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} type="date" />
            </div>
            <div>
                <input type="file" accept="image/*" onChange={(e) => handefileChange(e)}/>
                <div>
                    {imageFiles.map((img , idx) => (
                        <div key={`img-in-${idx}`}> 
                            <img  src={img}/>
                            <button onClick={() => setImageFiles(imageFiles.filter((_ , i) => i !== idx))}>cancel</button>
                        </div>
                    )) }
                </div>
            </div>
            <div>
                <p>Video Platform Links</p> <button onClick={()  => setVideoUrls([...videoUrls , ''])}>+ Add Link</button>
                {videoUrls.map((str , idx) => (
                    <div key={`video-in-${idx}`}> 
                        <FormComponent  id="videoUrl" label="add another link " value={str} onChange={(e) => {
                            const next = [...videoUrls] ; 
                            next[idx] = e.target.value  
                            setVideoUrls(next)
                        }} type="text" />
                        <button onClick={() =>
                         setVideoUrls( videoUrls.filter((_ , i) => i !== idx)) }>
                         Cancel </button>
                    </div>
                )) }
                
            </div>
            <div>
                <h1>Music Platform links</h1> <button onClick={() => setMusicUrls([...musicUrls , ''])}>ADD link</button>
                {musicUrls.map((str , idx) => (
                    <div key={`music-in-${idx}`}> 
                        <FormComponent  id="musicUrl" label="BA BLA " value={str} onChange={(e) => {
                            const next = [...musicUrls] ; 
                            next[idx] = e.target.value ; 
                            setMusicUrls(next)
                        }} type="text"  />
                        <button onClick={() => setMusicUrls(videoUrls.filter((_ , i) => i !== idx))} >cancel</button>
                    </div>
                ))}
            </div>
            <button onClick={hanldeSubmit} > subbit</button>
         </div>
        </>
    )
}