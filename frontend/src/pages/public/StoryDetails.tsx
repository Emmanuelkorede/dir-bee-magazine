import { useParams } from "react-router" ;
import axios from "axios";
import { useEffect } from "react";

export default function StoryDetails() {
    const {url , id } = useParams() ; 
    const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };
    const getStoryDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/?url=${url}/?id=${id}`, getAuthHeader()) ; 
            console.log(response.data.result) ;
        } catch(error) {
            if(axios.isAxiosError(error)) {
                console.log('someyhing went wrong')
            }
        }
    }

    useEffect(() => {
        getStoryDetails()
    } , []) ; 
    return (
        <>
        <h1> this is just testing</h1>
        </>
    )
}