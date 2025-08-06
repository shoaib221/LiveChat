import { useContext, useState } from "react"
import { AuthContext } from "../context/authContext"
import { api } from "../api"

export const FileInput = (props) => {    
    const [ mediaURLs, setMediaURLs ] = useState([])
    const [ mediaType, setMediaType ] = useState(null)


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

        if( !props.mediaFiles ) {
            props.setMediaFiles( files )
            setMediaURLs( urls )
        }
        else {
            props.setMediaFiles( [ ...props.mediaFiles, ...files ] )
            setMediaURLs( [ ...mediaURLs, ...urls ] )
        }
    }





    return (
        <div style={{ gap: '.5rem', overflow: 'auto',  flexGrow: '1', backgroundColor: 'var(--color4)', color: 'var(--color5)', display: 'flex', flexDirection: 'column' }} >
            
            
            <div id='media' style={{  display: 'flex', flexGrow: '1', gap: '.5rem' }} >
                { mediaURLs && mediaURLs.map( x => 
                    <>
                        { x.mediaType ==='video' && <video className="preview" controls src={x.mediaURL} ></video> }
                        { x.mediaType ==='audio' && <audio className="preview" src={x.mediaURL} controls ></audio> }
                        { x.mediaType ==='photo' && <img   className="preview" src={x.mediaURL}  /> }
                        { x.mediaType ==='pdf' &&   <embed className="preview"  src={x.mediaURL} type="application/pdf"  /> }
                    </>
                ) }
            </div>


            <div style={{ display: 'flex', justifyContent: 'space-evenly', minHeight: '2rem' }} >
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
                
            </div> 
            
        </div>
    )
}
