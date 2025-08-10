import '../styles/story.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd }  from '@fortawesome/free-solid-svg-icons'
import { useState, useContext } from 'react'


import { api } from '../api'
import { AuthContext } from '../context/authContext'



export const CreateStory = (props) => {
    const [ media, setMedia ] = useState({ type: "text", file: null, url: "" })
    const { user } = useContext(AuthContext)
    const colorChoices = [ '#ff9754', '#346791', '#896661' ]
    const [ bgColor, setBGColor ] = useState("")


    const mediaChange = (event) => {
        let file = event.target.files[0];

        if(file) {
            console.log(file)
            let url = URL.createObjectURL(file);
            if( file.type.substring(0,5)==="image" )
            {
                setMedia( { type: 'image', file, url } )
            }
            else 
                setMedia( { type: 'video', file, url } )
        }
    }

    const submit = async () => {
        if( media.type === "text" && media.url==="" ) 
        {
            alert("Empty Story Not Allowed")
            return
        }
        try {
            let formdata = new FormData()
            if( media.type === "text" ) formdata.append( media.type, media.url )
            else formdata.append( 'media', media.file )

            console.log(formdata, media.type)

            const response = await api.post( "/chat/create-story", formdata, 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            );

            props.AddStory( response.data );
            setMedia({ type: "text", file: null, url: "" });
            document.getElementById('create-story').style.display='none'


        } catch (err) {
            if( err.response ) alert( err.response.data.error );
            else alert( err.message );
            
        }
    }

    return (
        <div id='create-story'  >
            <div style={{ cursor: 'pointer', backgroundColor: 'var(--color4)', textAlign: 'center' }} onClick={ ()=> document.getElementById('create-story').style.display='none' } > Cancel </div>
            { media.type === 'video' && <video src={ media.url } controls className='special' /> }
            { media.type === 'image' && <img src={media.url} className='special' /> }
            { media.type === 'text' && <textarea style={{ backgroundColor: `${bgColor}` }} onChange={(e) => setMedia({...media, url: e.target.value })}   value= {media.url} /> }

            
            <div style={{ display: 'flex', gap: '.3rem' }} >
                {  colorChoices.map( x => <div id={x} className='color-choice' style={{ backgroundColor: `${x}` }} onClick={() => setBGColor(x)} ></div> ) }
            </div>
            
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-evenly', backgroundColor: 'var(--color4)', width: '100%' }} >
                <div style={{ cursor: 'pointer' }} onClick={()=> setMedia({ type: 'text', url: "" })} > Text </div>
                <div style={{ cursor: 'pointer', position: 'relative' }} > Photo/Video
                    <input onChange={mediaChange} type="file" accept='image/*, video/*' className='hidden-input' />
                </div>
            </div>

            <div onClick={submit} style={{ margin: '.5rem', backgroundColor: 'var(--color4)', textAlign: 'center', cursor: 'pointer' }} > Create </div>

        </div>
    )
}


export const StoryItem =  (props) => {

    return (
        <div>
            { props.story.type }
        </div>
    )
}


export const Story = () => {
    const [ stories, setStories ] = useState([])

    const AddStory = ( data ) => {
        setStories([ ...stories, data ])
    }


    return (
        <div id='story' >
            <CreateStory  AddStory={AddStory} />
            <div id='create' onClick={ ()=> document.getElementById('create-story').style.display='flex' }  >
                <FontAwesomeIcon icon={faAdd} />
            </div>
            { stories && stories.map( item => <StoryItem story={item} /> ) }

        </div>
    )
}