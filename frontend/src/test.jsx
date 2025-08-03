import { useState } from "react"
import { api } from "./api"

export const Test = () => {
    const [ file, setFile ] = useState(null)
    const [ files, setFiles ] = useState(null)

    const send1 = async (  ) => {

    }

    const change1 = () => {

    }

    const send2 = async (  ) => {

    }

    const change2 = () => {

    }

    return (
        <div>
            Hello test
            <input type="file" multiple onChange={change1} /> <button onClick={send1} > Send</button> 
            <input type="file" onChange={change2} /> <button onClick={send2} >Send</button>
        </div>
    )
}