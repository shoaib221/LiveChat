import { useContext, useState } from "react"
import axios from "axios"
import { AuthContext } from "../context/authContext";

const api = axios.create( { baseURL: "http://localhost:4000" } );

export const FormDataDemo = () => {
    const [ email, setEmail ] = useState(null)
    const [ password, setPassword ] = useState(null)
    const [ audio, setAudio ] = useState(null)
    const [ audioPreview, setAudiPreview ] = useState(null)
    const [ video, setVideo ] = useState(null)
    const [ videoPreview, setVideoPreview ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ imageURL, setImageURL ] = useState(null)
    const { user } = useContext(AuthContext)

    const handleSubmit = async (  ) => {
        let formdata = new FormData(); 
        formdata.append( 'email', email );
        formdata.append( 'password', password );
        formdata.append( 'photo', image );

        try {
            const response = await api.post( '/chat/formtocloud',  formdata , 
            {
                headers: {'Authorization': `Bearer ${user.token}`}
            })

            setImageURL(response.data.url)
        } catch (err) {
            console.log( err.response.data.error )
        }

        
        
    }

    const imageChange = (e) => {
        let file = e.target.files[0]

        if(file)
        {
            setImage(file)
            setImagePreview( URL.createObjectURL(file) )
        }
    }

    return (
        <div className="formdata" >
            <div>
                <input 
                    type="email"  value={email} onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                />  
                <input 
                    type="password"  value={password} onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                />  

                <input type="file"   onChange={imageChange}  />  

                <img alt="image" src={imagePreview} style={{ height: "100px", width: "100px" }}  />
                <br />
                <img alt="image" src={imageURL} style={{ height: "100px", width: "100px", border: "2px solid white" }}  />

                <button onClick={handleSubmit} > Submit </button>
            </div>
        </div>
    )
}



export const FormDataDemo1 = () => {
    const [ email, setEmail ] = useState(null)
    const [ password, setPassword ] = useState(null)
    const [ audio, setAudio ] = useState(null)
    const [ audioPreview, setAudiPreview ] = useState(null)
    const [ video, setVideo ] = useState(null)
    const [ videoPreview, setVideoPreview ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ imagePreview, setImagePreview ] = useState(null)
    const { user } = useContext(AuthContext)

    const handleSubmit = async (  ) => {
        let formdata = new FormData(); 
        formdata.append( 'email', email );
        formdata.append( 'password', password );
        formdata.append( 'photo', image );

        try {
            const response = await api.post( '/chat/formdata',  formdata , 
            {
                headers: {'Authorization': `Bearer ${user.token}`}
            })
        } catch (err) {
            console.log( err.response.data.error )
        }

        
        
    }

    const imageChange = (e) => {
        let file = e.target.files[0]

        if(file)
        {
            setImage(file)
            setImagePreview( URL.createObjectURL(file) )
        }
    }

    return (
        <div className="formdata" >
            <div>
                <input 
                    type="email"  value={email} onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                />  
                <input 
                    type="password"  value={password} onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                />  

                <input 
                    type="file"   onChange={imageChange} 
                    
                />  
                <img alt="image" src={imagePreview} style={{ height: "100px", width: "100px" }}  />

                <button onClick={handleSubmit} > Submit </button>
            </div>
        </div>
    )
}


