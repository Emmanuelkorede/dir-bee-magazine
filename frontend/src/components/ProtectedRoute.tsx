import { useNavigate , Outlet } from "react-router";

const ProctectedRoute = () => {
    const navigate = useNavigate() ; 
    const token = localStorage.getItem('token') ; 

    if(!token) {
        navigate('/login')
    }

    return <Outlet />
}

export default ProctectedRoute ; 