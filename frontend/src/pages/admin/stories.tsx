import FormComponent from "../../components/FormComponent";
import  React, { useState } from "react";
import DashboardMenu from "../../components/dashboardMenu";

export default function AdminStories() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(true); 
    const [scheduledDate, setScheduledDate] = useState('');
    const [videoUrls, setVideoUrls] = useState<string[]>([]); 
    const [musicUrls, setMusicUrls] = useState<string[]>([]); 
    const [imageFiles, setImageFiles] = useState<string[]>([]); 

    const handefileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const objectURL = URL.createObjectURL(file) ; 
            setImageFiles([...imageFiles , objectURL])
        }
        console.log(imageFiles)
    }
    
    return (
        <>
        <DashboardMenu></DashboardMenu>
         <div>
            <FormComponent  id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text"  />
            <FormComponent  id="content" label="Content" value={content} onChange={(e) => setContent(e.target.value)} type="text" />
            <div>
                <button onClick={() => setPublished(!published)}>{published ? 'publsihing' : 'Save to drafts'}</button>
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
         </div>
        </>
    )
}