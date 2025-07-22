

import { useContext, useState } from "react";
import "../styles/test.css";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useViewTransitionState } from "react-router-dom";


const api = axios.create( {
    baseURL: "http://localhost:4000"
} )

const Image = () => {
    const { user } = useContext(AuthContext)
    const [ imagePreview, setImagePreview ] = useState(null)
    


    const handleChange = (event) => {
        let file = event.target.files[0];
        
        if(file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (  ) => {
                const base64image = reader.result
                setImagePreview(base64image)
                console.log(base64image)
            }
        }
    }

    const handleSubmit = async () => {
        
        try {
            const response = await api.post( "/chat/image", { image: imagePreview }, 
                { headers: { "Authorization" : `Bearer ${user.token}` } }
            )
            console.log( response.data );
        } catch (err) {
            console.log( err.response.data.error );
        }

    }

    return (
        <div>
            <img id="img1" src={imagePreview} alt='img1' style={{ height: "300px", width: "300px" }} />
            <input type="file" accept="image/*" onChange={handleChange} />
            <button onClick={handleSubmit} > Submit </button>
        </div>
    )
}



const Test1 = () => {

    const change = ( id ) => {
        let var1 = document.getElementById(id);
        var1.classList.replace( "regular", "special" );
    }

    return (
        <div id="test1" >
            <button id="div1" className="regular" onClick={ ()=> change("div1") } > Div 1  </ button>
            <button id="div2" className="regular" > Div 2  </ button>
            <button id="div3" className="regular" > Div 3  </ button>
            <button id="div4" className="regular" > Div 4  </ button>
            <button id="div5" className="regular" > Div 5  </ button>
        </div>
    )
}

export const Test = () => {

    
        
}