
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useEffect } from "react";
import { io } from "socket.io-client";
import "../styles/chat.css";


const api = axios.create( {  baseURL: "http://localhost:4000" } );


export const SingleMessage = (props) => {
    const { user } = useContext(AuthContext)

    return (
        <div className={ props.message.receiver === user.email? 'received': 'sent' }>
            { props.message.text }
        </div>
    )
}



export const Chat = () => {
    const [ messageInput, setMessageInput ] = useState("");
    const { user } = useContext(AuthContext);
    const [ users, setUsers ] = useState(null);
    const [ currentUser, setCurrentUser ] = useState(null); //username
    const [ messages, setMessages] = useState([]);
    const [ onlineUsers, setOnlineUsers ] = useState([]);
    const [ socket, setSocket ] = useState(null);


    async function fetchUsers () {
        try {
            const response = await api.get( "/chat/users", 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            );
            setUsers(response.data.users);
            setOnlineUsers(response.data.onlineUsers);
            console.log( response.data.users );
        } catch (err1) {
            console.log( err1.response.data.error );
        }
    }

    function connectSocket () {
        const client = io( 'http://localhost:4000', {
            query: {
                auth: `Bearer ${user.token}`
            }
        } )
        setSocket( client );
    }

    useEffect( () => {
        console.log( "chat" );
        fetchUsers();
        connectSocket()
        
        return () => {
            
            if(socket)
            {
                socket.off( "newMessage" )
                socket.off( "onlineUsers" )
                socket.disconnect();
            }
        }

    }, [] )
    
    
    const sendMessage =  () => {
        // try {
        //     const response = await api.post ( "/chat/sendmessage", 
        //         {
        //             text: messageInput,
        //             receiver: currentUser
        //         },
        //         { headers: { 'Authorization': `Bearer ${user.token}` } }
        //     )
        //     setMessages( [ ...messages, response.data ] );
        //     setMessageInput("")
        // } catch (err) {
        //     console.log( err.response.data.error );
        // }

        socket.emit( "sendMessage", {
            sender: user.email,
            receiver: currentUser,
            text: messageInput
        } )

        setMessageInput("")
    }

    

    async function fetchMessage () {
        if(!currentUser) return;
        try {
            const response = await api.post( "/chat/fetchmessage", 
            {
                receiver: currentUser
            },
            {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
            setMessages(response.data);
            console.log(response.data);
        } catch (err) {
            console.log( err.response.data.error );
        }
    }

    useEffect( () => {
        if(currentUser) fetchMessage();
    },[currentUser] )

    if( socket )
    {
        socket.on( "newMessage", (data) => {
            //console.log("new message in socket")
            //console.log(messages);
            const load = [ ...messages, data ];
            //console.log( load );
            setMessages( load );
            //console.log(messages);
        } )

        socket.on( "onlineUsers", (data) => {
            let tmp= data.filter( x => x !== user.email );
            setOnlineUsers(tmp);
        } )
    }
    

    
        


    return (
        <div className="chat" >

            <div id="leftbar" >
                { onlineUsers && onlineUsers.map( x => 
                    <button
                    id={x}
                    onClick={ () => setCurrentUser(x) }
                    className={ x === currentUser? 'online-active': 'online-inactive' }
                    >
                        {x}
                    </button>
                ) } 

            </div>
            

            <div id="rightbar" >
                <div id="header" >
                    { currentUser && <h3> { currentUser } </h3> }
                </div>

                <div id="message-body" >
                    { currentUser && messages && messages.map( x => <SingleMessage id={x._id} message={x} /> ) }
                </div>

                { currentUser && <div id="input" >
                    <input 
                        type="text" 
                        onChange={(e) => setMessageInput(e.target.value)} 
                        value={messageInput}
                        placeholder="Send Message" 
                    />
                    <button onClick={sendMessage} > Send Message </button>
                </div> }
            </div>
        </div>
    )
}

