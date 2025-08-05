import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {  useEffect, useState, useContext } from "react";


import { FileInput } from './FileInput';
import {api} from '../api'
import { Chat } from "./chat";
import '../styles/group.css';
import { AuthContext } from "../context/authContext";
import { GroupSettings } from './GroupSettings';



export const Group = ( props ) => {
    const [ settings, setSettings ] = useState(false);
    const { user, socket } = useContext(AuthContext);
    const [ messages, setMessages ] = useState([]);
    const [ newMessage, setNewMessage ] = useState(null);
    const [ onlineUsers, setOnlineUsers ] = useState({})
    const [ photo, setPhoto ] = useState({})

    const fetchMembers = async () => {
        console.log("aha", props)
        try {
            const response = await api.post("/chat/fetchgroupmembers",
                { group_id: props.group.group_id },
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )
            
            let bcd = {}
            response.data.map( x=> bcd[ x.member ] = x.photo )
            setPhoto(bcd)
        } catch(err) {
            console.log( err )
        }
    }

    const fetchMessage = async () => {
        try {
            const response = await api.post( "/chat/fetchgroupmessage", 
                { group_id : props.group.group_id },
                { headers:
                    {'Authorization': `Bearer ${user.token}`}
                }
            )
            //console.log( response.data )
            setMessages( response.data )
        } catch(err) {
            console.log( err.response.data.error )
        }
    }

    useEffect( ()=> {
        fetchMessage();
        fetchMembers()
    },[props.group.group_id] )

    if(socket) {
        

        socket.on( "newGroupMessage", (data) => {
            console.log("newGroupMessage")
            setMessages( [ ...messages, ...data ] )
            //console.log(data)
        } )

        socket.on( "onlineUsers", (data) => {
            const aha = {}
            data.map( x => aha[x]=true )
            setOnlineUsers( aha )
        } )
    }

    const SendGroupMessage = () => {
        socket.emit( "sendGroupMessage", {
            sender: user.email,
            receiver: props.group.group_id,
            text: newMessage
        })

        setNewMessage("")
        console.log("successful")
        
    }

    const fixTime = ( x ) => x

    const SingleMessage = (props) => {
        const [ detail, setDetail ] = useState(false)

        return (
            <div id={props.data._id} className={ props.data.sender === user.email? 'sent': 'received' }    >
                <div style={{ backgroundImage: `url(${photo[props.data.sender]})` }}  className={ onlineUsers[props.data.sender]? "on photo-1": "off photo-1" }  > </div>
                
                
                
                
                <div style={{ overflow: 'initial' }}  onClick={()=> { if(detail) setDetail(false); else setDetail(true) } } >
                        { props.data.text && <div className="message-slot"  > { props.data.text }  </div> }
                        { props.data.mediaType === 'video' && <video  className="media" controls src={props.data.mediaURL} ></video> }
                        { props.data.mediaType ==='audio' && <audio  className="media" src={props.data.mediaURL} controls ></audio> }
                        { props.data.mediaType ==='photo' && <img   className="media" src={props.data.mediaURL}  /> }
                        { props.data.mediaType ==='pdf' &&   <embed  className="media"  src={props.data.mediaURL} type="application/pdf"  /> }
                        { detail && <div> From { props.data.sender } <br/> At { fixTime(props.data.createdAt) } </div> }    
                </div>

            </div>
        )
    }

    

    const sendMessage = async (  ) => {
        try {
            
            const formData = new FormData()
            formData.append('text', newMessage) 
            formData.append( 'sender', user.email ) 
            formData.append( 'group_id', props.group.group_id ) 

            let response = null;

            if( newMessage ) response = await api.post( "/chat/group_message", formData, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            } )
            
            setNewMessage(null)
            
        } catch (err) {
            alert( "front " + err.message )
        }
    }

    const [ fileinputOpener, setFileinputOpener ] = useState(false)

    return (
        <>
            <div id='rightbar-nav'  style={{ borderBottom: '.1rem solid var(--color4)' }} >
                <div style={{ flexGrow: 1, textAlign: "center", color: "white" }} > { props.group.group_name } </div>
                <div style={{ width: "4rem", height: "100%", color: 'var(--color2)', cursor: 'pointer' }}
                onClick={()=> { if(!settings)setSettings(true); else setSettings(false)}} 
                > { settings? 'Back': 'Settings' } 
                </div>
            </div>


            { !settings && !fileinputOpener && <div style={{ overflow: "auto", display: "flex", flexDirection: "column", flexGrow: "1" }} >

                <div style={{  display: "flex", flexDirection: "column", flexGrow: "1",  padding: '.5rem', overflow: "auto", backgroundColor: 'var(--color4)' }} >
                    { messages && messages.map( x => <SingleMessage data={x} /> ) } 
                </div>

                <div id='bottom-bar' style={{ position: 'relative' }} >
                    <div style={{ color: 'white', cursor: 'pointer' }} onClick={()=> { if(fileinputOpener) setFileinputOpener(false); else setFileinputOpener(true) }}  > + </div>
                    <input type="text" placeholder="Write Message" style={{padding: ".5rem", height: '100%', flexGrow: '1', backgroundColor: 'var(--color3)', color: 'var(--color2)' }} value={newMessage} onChange={(e)=> setNewMessage(e.target.value)} />
                    <button onClick={sendMessage} style={{ cursor: 'pointer' }}  > Send </button>
                </div> 
                    
            </div>}

            { !settings && fileinputOpener && <FileInput setMessages={setMessages} messages={messages} back={setFileinputOpener} group_id={props.group.group_id} /> }

            { settings  && <GroupSettings {...props} />}
        </>
    )
}

 

// const mongoose = require('mongoose');

// const MessageSchema = new mongoose.Schema({

//     sender: {
//         type: String,
//         required: true,
//     },
//     receiver: {
//         type: String,
//         required: true,
//     },
//     text: {
//         type: String
//     },
//     media: {
//         type: String
//     }
    
// }, { timestamps: true } );


// const Message = mongoose.model('Message', MessageSchema);


// const GroupSchema  = new mongoose.Schema({
//     name : {
//         type: String,
//         required: true
//     },
//     admin : {
//         type: String,
//         required: true
//     }},
//     { timestamps: true }
// )

// GroupSchema.index( { name: 1, admin: 1  }, { unique: true } )

// const Group = mongoose.model("Group", GroupSchema)

// const GroupMembersSchema = new mongoose.Schema({
//     group_id: {
//         type: String,
//         required: true
//     },
//     group_name: {
//         type: String,
//         required: true
//     },
//     member: {
//         type: String,
//         required: true
//     }
// },
//     {timestamps: true}
// )

// GroupMembersSchema.index( { group_id:1, member:1 }, { unique: true } )

// const GroupMembers = mongoose.model("GroupMember", GroupMembersSchema )

// const GroupMessageSchema = new mongoose.Schema({
//     group_id: {
//         type: String,
//         required: true
//     },
//     sender: {
//         type: String,
//         required: true
//     },
//     text: {
//         type: String,
//     }, 
//     media: {
//         type: String
//     }},
//     { timestamps: true }
// )

// const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema );

// module.exports = { Message, Group, GroupMessage, GroupMembers };
