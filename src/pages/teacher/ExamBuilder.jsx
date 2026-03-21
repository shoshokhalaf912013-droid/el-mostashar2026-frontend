import { useState,useEffect } from "react"
import { doc,setDoc } from "firebase/firestore"
import { db } from "../../firebase"
import "./ExamBuilder.css"

/* ================= shuffle ================= */

function shuffle(arr){

const a=[...arr]

for(let i=a.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1))
;[a[i],a[j]]=[a[j],a[i]]

}

return a
}

/* ================= component ================= */

export default function ExamPlayer({

examId,
studentId,
title,
timeLimit,
questions

}){

const examKey="exam_"+examId+"_"+studentId

/* منع فتح الامتحان مرتين */

const opened=localStorage.getItem(examKey)

if(opened==="finished"){

return(

<div style={{padding:40,color:"red"}}>

لا يمكنك دخول الامتحان مرة أخرى

</div>

)

}

/* ترتيب مختلف للأسئلة */

const randomized=shuffle(

questions.map(q=>({

...q,
options:shuffle(q.options)

}))

)

const [qList]=useState(randomized)
const [current,setCurrent]=useState(0)
const [answers,setAnswers]=useState(Array(qList.length).fill(null))
const [finished,setFinished]=useState(false)
const [score,setScore]=useState(0)
const [timeLeft,setTimeLeft]=useState(timeLimit*60)
const [warnings,setWarnings]=useState(0)

/* ================= camera ================= */

useEffect(()=>{

async function startCamera(){

try{

const stream=await navigator.mediaDevices.getUserMedia({

video:true,
audio:false

})

const video=document.getElementById("examCamera")

if(video){

video.srcObject=stream
video.play()

}

}catch(err){

alert("يجب تشغيل الكاميرا لدخول الامتحان")
finishExam()

}

}

startCamera()

},[])

/* ================= منع النسخ ================= */

useEffect(()=>{

function block(e){

e.preventDefault()
alert("النسخ غير مسموح أثناء الامتحان")

}

document.addEventListener("copy",block)
document.addEventListener("paste",block)
document.addEventListener("cut",block)

return()=>{

document.removeEventListener("copy",block)
document.removeEventListener("paste",block)
document.removeEventListener("cut",block)

}

},[])

/* ================= منع right click ================= */

useEffect(()=>{

function blockRight(e){

e.preventDefault()
alert("زر الفأرة الأيمن غير مسموح")

}

document.addEventListener("contextmenu",blockRight)

return()=>document.removeEventListener("contextmenu",blockRight)

},[])

/* ================= تغيير التبويب ================= */

useEffect(()=>{

function handle(){

if(document.hidden){

if(warnings===0){

alert("تحذير: الخروج مرة أخرى سيغلق الامتحان")
setWarnings(1)

}else{

alert("تم إنهاء الامتحان بسبب تغيير التبويب")
finishExam()

}

}

}

document.addEventListener("visibilitychange",handle)

return()=>document.removeEventListener("visibilitychange",handle)

},[warnings])

/* ================= تصغير المتصفح ================= */

useEffect(()=>{

function minimize(){

if(document.visibilityState==="hidden"){

finishExam()

}

}

window.addEventListener("blur",minimize)

return()=>window.removeEventListener("blur",minimize)

},[])

/* ================= المؤقت ================= */

useEffect(()=>{

if(timeLeft<=0){

finishExam()
return

}

const t=setInterval(()=>{

setTimeLeft(v=>v-1)

},1000)

return()=>clearInterval(t)

},[timeLeft])

/* ================= اختيار إجابة ================= */

function choose(i){

const a=[...answers]
a[current]=i
setAnswers(a)

}

/* ================= إنهاء الامتحان ================= */

async function finishExam(){

let correct=0

qList.forEach((q,i)=>{

if(answers[i]===q.correct) correct++

})

setScore(correct)
setFinished(true)

localStorage.setItem(examKey,"finished")

/* إرسال النتيجة */

await setDoc(

doc(db,"examResults",examId+"_"+studentId),

{

examId,
studentId,
score:correct,
total:qList.length,
date:Date.now()

}

)

}

/* ================= progress ================= */

const progress=((current+1)/qList.length)*100

/* ================= result ================= */

if(finished){

return(

<div style={{padding:40}}>

<h2>{title}</h2>

<h3>النتيجة</h3>

<p>

{score} / {qList.length}

</p>

</div>

)

}

const q=qList[current]

/* ================= UI ================= */

return(

<div className="examBuilder">

<h2>{title}</h2>

{/* الكاميرا */}

<div className="cameraBox">

<video
id="examCamera"
autoPlay
muted
width="180"
height="120"
/>

</div>

{/* الوقت */}

<div>

الوقت المتبقي:

{Math.floor(timeLeft/60)} :
{("0"+(timeLeft%60)).slice(-2)}

</div>

{/* progress */}

<div className="progressBar">

<div
className="progressFill"
style={{width:progress+"%"}}
/>

</div>

{/* السؤال */}

<div className="questionBox">

<h3>

السؤال {current+1}

</h3>

<p>{q.title}</p>

{q.options.map((op,i)=>(

<div
key={i}
className="optionRow"
onClick={()=>choose(i)}
style={{
background:answers[current]===i ? "#333" : ""
}}
>

<span>

{["أ","ب","ج","د"][i]}

</span>

<span>{op.text}</span>

</div>

))}

</div>

{/* التنقل */}

<div className="buttons">

<button
className="goldBtn"
disabled={current===0}
onClick={()=>setCurrent(c=>c-1)}
>

السابق

</button>

{current<qList.length-1 ? (

<button
className="goldBtn"
onClick={()=>setCurrent(c=>c+1)}
>

التالي

</button>

):( 

<button
className="goldBtn"
onClick={finishExam}
>

إنهاء الامتحان

</button>

)}

</div>

</div>

)

}