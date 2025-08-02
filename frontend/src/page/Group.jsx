import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

import { use, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Chat } from "./chat";
import '../styles/group.css';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { SingleMessage } from "./chat";


const api = axios.create( { baseURL: "http://localhost:4000" } );



export const GroupSettings = (props) => {
    const [ friends, setFriends ] = useState(null)
    const { user } = useContext(AuthContext)
    const [ memberMap, setMemberMap ] = useState({})

    const fetchFriends = async () => {
        console.log("fetch friends")
        try {
            const response = await api.get( "/chat/users", 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )
            
            setFriends( response.data.users )
            console.log(response.data)
        } catch (err) {
            console.log( err.response.data.error )
        }
    }

    const DeleteFromGroup = async ( who ) => {

        try {
            const response = await api.post( "/chat/deletemember", 
                { group_id: props.group.group_id, member: who } ,
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )
            console.log("successful", who)
            let abc = {  }
            abc[who]=false
            console.log( { ...memberMap, ...abc } )
            setMemberMap( { ...memberMap, ...abc } )
        } catch(err) {
            console.log( err.response.data.error )
        }
    }

    const AddToGroup = async ( new_member ) => {
        console.log("addtogroup" )
        console.log( props.group )
        console.log("addtogroup" )
        try {
            const response = await api.post( "/chat/addtogroup", 
                { group_name: props.group.group_name, new_member },
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )

            console.log(response.data)
            //console.log(members)
            let abc = {}
            abc[ new_member ] = true
            setMemberMap( { ...memberMap, ...abc } )
        } catch (err) {
            console.log( err.response.data.error )
        }
    }

    const DeleteGroup = async (  ) => {
        
        try {
            const response = await api.post( "/chat/deletegroup", 
                { group_id: props.group.group_id },
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )

            console.log( response.data );
        } catch(err) {
            console.log( err.response.data.error )
        }
    }

    const LeaveGroup = async (  ) => {
        
        try {
            const response = await api.post( "/chat/leavegroup", 
                { group_id: props.group.group_id },
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )

            alert( response.data );
        } catch(err) {
            alert( err.response.data.error )
        }
    }

    

    const fetchMembers = async () => {
        console.log("aha", props)
        try {
            const response = await api.post("/chat/fetchgroupmembers",
                { group_id: props.group.group_id },
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )
            console.log("fetch members 2");
            console.log( response.data );
            let bcd = {}
            response.data.map( x=> bcd[ x.member ] = true )
            setMemberMap( bcd )
            fetchFriends()
        } catch(err) {
            console.log( err )
        }
    }

    useEffect( () => {
        if(props) {
            console.log("setting", props )
            fetchMembers();
            
        }
    },[props.group.group_id] )

    const [ memberOpener, setMemberOpener ] = useState(false)
    const [ friendOpener, setFriendOpener ] = useState(false)

    return (
        <div style={{ overflowY: "auto", flexGrow: "1", backgroundColor: 'var(--color4)' }} >
            { props.group.admin === user.email && <button onClick={()=>DeleteGroup()} >Delete This Group</button> }
            { props.group.admin !== user.email && <button onClick={()=>LeaveGroup()} >Leave From This Group</button> }
            
            
            
            <h1 style={{ textAlign: "center", backgroundColor: 'var(--color3)', fontWeight: '500', color: 'var(--color2)' }} > Members 
                <FontAwesomeIcon icon={faArrowDown} className='icon' style={{ marginLeft: '1rem', cursor: 'pointer' }} 
                    onClick={() => { if ( memberOpener ) setMemberOpener(false); else setMemberOpener(true) }}
                />
            </h1>

            { memberOpener && friends && friends.map( x=> {
                if( memberMap[ x.username ] ) return (<div style={{ textAlign: "center" , backgroundColor: 'var(--color3)', margin: '.5rem', padding: '.5rem', fontWeight: '450', borderRadius: '.5rem', color: 'var(--color2)' }} > 
                    {x.username} 
                    { props.group.admin === user.email && <button onClick={ () => DeleteFromGroup( x.username ) } > Remove </button> }
                    </div>)
            } ) }

            { props.group.admin === user.email && <>
            
                <h1 style={{ textAlign: "center", marginTop: "2rem", backgroundColor: 'var(--color3)', fontWeight: '500', color: 'var(--color2)' }} > Friends

                    <FontAwesomeIcon icon={faArrowDown} className='icon' style={{ marginLeft: '1rem', cursor: 'pointer' }} 
                        onClick={() => { if ( friendOpener ) setFriendOpener(false); else setFriendOpener(true) }}
                    />

                </h1>
                { friendOpener && friends && friends.map( x=> {
                    if( !memberMap[ x.username ] ) return (<div style={{ textAlign: "center", backgroundColor: 'var(--color3)', margin: '.5rem', color: 'var(--color2)', padding: '.5rem', fontWeight: '450', borderRadius: '.5rem' }} > 
                        {x.username} 
                        <button onClick={ () => AddToGroup(x.username)  } > Add As Member </button>
                    </div>)
                } ) }
            
            </>  }
            
        </div>
    )
}



