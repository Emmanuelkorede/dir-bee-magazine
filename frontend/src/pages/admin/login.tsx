import React, { useState } from "react";
import FormComponent from "../../components/FormComponent";
import { BrandLogo } from "../../components/Logo";
import axios from "axios";
type RegsiterPayload = {
    name : string ;
    email : string ; 
    password : string
}

type LoginPayload = {
    email : string ; 
    password : string
}


export default function Login() {
     const[name , setName] = useState("") ;
    const [password , setPassword] = useState("") ;
    const [email , setEmail] = useState('') ;
    const [loading , setLoading] = useState(false) ; 
    const [message , setMessage]  = useState("") ; 
    const [confirmPassword , setConfirmPassword] = useState("") ;
    const [isSignUp , setIsSignUp] = useState(false) ;

    const handleSubmit = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() ;
        setLoading(true)
        setMessage('') ;
        if(email.trim() === "" || password.trim() === "" ) {
            setMessage('please input the required feilds') ;
            return 
        }
        
        if(isSignUp === true) {
            if(name.trim() === ""  ) {
                setMessage('please input the required fields') ;
                return 
            }
            if(confirmPassword !== password) {
                setMessage('PASSWORD DOES NOT MATCH') ;
                return  ;
            }
            try {
                const payload  : RegsiterPayload = {name , email , password} ; 

                const response = await axios.post('http://localhost:8000/auth/register' , payload)
                setMessage(response.data.message) ;
            } catch(error) {
                if(axios.isAxiosError(error)) {
                    setMessage(error.response?.data?.message) 
                } else {
                    setMessage('somethin went wrong')
                }
            }
        } else {
            try {
                const payload : LoginPayload = {email , password} ; 
                const response = await axios.post('http://localhost:8000/auth/login' , payload)
                setMessage(response.data.message) ;
            } catch(error) {
                if(axios.isAxiosError(error)) {
                    setMessage(error.response?.data?.message) 
                } else {
                    setMessage('something went wrong')
                }
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <BrandLogo className="h-20 w-auto" />
            <div>{isSignUp === true ? 'Create an Account' : 'Log in to an existing'}</div>
            <FormComponent id="name" label="Name"  type="text" value={name} onChange={(e) => setName(e.target
                .value)} required={true}/>

            <FormComponent id="email" label="Email"  type="text" value={email} onChange={(e) => setEmail(e.target.value)} required={true}/>

            <FormComponent id="password" label="Password"  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={true}/>
                
            <FormComponent id="confirmPassword" label="Confirm Password"  type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={true}/>

            {message && <p>{message}</p>}

            {loading === true ? 
                <button type="submit" >
                {isSignUp === true ? 'Creating Account' : 'Logining'}
                </button>
            : 
            <button type="submit" >
                {isSignUp === true ? 'Create Account' : 'Login'}
            </button>
            }
            <div>
                <p>Have an account already ? <button onClick={() => setIsSignUp(false)}>Login</button></p>
            </div>
        </form>
    )
}