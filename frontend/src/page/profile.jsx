
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { api } from "../api";
import { useAuth } from "../hooks/auth";

import '../styles/profile.css';



export const Profile = () => {
    const { user } = useContext(AuthContext)
    const [ name, setName ] = useState(null)
    const [ username, setUsername ] = useState(null)
    const [ description, setDescription ] = useState(null)
    const [ imageurl, setImageurl ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [error, setError]  = useState(null)
    const { logout } = useAuth()
    
    const imageChange = ( event ) => {
        let file = event.target.files[0];

        if(file) {
            setImageFile(file)
            let url = URL.createObjectURL( file )
            setImageurl(url)
        }
    }

    async function fetchData () {
        try {
            const response = await api.get( "/auth/profile", 
                { 
                    headers: { 'Authorization': `Bearer ${user.token}`}
                }
            )
            setName( response.data.name )
            setDescription( response.data.description )
            setUsername( response.data.username )
            setImageurl( response.data.photo )
        } catch (err) {
            setError(err.response.data.error)
        }
    }

    const UpdateProfile = async () => {

        try {
            setError(null)
            const formData = new FormData()
            formData.append( 'name', name )
            formData.append( 'description', description )
            formData.append( 'photo', imageFile )
            const response  = await api.patch( "/auth/profile", formData, 
                { headers:
                    {'Authorization': `Bearer ${user.token}`}
                }
                
            )
            alert("Successfully Updated");

        } catch (err) {
            alert( err.response.data.error )
        }
    }

    useEffect( () => {
        fetchData()
    }, [] )

    return (
        <div className="profile" style={{ color: '#ffffffff', width: '50%', marginLeft: 'auto', marginRight: 'auto' }} >
            
            <div className="profile-photo"
                style={{ borderRadius: '50%', backgroundImage: `url(${imageurl})` , height: '10rem', width: '10rem', backgroundSize: 'cover', backgroundPosition: 'center',
                    marginLeft: 'auto', marginRight: 'auto', position: 'relative', overflow: 'initial'  }}
            >
                <div style={{ position: 'absolute', top: '50%', right: '-3px', cursor: 'pointer' }} >
                    +
                    <input type="file" onChange={imageChange} style={{  opacity: '0', position: "absolute", top: '0', left: '0', height: '100%', width: '100%' }} />
                </div>
            </div>

            <div style={{ textAlign: "center" }} > {username}
                <button onClick={logout} > Logout </button>
            </div>
            

            <div className="grid-container"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', gap: '.5rem', marginTop: '3rem', padding: '.5rem', color: 'var(--color5)' }}
            >
                <div> Name </div>
                <input value={name} onChange={ (e) => setName( e.target.value ) } />
                
                <div> Description </div>
                <input value={description} onChange={ (e) => setDescription( e.target.value ) } />
            
            </div>

            <div className="hover1" onClick={UpdateProfile} style={{ cursor: 'pointer', textAlign: 'center' }} > Update </div>

            
        </div>
    )
}

