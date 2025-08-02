import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";

import axios from "axios";
import '../styles/profile.css';

const api = axios.create( { baseURL: "http://localhost:4000" } )

export const Profile = () => {
    const { user } = useContext(AuthContext)
    const [ name, setName ] = useState(null)
    const [ username, setUsername ] = useState(null)
    const [ description, setDescription ] = useState(null)
    const [ imageurl, setImageurl ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [error, setError]  = useState(null)
    
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
                style={{ border: '1px solid white', backgroundImage: `url(${imageurl})` , height: '10rem', width: '10rem', backgroundSize: 'cover', backgroundPosition: 'center',
                        marginLeft: 'auto', marginRight: 'auto'  }}
            >
            </div>

            

            <div style={{ textAlign: "center" }} > {username}  </div>

            
            
            
            <div className="grid-container"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', gap: '.5rem', marginTop: '3rem' }}
            >
                <div> Name </div>
                <input value={name} onChange={ (e) => setName( e.target.value ) } />
                

                <div> Description </div>
                <input value={description} onChange={ (e) => setDescription( e.target.value ) } />
                

                <div> Upload Image </div>
                <input type="file" onChange={imageChange} style={{ cursor: 'pointer' }} />
            
            </div>

            <div onClick={UpdateProfile} style={{ cursor: 'pointer', textAlign: 'center' }} > Update </div>

            
        </div>
    )
}

