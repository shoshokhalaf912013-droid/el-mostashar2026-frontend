import "./LessonPlayer.css"
import {useEffect,useState} from "react"
import {useParams,useNavigate} from "react-router-dom"

import {doc,onSnapshot,updateDoc} from "firebase/firestore"
import {ref,uploadBytesResumable,getDownloadURL} from "firebase/storage"

import {db,storage} from "../../firebase"
import {useAuth} from "../../contexts/AuthContext"

export default function LessonPlayer(){

const {gradeId,subjectId,unitId,lessonId}=useParams()
const navigate=useNavigate()
const {role}=useAuth()

const [lesson,setLesson]=useState(null)

const [videoUrl,setVideoUrl]=useState("")
const [pdfUrl,setPdfUrl]=useState("")

const [youtubeInput,setYoutubeInput]=useState("")

const [videoProgress,setVideoProgress]=useState(0)
const [pdfProgress,setPdfProgress]=useState(0)

const lessonRef=doc(
db,
"grades",gradeId,
"subjects",subjectId,
"units",unitId,
"lessons",lessonId
)

useEffect(()=>{

const unsub=onSnapshot(lessonRef,(snap)=>{

if(!snap.exists()){
navigate("/")
return
}

const data=snap.data()

setLesson(data)
setVideoUrl(data.videoUrl || "")
setPdfUrl(data.pdfUrl || "")

})

return()=>unsub()

},[])

const uploadVideo=(file)=>{

if(!file)return

const storageRef=ref(storage,`lessons/${lessonId}/video_${Date.now()}`)

const task=uploadBytesResumable(storageRef,file)

task.on(

"state_changed",

(snapshot)=>{

const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
setVideoProgress(Math.floor(progress))

},

console.error,

async()=>{

const url=await getDownloadURL(task.snapshot.ref)

await updateDoc(lessonRef,{
videoUrl:url
})

setVideoUrl(url)

}

)

}

const uploadPdf=(file)=>{

if(!file)return

const storageRef=ref(storage,`lessons/${lessonId}/pdf_${Date.now()}`)

const task=uploadBytesResumable(storageRef,file)

task.on(

"state_changed",

(snapshot)=>{

const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
setPdfProgress(Math.floor(progress))

},

console.error,

async()=>{

const url=await getDownloadURL(task.snapshot.ref)

await updateDoc(lessonRef,{
pdfUrl:url
})

setPdfUrl(url)

}

)

}

const extractYoutubeId=(url)=>{

const reg=/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/

const match=url.match(reg)

return match?match[1]:null

}

const saveYoutube=async()=>{

const id=extractYoutubeId(youtubeInput)

if(!id){
alert("رابط غير صحيح")
return
}

const embed=`https://www.youtube.com/embed/${id}`

await updateDoc(lessonRef,{
videoUrl:embed
})

setVideoUrl(embed)

}

const joinWhiteboard=()=>{
navigate(`/student/live/${gradeId}/${subjectId}/${unitId}/${lessonId}`)
}

const openExam=()=>{
navigate(`/student/exam/${gradeId}/${subjectId}/${unitId}/${lessonId}`)
}

const addExam=()=>{
navigate(`/teacher/exam-builder/${gradeId}/${subjectId}/${unitId}/${lessonId}`)
}

const editExam=()=>{
navigate(`/teacher/exam-edit/${gradeId}/${subjectId}/${unitId}/${lessonId}`)
}

const previewExam=()=>{
navigate(`/teacher/exam-preview/${gradeId}/${subjectId}/${unitId}/${lessonId}`)
}

const deleteExam=()=>{
navigate(`/super-admin/exam-delete/${gradeId}/${subjectId}/${unitId}/${lessonId}`)
}

return(

<div className="lesson-player">

<button className="back-btn" onClick={()=>navigate(-1)}>
رجوع
</button>

<h2 className="lesson-title">
{lesson?.title || "الدرس"}
</h2>

<div className="lesson-block">

<h3>Whiteboard Live</h3>

<div className="button-row">

<button className="gold-btn" onClick={joinWhiteboard}>
دخول السبورة
</button>

<button className="red-btn">
إنهاء البث
</button>

</div>

</div>

<div className="lesson-block">

<h3>فيديو الدرس</h3>

{videoUrl &&(

videoUrl.includes("youtube")

?

<iframe
className="video-player"
src={videoUrl}
allowFullScreen
/>

:

<video
className="video-player"
controls
src={videoUrl}
/>

)}

<input
className="youtube-input"
placeholder="رابط يوتيوب"
value={youtubeInput}
onChange={(e)=>setYoutubeInput(e.target.value)}
/>

<div className="button-row">

<label className="gold-btn">

رفع فيديو

<input
hidden
type="file"
accept="video/*"
onChange={(e)=>uploadVideo(e.target.files[0])}
/>

</label>

<button className="gold-btn" onClick={saveYoutube}>
حفظ رابط
</button>

</div>

{videoProgress>0 &&(

<div className="progress-box">

<div
className="progress-bar"
style={{width:videoProgress+"%"}}
>

<span>{videoProgress}%</span>

</div>

</div>

)}

</div>

{/* PDF SECTION */}

<div className="lesson-block">

<h3>PDF</h3>

<div className="button-row">

<label className="gold-btn">

رفع الملف

<input
hidden
type="file"
accept="application/pdf"
onChange={(e)=>uploadPdf(e.target.files[0])}
/>

</label>

</div>

{pdfProgress>0 &&(

<div className="progress-box">

<div
className="progress-bar"
style={{width:pdfProgress+"%"}}
>

<span>{pdfProgress}%</span>

</div>

</div>

)}

{pdfUrl &&(

<div className="pdf-viewer">

<iframe
src={pdfUrl}
className="pdf-frame"
title="PDF Viewer"
/>

</div>

)}

</div>

<div className="lesson-block">

<h3>الامتحان</h3>

<div className="button-row">

<button className="gold-btn" onClick={addExam}>
إضافة الامتحان
</button>

<button className="gold-btn" onClick={openExam}>
فتح الامتحان
</button>

<button className="gold-btn" onClick={editExam}>
تعديل
</button>

<button className="gold-btn" onClick={previewExam}>
معاينة
</button>

<button className="red-btn" onClick={deleteExam}>
حذف
</button>

</div>

</div>

</div>

)

}