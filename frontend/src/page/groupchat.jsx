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
        <div id="chathead" style={{ width: "100%", height: "100%",  backgroundColor: "#5d5f01ff"  }} >
            <nav style={{display: "flex", backgroundColor: "#937d0d", width: "100%", height: "10%", justifyContent: "space-evenly", alignItems: "center"}} >
                <div className="navop" onClick={()=> setOption("chat")} > Chat </div>
                <div className="navop" onClick={()=> setOption("groups")} > Groups   </div>
            </nav>


            <main style={{  height: "90%"  }} >
                { option ==="chat" && <Chat />  }
                { option ==="contacts" && <Contacts /> }
                { option ==="groups" && <Groups /> }
            </main>
        </div>
    )
}