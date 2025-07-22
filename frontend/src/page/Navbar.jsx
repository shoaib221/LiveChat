
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/auth";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Profile } from "../auth";


export const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useContext(AuthContext);

    return (
        
        <div className="navbar"  >
                        
            <div className="cendiv" > <Link className="link" to="/" > Home </Link> </div>
            <div className="cendiv" > <Link className="link" to='/product' > Product </Link> </div>
            <div className="cendiv" > <Link className="link" to="/orders"> Orders </Link> </div>
            <div className="cendiv" > <Link className="link" to="/style"> Style </Link> </div>
            <div className="cendiv" > <Link className="link" to="/profile"> Profile </Link> </div>
            <div className="cendiv" > <Link className="link" to="/chat"> Chat </Link> </div>

            { user && 
                <div >  
                    { user.email }  
                    <button onClick={logout} > Logout </button>  
                </div>  
            }
             
        </div>
        
    )
}

export const Footer1 = () =>
{


    return (
        <div className="footer" >
            <div className="footer-child" > Hello </div>
        </div>
    )
}

export const Footer2 = () =>
{


    return (
        <div className="footer" >
            <div className="footer-child" > Hello </div>
            <div className="footer-child" > Hello </div>
            <div className="footer-child" > Hello </div>
            <div className="footer-child" > Hello </div>
            <div className="footer-child" > Hello </div>
        </div>
    )
}


export const Footer3 = () => {
    return (
        <div>

        </div>
    )
}

export const Footer4 = () => {
    return (
        <div>

        </div>
    )
}

export const Footer5 = () => {
    return (
        <div>

        </div>
    )
}