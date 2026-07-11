import React, { useState } from "react";
import FormComponent from "../../components/FormComponent";
import { BrandLogo } from "../../components/Logo";
import { Eye , EyeOff } from "lucide-react";
import axios from "axios";

type RegisterPayload = { 
    name: string;
    email: string; 
    password: string;
}

type LoginPayload = {
    email: string; 
    password: string;
}

export default function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); 
    const [message, setMessage] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        
        if (email.trim() === "" || password.trim() === "") {
            setMessage('Please fill in all required fields');
            return;
        }
        
        if (isSignUp) {
            if (name.trim() === "") {
                setMessage('Please enter your name');
                return;
            }
            if (confirmPassword !== password) {
                setMessage('Passwords do not match');
                return;
            }
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const payload: RegisterPayload = { name, email, password }; 
                const response = await axios.post('http://localhost:8000/auth/register', payload);
                setMessage(response.data.message);
            } else {
                const payload: LoginPayload = { email, password }; 
                const response = await axios.post('http://localhost:8000/auth/login', payload);
                setMessage(response.data.message);
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
    }

    return (
        <form onSubmit={handleSubmit}>
            <BrandLogo className="h-20 w-auto" />
            <div>{isSignUp ? 'Create an Account' : 'Log in to an existing account'}</div>
            
            {isSignUp && (
                <FormComponent 
                    id="name" 
                    label="Name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required={isSignUp}
                />
            )}

            <FormComponent id="email" label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required={true}/>

            <FormComponent id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={true}/>
                
            {isSignUp && (
                <FormComponent 
                    id="confirmPassword" 
                    label="Confirm Password" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required={isSignUp}
                />
            )}

            {message && <p style={{ color: 'red' }}>{message}</p>}

            <button type="submit" disabled={loading}>
                {loading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
            </button>
            
            <div>
                {isSignUp ? (
                    <p>Have an account already? <button type="button" onClick={() => { setIsSignUp(false); setMessage(''); }}>Login</button></p>
                ) : (
                    <p>Don't have an account? <button type="button" onClick={() => { setIsSignUp(true); setMessage(''); }}>Sign Up</button></p>
                )}
            </div>
        </form>
    );
}