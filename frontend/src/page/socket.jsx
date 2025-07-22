
import { useEffect, useState } from "react";
import { useContext } from "react";
import { io } from 'socket.io-client';
import { AuthContext } from "../context/authContext";
import '../styles/socket.css';
import axios from "axios";
const api = axios.create( {  baseURL: "http://localhost:4000" } );




export const Socket = () => {
    
    const { user } = useContext(AuthContext);
    const [ socket, setSocket ] = useState(null);

    

    useEffect( () => {
        if(user)
        {
            console.log("logged in");
            const client = io( 'http://localhost:4000', {
                query: {
                    auth: `Bearer ${user.token}`
                }
            } )
            setSocket( client );
        }
        else
        {
            if(socket && socket.connected) socket.disconnect();
        }
        
    }, [user] )



    const [ curbar, setcurbar ] = useState("chat")

    return (
        <div className="chatty" >

            
            
            <div  id="opbar">
                <button onClick={ () => setcurbar("chat") } > Chat </button>
                <button onClick={ ()=> setcurbar("contact") } > Contact </button>
                <button onClick={ ()=> setcurbar("chatgroups") } >  Chat Groups </button>
            </div> 
        </div>
    )
}



/*

    { curbar==="chat" && <Chat /> }
    { curbar==="contact" && <Contact /> }
    { curbar==="chatgroup" && <ChatGroup /> }
  

*/

