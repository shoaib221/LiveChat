

import { useState, useEffect } from "react";
import { registerURL, loginURL, logoutURL } from "./urls.js";
import { useLogin, useSignup } from "./hooks/auth.js";
import { Link } from "react-router-dom";
import { GoogleAuth } from "./GoogleAuth.jsx";


const Login = () => {
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const {login} = useLogin();


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
            setError( err.message );
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="register flex-column" >
            
            
            <h3>Login</h3>

            { error && <div>  { error } </div> }

            <div className="flex-row" style={{ height: "40px", width: "300px" }} >
                
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                    placeholder="Email" 
                />
            </div>
            

            <div className="flex-row" style={{ height: "40px", width: "300px" }} >
            <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                placeholder="Password" 
            />

            </div>

            { !loading && <button onClick={handleSubmit} > Submit </button> }
            
        
        </div>
    )
}


const Register = () => {
    const { signup } = useSignup();
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
        <div className="register flex-column" >
            { error && <p>  { error } </p> }
            
                <h3>Register</h3>
                
                <div className="flex-row" style={{ height: "40px", width: "300px" }} >
                    
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email}
                        placeholder="Email" 
                    />
                </div>
                

                <div className="flex-row" style={{ height: "40px", width: "300px" }} >
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                    placeholder="Password" 
                />

                </div>

                { !loading && <button onClick={handleSubmit} > Submit </button> }
                
            
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

            <div style={{ display: "block", width: "100%", height: "100%", textAlign: "center" }} >
                <button style={{ width: "70px" }} onClick={onChange} > { option } </button>
                Or 
                <GoogleAuth />
            </div>

            

        </div>
    )

}