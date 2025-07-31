import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";


import { Chat } from "./chat";
import '../styles/groupchat.css';
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { SingleMessage } from "./chat";
import logo1 from '../images/shop_image3.jpg';
import { Groups } from "./Group";

const api = axios.create( { baseURL: "http://localhost:4000" } )

export const Contacts = () => {

    const [ option, setOption ] = useState("")

    return (
        <div className="contacts" style={{ display: "flex", backgroundColor: "#0d9350", width: "20%" }} >
            <div id="leftbar" >
                <div onClick={()=> setOption("friends")} > Friends </div>
                <div> Received Requests </div>
                <div> Sent Requests </div>
                <div> Search </div>
            </div>
            
            <div id="rightbar" >
                <div>

                </div>
            </div>
        </div>
    )
}




export const ChatHead = () => {
    const [ option, setOption ] = useState(null)

    return (
        <div id="chathead"  >
            <nav  >
                <div className="navop" onClick={()=> setOption("chat")} > Chat </div>
                <div className="navop" onClick={()=> setOption("groups")} > Groups   </div>
            </nav>


            
                { option ==="chat" && <Chat />  }
                { option ==="contacts" && <Contacts /> }
                { option ==="groups" && <Groups /> }
            
        </div>
    )
}