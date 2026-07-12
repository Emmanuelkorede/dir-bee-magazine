import { useEffect, useState } from "react";
import DashboardMenu from "../../components/dashboardMenu" ;
import axios from "axios";

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

export default function DashBoard() {
    const [message , setMessage] = useState('') ;
    const [stories ,setStories] = useState<Stories[]>([]) ;

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
        getStories() ;
    } , [])

    return (
        <>
        <DashboardMenu />
        {message && <p className="text-red-500 text-sm">{message}</p>}
        {stories.map((story) => (
            <div key={story.id} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 my-4">
                {(story.video_urls?.length > 0 || story.image_urls?.length > 0) && (
                    <div className="bg-gray-900 h-48 flex items-center justify-center text-white text-sm">
                    <span>[ Media Preview: {story.video_urls?.length || 0} Video(s) ]</span>
                    </div>
                )}

                <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-2">
                    <span>Category: {story.category_id.slice(0, 8)}...</span>
                    {story.published ? (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px]">Published</span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-[10px]">Draft</span>
                    )}
                    </div>

                    {/* Title */}
                    <h2 className="block text-lg leading-tight font-bold text-gray-900 hover:underline cursor-pointer mb-2">
                    {story.title}
                    </h2>

                    {/* Content Snippet */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {story.content}
                    </p>

                    {/* Divider */}
                    <hr className="border-gray-100 my-3" />

                    {/* Footer info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                        <span>👁️ {story.views} views</span>
                    </div>
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
        </>
    )
}