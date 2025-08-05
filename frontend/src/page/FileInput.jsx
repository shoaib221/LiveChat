import { useContext, useState } from "react"
import { AuthContext } from "../context/authContext"
import { api } from "../api"

export const FileInput = (props) => {

    const [ mediaFiles, setMediaFiles ] = useState(null)
    const [ mediaURLs, setMediaURLs ] = useState(null)
    const { user, socket } = useContext(AuthContext)
    const [ mediaType, setMediaType ] = useState(null)
    const [ text, setText ] = useState(null)
    const formData = new FormData()

    const mediaChange = (event) => {
        if( event.target.files.length === 0 ) return;

        let files=[], urls=[]
        for( let x=0; x < event.target.files.length; x++ )
        {
            let var1 = event.target.files[x]
            console.log(var1, typeof var1)

            var1.mediaType = mediaType
            files.push( var1 );
            console.log( var1 );
            urls.push( { mediaType, mediaURL: URL.createObjectURL( var1 ) });
        }

        if( !mediaFiles ) {
            setMediaFiles( files )
            setMediaURLs( urls )
        }
        else {
            setMediaFiles( [ ...mediaFiles, ...files ] )
            setMediaURLs( [ ...mediaURLs, ...urls ] )
        }
    }

    if(socket) {
        socket.on( "newGroupMessage", (data) => {
            props.setMessages( [ ...props.messages, ...data ] );
        } )
    }


    const onSubmit = async () => {
        

        try {

            const formData = new FormData();
            mediaFiles.forEach( (file) => formData.append( file.mediaType, file ) );
            if(text) formData.append( 'text', text );
            formData.append( 'group_id', props.group_id );
            formData.append( 'sender', user.email );
            let response = null;
            if( mediaFiles ) response = await api.post( "/chat/group_message", formData, 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )

            setMediaFiles(null)
            setMediaURLs(null)
            setText(null)
            setMediaType(null)
            alert("successful")
        } catch(err) {
            alert( err.response.data.error )
        }
    }


    return (
        <div style={{ overflow: 'auto',  flexGrow: '1', backgroundColor: 'var(--color4)', color: 'var(--color5)', display: 'flex', flexDirection: 'column' }} >
            <div style={{ display: 'flex', justifyContent: 'space-evenly', minHeight: '3rem' }} >
                <div className='file-input-container' onClick={()=> setMediaType("video")} >
                    Video
                    <input className='file-input' accept="video/*" onChange={mediaChange} type='file' multiple  />
                </div>
                <div className='file-input-container' onClick={()=> setMediaType("audio")} >
                    Audio
                    <input className='file-input' accept="audio/*" onChange={mediaChange} type='file' multiple  />
                </div>
                <div className='file-input-container' onClick={()=> setMediaType("photo")} >
                    Photo
                    <input className='file-input' accept="image/*" onChange={mediaChange} type='file' multiple  />
                </div>
                
                <div className='file-input-container' onClick={()=> setMediaType("pdf")} >
                    PDF
                    <input className='file-input' accept=".pdf" onChange={mediaChange} type='file' multiple  />
                </div>
                <div style={{ cursor: 'pointer' }} onClick={()=> props.back()} >
                    X
                </div>
            </div>
            
            
            <div id='media' style={{  display: 'flex', minHeight: '11rem', gap: '.5rem' }} >
                { mediaURLs && mediaURLs.map( x => 
                    <>
                        { x.mediaType ==='video' && <video className="preview" controls src={x.mediaURL} ></video> }
                        { x.mediaType ==='audio' && <audio className="preview" src={x.mediaURL} controls ></audio> }
                        { x.mediaType ==='photo' && <img   className="preview" src={x.mediaURL}  /> }
                        { x.mediaType ==='pdf' &&   <embed className="preview"  src={x.mediaURL} type="application/pdf"  /> }
                    </>
                ) }
            </div> 
            
            <div style={{ minHeight: '3rem', display: 'flex' }} >

                <input placeholder="caption" value={text} onChange={(e)=> setText(e.target.value)} style={{ flexGrow: '1', paddingLeft: '.5rem', height: '90%' }} />
                <button onClick={onSubmit} >Send</button>
            </div>

            { mediaType }
            
        </div>
    )
}
