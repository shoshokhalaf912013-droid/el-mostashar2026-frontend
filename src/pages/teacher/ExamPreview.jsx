import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, query, where, getDocs } from "firebase/firestore"

import { db } from "../../firebase"

export default function ExamPreview(){

const {gradeId,subjectId,unitId,lessonId}=useParams()

const [exam,setExam]=useState(null)

useEffect(()=>{

loadExam()

},[])

const loadExam=async()=>{

const q=query(

collection(db,"exams"),

where("gradeId","==",gradeId),
where("subjectId","==",subjectId),
where("unitId","==",unitId),
where("type","==","lesson")

)

const snap=await getDocs(q)

if(!snap.empty){

setExam(snap.docs[0].data())

}

}

if(!exam) return <div style={{padding:40}}>لا يوجد امتحان</div>

return(

<div style={{maxWidth:900,margin:"auto",padding:30}}>

<h2>{exam.title}</h2>

{exam.questions?.map((q,i)=>(

<div key={i} style={{border:"1px solid #ccc",padding:20,marginBottom:20}}>

<h3>

السؤال {i+1}

</h3>

<p>{q.questionText}</p>

{q.options?.map((o)=>(
<div key={o.key}>
{o.key} - {o.text}
</div>
))}

</div>

))}

</div>

)

}