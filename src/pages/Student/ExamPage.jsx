import "./ExamPage.css"
import {useEffect,useState} from "react"
import {useParams,useNavigate} from "react-router-dom"

import {doc,getDoc,collection,addDoc} from "firebase/firestore"
import {db} from "../../firebase"
import {useAuth} from "../../contexts/AuthContext"

import ExamTimer from "../../components/ExamTimer";
import QuestionCard from "../../components/QuestionCard";

export default function ExamPage(){

const {gradeId,subjectId,unitId,lessonId}=useParams()
const {user}=useAuth()
const navigate=useNavigate()

const [exam,setExam]=useState(null)
const [answers,setAnswers]=useState({})
const [submitted,setSubmitted]=useState(false)

const examRef=doc(
db,
"grades",gradeId,
"subjects",subjectId,
"units",unitId,
"lessons",lessonId,
"exam","main"
)

useEffect(()=>{

loadExam()

preventCheating()

},[])

const loadExam=async()=>{

const snap=await getDoc(examRef)

if(!snap.exists()){
alert("لا يوجد امتحان")
navigate(-1)
return
}

setExam(snap.data())

}

const preventCheating=()=>{

/* منع النسخ */

document.addEventListener("copy",(e)=>e.preventDefault())

/* منع كليك يمين */

document.addEventListener("contextmenu",(e)=>e.preventDefault())

/* منع PrintScreen */

document.addEventListener("keyup",(e)=>{

if(e.key==="PrintScreen"){
alert("تصوير الشاشة غير مسموح")
}

})

/* منع تغيير التبويب */

document.addEventListener("visibilitychange",()=>{

if(document.hidden){
alert("تم الخروج من الامتحان")
submitExam()
}

})

}

const selectAnswer=(qIndex,option)=>{

setAnswers({
...answers,
[qIndex]:option
})

}

const calculateScore=()=>{

let score=0

exam.questions.forEach((q,i)=>{

if(answers[i]===q.correct){
score++
}

})

return score

}

const submitExam=async()=>{

if(submitted)return

setSubmitted(true)

const score=calculateScore()

await addDoc(

collection(db,"examResults"),

{

userId:user.uid,

lessonId,

score,

total:exam.questions.length,

answers,

date:Date.now()

}

)

navigate("/student/exam-result",{

state:{
score,
total:exam.questions.length
}

})

}

if(!exam){

return <div className="exam-loading">تحميل الامتحان...</div>

}

return(

<div className="exam-page">

<h2 className="exam-title">

{exam.title || "الامتحان"}

</h2>

{/* TIMER */}

<ExamTimer

minutes={exam.timeLimit || 60}

onFinish={submitExam}

/>

{/* QUESTIONS */}

<div className="questions-container">

{exam.questions.map((q,i)=>(

<QuestionCard

key={i}

index={i}

question={q}

selected={answers[i]}

onSelect={selectAnswer}

/>

))}

</div>

{/* SUBMIT */}

<button

className="submit-exam"

onClick={submitExam}

disabled={submitted}

>

تسليم الامتحان

</button>

</div>

)

}