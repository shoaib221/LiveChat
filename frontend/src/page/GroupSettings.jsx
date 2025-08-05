import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {  useEffect, useState, useContext } from "react";
import { AuthContext } from '../context/authContext';
import { api } from '../api';

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

