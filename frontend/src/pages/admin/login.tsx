import React, { useState } from "react";
import FormComponent from "../../components/FormComponent";
import { BrandLogo } from "../../components/Logo";
import axios from "axios";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate() ;

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
        const token =  response.data.token ;
        const Adminname = response.data.user.name 
        localStorage.setItem('token' , token) ;
        localStorage.setItem('Adminname' , Adminname) ;
        navigate('/admin')
      } else {
        const payload: LoginPayload = { email, password }; 
        const response = await axios.post('http://localhost:8000/auth/login', payload);
        setMessage(response.data.message);
        const token =  response.data.token ;
        const Adminname = response.data.user.name 
        localStorage.setItem('token' , token) ;
        localStorage.setItem('Adminname' , Adminname) ;
        navigate('/admin')
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
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-cream selection:text-burnt-brown">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col items-center">
        
        <div className="mb-4 flex justify-center">
          <BrandLogo className="h-24 w-auto" />
        </div>
        
        <h2 className="font-serif text-xl font-bold tracking-tight text-ink text-center mb-8">
          {isSignUp ? 'Create an Account' : 'Log in to Admin Dashboard'}
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          
          {isSignUp && (
            <FormComponent 
              id="name" 
              label="Full Name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required={isSignUp}
            />
          )}

          <FormComponent 
            id="email" 
            label="Email Address" 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required={true}
          />

          <FormComponent 
            id="password" 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required={true}
          />
              
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

          {message && (
            <div className="bg-red-50 border-l border-red-500 text-red-700 px-4 py-2.5 text-xs tracking-wide font-sans font-medium">
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-burnt-brown hover:bg-[#342013] text-canvas font-sans text-xs font-bold tracking-widest uppercase py-3 transition-colors duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded-none"
          >
            {loading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Create Account' : 'Login')}
          </button>
          
          <div className="text-center mt-3 border-t border-gray-100 pt-5">
            {isSignUp ? (
              <p className="text-xs text-muted-ink tracking-normal font-sans">
                Have an account already?{' '}
                <button 
                  type="button" 
                  onClick={() => { setIsSignUp(false); setMessage(''); }}
                  className="text-burnt-brown font-bold underline underline-offset-4 hover:text-opacity-80 ml-1 cursor-pointer focus:outline-none"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-xs text-muted-ink tracking-normal font-sans">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => { setIsSignUp(true); setMessage(''); }}
                  className="text-burnt-brown font-bold underline underline-offset-4 hover:text-opacity-80 ml-1 cursor-pointer focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}