export const Group = ( props ) => {
    const [ settings, setSettings ] = useState(false);
    const { user } = useContext(AuthContext);
    const [ messages, setMessages ] = useState([]);
    const [ socket, setSocket ] = useState(null);
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
            console.log("fetch members 2");
            console.log( response.data );
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
            console.log( response.data )
            setMessages( response.data )
        } catch(err) {
            console.log( err.response.data.error )
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
    
    useEffect(() => {
        connectSocket();
        
        console.log( props )
    },[])

    useEffect( ()=> {
        fetchMessage();
        fetchMembers()
    },[props.group.group_id] )

    if(socket) {
        socket.on( "groupMessage", (data) => {
            setMessages( [ ...messages, data ] );
        } )

        socket.on( "newGroupMessage", (data) => {
            setMessages( [ ...messages, data ] )
            console.log(data)
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

    const fixTime = ( x ) => x.toLocaleString()

    const SingleMessage = (props) => {
        const [ detail, setDetail ] = useState(false)

        return (
            <div id={props.data._id} className={ props.data.sender === user.email? 'sent': 'received' }    >
                <div style={{ backgroundImage: `url(${photo[props.data.sender]})` }}  className={ onlineUsers[props.data.sender]? "on photo-1": "off photo-1" }  > </div>
                <div className="message-slot" onClick={()=> { if(detail) setDetail(false); else setDetail(true) } } > { props.data.text }  <br/>
                { detail && <> From { props.data.sender } <br/> At { fixTime(props.data.createdAt) } </> }
                </div>
            </div>
        )
    }

    const [ mediaFiles, setMediaFiles ] = useState(null)
    const [ mediaURLs, setMediaURLs ] = useState(null)

    const mediaChange = (event) => {
        
        let files=[], urls=[]
        for( let x=0; x<event.target.files.length; x++ )
        {
            files.push( event.target.files[x] );
            urls.push( URL.createObjectURL( event.target.files[x] ) );
        }
        setMediaFiles( files )
        setMediaURLs( urls )
        if( event.target.files.length === 0 ) setMediaURLs(null)
    }

    return (
        <>
            <div id='rightbar-nav'   >
                <div style={{ flexGrow: 1, textAlign: "center", color: "white" }} > { props.group.group_name } </div>
                <div style={{ width: "4rem", height: "100%", color: 'var(--color2)', cursor: 'pointer' }}
                onClick={()=> { if(!settings)setSettings(true); else setSettings(false)}} 
                > { settings? 'Back': 'Settings' } 
                </div>
            </div>


            { !settings && <div style={{ overflow: "auto", display: "flex", flexDirection: "column", flexGrow: "1" }} >

                <div style={{  display: "flex", flexDirection: "column", flexGrow: "1",  padding: '.5rem', overflow: "auto", backgroundColor: 'var(--color4)' }} >
                    { messages && messages.map( x => <SingleMessage data={x} /> ) } 
                </div>

                <div id='bottom-bar' style={{ position: 'relative' }} >

                    { mediaURLs && <div id='media' style={{ position: 'absolute', height: '3rem', width: '100%', bottom: '100%', display: 'flex' }} >
                        { mediaURLs && mediaURLs.map( x => (
                            <div style={{ width: '3rem', backgroundImage: `url(${x})`, backgroundSize: 'cover' }} >

                            </div>
                        ) ) }
                    </div> }                  
                    
                    <div className='file-input-container'  >
                        +
                        <input onChange={mediaChange} type='file' multiple style={{ cursor: 'pointer', position: 'absolute', left: '0', right: '0', width: '100%', height: '100%', opacity: '0'}} />
                    </div>
                    
                    <input type="text" placeholder="Write Message" style={{padding: ".5rem", height: '100%', flexGrow: '1', backgroundColor: 'var(--color3)', color: 'var(--color2)' }} value={newMessage} onChange={(e)=> setNewMessage(e.target.value)} />
                    <button onClick={SendGroupMessage} style={{ cursor: 'pointer' }}  > Send </button>
                </div> 
                    
            </div>}

            { settings && <GroupSettings {...props} />}
        </>
    )
}

/*




*/
 

export const Groups = () => {

    const [ selectedGroup, setGroup ] = useState(null)
    const [ newGroup, setNewGroup ] = useState(null)
    const { user } = useContext(AuthContext)
    const [ groups, setGroups ] = useState([])
    const [ error, setError ] = useState("")

    const createGroup = async () => {
        
        try {
            const response = await api.post( "/chat/creategroup", { newGroup }, 
            {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })

            setNewGroup("")
            setGroups( [ ...groups, response.data ] )
            console.log( response.data )
        } catch (err) {
            alert( err.response.data.error )
        }
    }

    const fetchGroups = async () => {

        try {
            const response = await api.get( "/chat/fetchgroups", 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )
            setGroups( response.data );
            console.log( response.data );
        } catch (err) {
            console.log( err.response.data.error )
        }
    }

    useEffect( ()=> {
        fetchGroups();
        
    }, [] )

    const [ groupsOpener, setGroupsOpener  ] = useState(false)

    return (
        <div id="groups"  >
            <div id="leftbar"   >
                <div style={{ textAlign: 'center' }} > 
                    Create New Group

                </div>
                 
                <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '.5rem', padding: '.5rem' }} > 
                    <input placeholder="group name" style={{ flexGrow: '1' }} value={newGroup} onChange={ (e)=> setNewGroup(e.target.value) }  />
                    <button onClick={()=> createGroup()}  > Submit </button>
                    <span> { error } </span>
                </div> 

                <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '1.3rem', borderTop: '3px solid var(--color4)' }} >Your Groups
                    <FontAwesomeIcon icon={faArrowDown} className='icon' style={{ marginLeft: '1rem', cursor: 'pointer' }} 
                        onClick={() => { if ( groupsOpener ) setGroupsOpener(false); else setGroupsOpener(true) }}
                    />
                </div>
                { groupsOpener && <div  >
                    
                    { groups && groups.map( x => (
                        
                        <div id={x.group_id} style={{ cursor: 'pointer' }} className="hover1" onClick={() => setGroup(x)} > { x.group_name } </div> 
                        
                    ) ) }
                </div>}
            </div>

            <div id='rightbar' >
                {selectedGroup && <Group group={selectedGroup} />}
            </div>
        </div>
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
