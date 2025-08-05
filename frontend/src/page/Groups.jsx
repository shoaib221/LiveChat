import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {  useEffect, useState, useContext } from "react";
import { AuthContext } from '../context/authContext';
import { api } from '../api';
import { Group } from './Group';


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
        <div id="groups" style={{ overflow: 'auto' }} >
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

            <div id='rightbar'  style={{ overflow: 'auto' }}  >
                {selectedGroup && <Group group={selectedGroup} />}
            </div>
        </div>
    )
}


