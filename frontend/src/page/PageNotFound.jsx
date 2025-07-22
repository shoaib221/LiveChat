

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";


export const PageNotFound = () => {
    const navigate = useNavigate();
    const {user}  = useContext(AuthContext)

    return (
        <div>
            404 Page Not Found
            { !user && <button onClick={ () => { navigate('/auth') } } >Login</button> }
        </div>
    )
}

