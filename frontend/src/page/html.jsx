import audio1 from "../images/goat-sound.mp3"
import video1 from "../images/tiny.mp4"

export const Html = () => {

    return (
        <div className="html" >
            
            <audio controls src={audio1}  style={{ height: "50px", width: "400px" }}  ></audio>
            <video controls src={video1} style={{ height: "300px", width: "400px" }} ></video>
            
        </div>
    )
}