

import { useState, useEffect } from "react";
import { useAuth } from "./hooks/auth.js";
import { Link } from "react-router-dom";
import { GoogleAuth } from "./GoogleAuth.jsx";


const Login = () => {
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const {login} = useAuth();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login( email, password );
            setEmail("");
            setPassword("");
        }
        catch (err) {
            if( err.message ) alert(err.message);
            else alert( err.response.data.error )
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="register" style={{ overflow: 'initial' }} >
            { error && <div>  { error } </div> }
            <div style={{ textAlign: 'center' }} > Login </div>

            <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                placeholder="Email" 
            />
        
            <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                placeholder="Password" 
            />

            { !loading && <button onClick={handleSubmit} > Submit </button> }
            
            <GoogleAuth />
        
        </div>
    )
}


const Register = () => {
    const { signup } = useAuth();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState( null );
    const [ loading, setLoading ] = useState( false );


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signup(email, password);
            setEmail("");
            setPassword("");
        } 
        catch ( err ) {
            setError(err.message);
        } 
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="register" >
            { error && <p>  { error } </p> }
        
            <div style={{ textAlign: 'center' }} >Register</div>

            <input 
                type="text"
                placeholder="Your Full Name" 
            />
            
            <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                placeholder="Email" 
            />
            
            <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                placeholder="Password" 
            />

            

            { !loading && <button onClick={handleSubmit} > Submit </button> }

            <GoogleAuth />
            
            
        </div>
    )
}





export const Auth = () => {
    const [ login, toggle ] = useState(true);
    const [ option, changeOption ] = useState("Register");

    const onChange = () =>
    {
        if( option==="Register" ) 
        {
            changeOption("Login");
            toggle(false);
        }
        else
        {
            changeOption("Register");
            toggle(true);
        }
    }

    return (
        <div className="auth" style={{display: "flex", flexDirection: "column", height: "100%", width: "100%", alignItems: "center" }} >

            { login && <Login/> }
            { !login && <Register /> }

            <div style={{ display: "block",  textAlign: "center" }} >
                <button style={{ width: "70px" }} onClick={onChange} > { option } </button>
                
            </div>

        </div>
    )

}