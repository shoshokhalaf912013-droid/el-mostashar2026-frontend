import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"

import { db } from "../../firebase"

export default function ExamEdit(){

const {gradeId,subjectId,unitId,lessonId}=useParams()

const navigate=useNavigate()

const [examId,setExamId]=useState(null)
const [questions,setQuestions]=useState([])
const [loading,setLoading]=useState(true)

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

if(snap.empty){

alert("لا يوجد امتحان لهذا الدرس")

navigate(-1)

return
}

const docSnap=snap.docs[0]

setExamId(docSnap.id)

setQuestions(docSnap.data().questions || [])

setLoading(false)

}

const updateQuestion=(index,key,value)=>{

const copy=[...questions]

copy[index][key]=value

setQuestions(copy)

}

const updateOption=(qIndex,oIndex,value)=>{

const copy=[...questions]

copy[qIndex].options[oIndex].text=value

setQuestions(copy)

}

const saveExam=async()=>{

const ref=doc(db,"exams",examId)

await updateDoc(ref,{
questions,
questionsCount:questions.length
})

alert("تم حفظ التعديلات")

navigate(-1)

}

if(loading) return <div style={{padding:40}}>Loading...</div>

return(

<div style={{maxWidth:900,margin:"auto",padding:30}}>

<h2>تعديل الامتحان</h2>

{questions.map((q,i)=>(

<div key={i} style={{border:"1px solid #ccc",padding:20,marginBottom:20}}>

<h3>السؤال {i+1}</h3>

<input
value={q.questionText}
onChange={(e)=>updateQuestion(i,"questionText",e.target.value)}
style={{width:"100%",marginBottom:10}}
/>

{q.options.map((o,j)=>(

<div key={j}>

<input
value={o.text}
onChange={(e)=>updateOption(i,j,e.target.value)}
style={{width:"100%",marginBottom:5}}
/>

</div>

))}

<select
value={q.correctAnswer}
onChange={(e)=>updateQuestion(i,"correctAnswer",e.target.value)}
>

<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
<option value="D">D</option>

</select>

<textarea
value={q.explanation || ""}
placeholder="شرح الإجابة"
onChange={(e)=>updateQuestion(i,"explanation",e.target.value)}
style={{width:"100%",marginTop:10}}
/>

</div>

))}

<button onClick={saveExam}>
حفظ التعديلات
</button>

</div>

)

}