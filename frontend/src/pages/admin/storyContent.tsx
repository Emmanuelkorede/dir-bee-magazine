import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

type Stories = {
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
}

export default  function storyContent() {
    const [stories ,setStories] = useState<Stories[]>([]) ;
    const [message , setMessage] = useState('') ;
    const {id} = useParams() ;

    const getAuthHeader =  () => {
        const token = localStorage.getItem('token') ; 
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    
    const getStories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/story/admin' , getAuthHeader()) ;
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
        getStories()
    } , []) ;
    const story = stories.find(s => s.id === id ) ;
    return (
        <>
            <header>
                Back button
            </header>
            <main>
                <h1>${story?.title}</h1>
            </main>
        </>
    )
}