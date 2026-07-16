import { useNavigate, useParams } from "react-router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Story {
  id: string;
  title: string;
  content: string;
  url: string;
  published: boolean;
  views: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  scheduled_date: string | null; // Can be a date string or null
  video_urls: string[];
  music_urls: string[];
  image_urls: string[];
  admin_user_id: string;
  category_id: string;
  category_name: string;
}

export default function CategoryPage() {
    const url =  useParams() ; 
    const [loading , setLoading] = useState(false) ; 
    const [message , setMessage] = useState('') ;
    const [stroies , setStories] = useState<Story>([]) ;
    const navigate = useNavigate()
      const getAuthHeader = () => {
    const token = localStorage.getItem('token'); 
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const getStoryBYCatUrl = async () => {
   setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/story/?category_url=${url}`, getAuthHeader()); 
      setStories(response.data.result);
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

  useEffect(() => {
    getStoryBYCatUrl()
  } , [])
    return (
        <>
        <Header />
        {stroies.map((story) => (
            
            <div key={story.id} onClick={navigate(`/storydetails/${story.url}/${story.id}`)}>
                <div>{story.category_name.toUppercase()}/{story.date}</div>
            </div>
        ))}
        </>
    )
}