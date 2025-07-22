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
            setName(response.data.name)
            setDescription( response.data.description )
            setImageurl( response.data.photo )
            setError( "Succesfully uploaded" )
        
        } catch (err) {
            setError( err.response.data.error )
        }


    }

    useEffect( () => {
        fetchData()
    }, [] )

    return (
        <div className="profile">
            <div id="top" className="flex-rowww">
                <div className="profile-photo"
                    style={{ backgroundImage: `url(${imageurl})`  }}
                >
                </div>

                <div id="top-right">
                    <h3> {name} </h3>
                    <h5> {username} </h5>
                </div>

            </div>
            
            
            <div className="grid-container">
            <div> Name </div>
            <input value={name} onChange={ (e) => setName( e.target.value ) } />
            

            <div> Description </div>
            <input value={description} onChange={ (e) => setDescription( e.target.value ) } />
            

            <div> Upload Image </div>
            <input type="file" onChange={imageChange} />
            

            </div>

            <button onClick={UpdateProfile} > Update </button>
            { error }
        </div>
    )
}

