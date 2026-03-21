import "./LiveClassRoom.css"
import { useState, useEffect } from "react"
import TeacherVideo from "../components/TeacherVideo"
import Whiteboard from "../board/Whiteboard"
import BiologyLab from "../labs/biology/BiologyLab"

export default function LiveClassRoom(){

const [stream,setStream] = useState(null)
const [showLab,setShowLab] = useState(false)

useEffect(()=>{

async function startCamera(){

try{

const s = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
})

setStream(s)

}catch{

console.log("camera not available")

}

}

startCamera()

},[])

return(

<div className="live-container">

<div className="teacher-area">
<TeacherVideo stream={stream}/>
</div>

<div className="whiteboard-wrapper">
<Whiteboard/>
</div>

<button
className="open-lab-btn"
onClick={()=>setShowLab(true)}
>
Biology Lab
</button>

{showLab && (

<div className="biology-lab-container">

<BiologyLab/>

<button
className="close-lab-btn"
onClick={()=>setShowLab(false)}
>
Close Lab
</button>

</div>

)}

</div>

)

}