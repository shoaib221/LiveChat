import '../styles/story.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd }  from '@fortawesome/free-solid-svg-icons'
import { useState, useContext, useEffect } from 'react'


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
        if( media.type === "text" && media.url==="" ) {
            alert("Empty Story Not Allowed")
            return
        }
        try {

            let formdata = new FormData()
            if( media.type === "text" ) formdata.append( media.type, media.url )
            else formdata.append( 'media', media.file )

            //console.log(formdata, media.type)

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





export const StoryBoard = (props) => {

    const [ curStory, setCurStory ] = useState(null);
    const lap = 2000;

    function roller () {
        
        setTimeout(()=> {
            if( curStory < props.stories.length - 1 )
                setCurStory( curStory+1 )
            else{
                setCurStory(null)
                props.setStart(null)
            }
        }, lap)

    }

    useEffect(()=> {
        if(curStory!== null) roller();
    }, [curStory])

    useEffect(() => {
        setCurStory( props.start )
    }, [])

    return (
        <div id='story-board' >
            <div onClick={()=> props.setStart(null) } style={{ position: 'absolute', right: '0' }} >X</div>
            { curStory === null ? <p>'Loading...'</p> : 
                <>

                    { props.stories[curStory].type ==='text' ? <p> { props.stories[curStory].url } </p> : <></> }
                    { props.stories[curStory].type === 'image' ? <img src={props.stories[curStory].url}  /> : <></> }
                    { props.stories[curStory].type === 'video' ? <video src={props.stories[curStory].url } /> : <></> }
                </>
            }
            
            <div id='progress-bar'></div>
        </div>
    )
}


export const Story = () => {
    const [ stories, setStories ] = useState([])
    const { user } = useContext(AuthContext)
    const [ start, setStart ] = useState(null)

    const AddStory = ( data ) => {
        setStories([ ...stories, data ])
    }

    const FetchStory = async (  ) => {

        try {
            let response = await api.get( "/chat/fetch-story", 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            )
            setStories(response.data);
        } catch(err) {
            if( err.response ) alert( err.response.data.error );
            else alert( err.message );
        }
    }

    useEffect(() => {
        FetchStory();
    }, [])


    return (
        <div id='story' >
            <CreateStory  AddStory={AddStory} />
            { start === null?  <></> :  <StoryBoard stories={stories} start={start} setStart={setStart} /> }
            <div id='create' onClick={ ()=> document.getElementById('create-story').style.display='flex' }  >
                <FontAwesomeIcon icon={faAdd} />
            </div>
            { stories && stories.map( (item , index) => (
                <div className='story-item' onClick={()=> setStart(index) } >
                { item.type === "text" && <p className='story-item' > { item.url } </p> }
                { item.type === "image" && <img className='story-item' src={ item.url} alt="photo" /> }
                { item.type === "video" && <video className='story-item' src={ item.url}  /> }
                </div>
            ) ) }

        </div>
    )
}



// let counter = 0;

// function incrementCounter() {
//   console.log("Counter:", counter);
//   counter++;
// }

// // Start the interval, calling incrementCounter every 1000 milliseconds (1 second)
// const intervalID = setInterval(incrementCounter, 1000);

// // Stop the interval after 5 seconds (5000 milliseconds)
// setTimeout(() => {
//   clearInterval(intervalID);
//   console.log("Interval stopped.");
// }, 5000);


