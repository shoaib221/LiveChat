

import { use, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Chat } from "./chat";
import '../styles/groupchat.css';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { SingleMessage } from "./chat";
import logo1 from '../images/shop_image3.jpg';

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

    return (
        <div style={{ overflowY: "auto", flexGrow: "1" }} >
            { props.group.admin === user.email && <button onClick={()=>DeleteGroup()} >Delete This Group</button> }
            <h1 style={{ textAlign: "center", backgroundColor: 'var(--color1', fontWeight: '500' }} > Members </h1>

            { friends && friends.map( x=> {
                if( memberMap[ x.username ] ) return (<div style={{ textAlign: "center" , backgroundColor: 'var(--color1)', margin: '.5rem', padding: '.5rem', fontWeight: '450', borderRadius: '.5rem' }} > 
                    {x.username} 
                    { props.group.admin === user.email && <button onClick={ () => DeleteFromGroup( x.username ) } > Remove </button> }
                    </div>)
            } ) }

            { props.group.admin === user.email && <>
            
                <h1 style={{ textAlign: "center", marginTop: "2rem", backgroundColor: 'var(--color1', fontWeight: '500' }} > Friends </h1>
                { friends && friends.map( x=> {
                    if( !memberMap[ x.username ] ) return (<div style={{ textAlign: "center", backgroundColor: 'var(--color1)', margin: '.5rem', padding: '.5rem', fontWeight: '450', borderRadius: '.5rem' }} > 
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
                <img src={ photo[props.data.sender] } style={{height: "2rem", width: "2rem" }} className={ onlineUsers[props.data.sender]? "on": "off" }  />
                <div className="bgsolid" onClick={()=> { if(detail) setDetail(false); else setDetail(true) } } > { props.data.text }  <br/>
                { detail && <> From { props.data.sender } <br/> At { fixTime(props.data.createdAt) } </> }
                </div>
            </div>
        )
    }

    return (
        <>
            <nav style={{ alignItems: "center", display: "flex", height: "3rem", justifyContent: "center", backgroundColor: "rgb(147, 125, 13)" }} >
                <h1 style={{ flexGrow: 1, textAlign: "center", color: "white" }} > { props.group.group_name } </h1>
                <button style={{ width: "4rem", height: "2rem" }}
                onClick={()=> { if(!settings)setSettings(true); else setSettings(false)}} 
                > { settings? 'Back': 'Settings' } 
                </button>
            </nav>


            { !settings && <div style={{ overflow: "auto", display: "flex", flexDirection: "column", flexGrow: "1" }} >

                <div style={{  display: "flex", flexDirection: "column", flexGrow: "1",  overflow: "auto" }} >
                    { messages && messages.map( x => <SingleMessage data={x} /> ) } 
                </div>

                <div style={{ backgroundColor: "rgb(147, 125, 13)", height: "5rem", borderRadius: "10px" }} > 
                    <input type="text" style={{padding: ".5rem"}} value={newMessage} onChange={(e)=> setNewMessage(e.target.value)} />
                    <button onClick={SendGroupMessage} > Send </button>
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
            setError( err.response.data.error )
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

    return (
        <div id="groups" style={{  display: "grid", gridTemplateColumns: "1fr 4fr",  height: "100%" }} >
            <div id="leftbar1"  style={{ border: ".2rem solid white", borderRadius: ".5rem", backgroundColor: "rgb(147, 125, 13, 0.8)", padding: "10px", overflow: "auto", alignItems: "center" }} >
                <div style={{ textAlign: "center", fontWeight: "900" }}> Create New Group </div>
                 
                <div style={{display: "flex", flexDirection: "column",  alignItems: "center"}} > 
                    <input placeholder="group name" value={newGroup} onChange={ (e)=> setNewGroup(e.target.value) }  />
                    <button onClick={()=> createGroup()}  > Submit </button>
                    <span> { error } </span>
                </div> 


                <div style={{ display: "flex", flexDirection: "column",  alignItems: "center", marginTop: "1rem" }} >
                    <h4> Your Groups  </h4>
                    { groups && groups.map( x => (
                        
                        <button id={x.group_id} style={{  margin: "2px", width: "80%"  }} onClick={() => setGroup(x)} > { x.group_name } </button> 
                        
                    ) ) }
                </div>
            </div>

            <div  style={{ display: "flex", flexDirection: "column", overflow: "auto",  backgroundColor: "rgb(147, 125, 13, 0.9)", borderRadius: ".5rem" }}>
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
