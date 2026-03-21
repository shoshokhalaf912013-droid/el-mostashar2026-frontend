import { useState, useRef } from "react"

import BoardCanvas from "./BoardCanvas"
import Toolbar from "./Toolbar"
import ScientificCalculator from "../tools/ScientificCalculator"
import VirtualPDFViewer from "../pdf/VirtualPDFViewer"
import RespiratoryScene from "../labs/biology/scenes/RespiratoryScene"

import "../styles/Whiteboard.css"

export default function Whiteboard(){

const [tool,setTool] = useState("pen")
const [color,setColor] = useState("#ff0000")
const [brushSize,setBrushSize] = useState(4)

const [showCalculator,setShowCalculator] = useState(false)
const [activeScene,setActiveScene] = useState(null)

const undoRef = useRef(null)
const redoRef = useRef(null)
const clearRef = useRef(null)

const [files,setFiles] = useState([])
const [activeFile,setActiveFile] = useState(null)

function handleFile(e){
  const file = e.target.files[0]
  if(!file) return

  const url = URL.createObjectURL(file)

  const newFile={
    name:file.name,
    url:url,
    type:file.type
  }

  setFiles(prev=>[...prev,newFile])
  setActiveFile(newFile)
}

return(

<div className="whiteboardContainer">

{/* Sidebar */}
<div className="liveSidebar">

<label className="addFileBtn">
+ إضافة ملف
<input type="file" onChange={handleFile} style={{display:"none"}}/>
</label>

<div className="filesList">
{files.map((file,index)=>(
<div
key={index}
className="fileItem"
onClick={()=>setActiveFile(file)}
>
{file.name}
</div>
))}
</div>

</div>

{/* Board Area */}
<div className="boardStage">

{/* File Layer */}
<div className="fileLayer">
<div className="fileBody">

{activeFile && activeFile.type.includes("image") && (
<img src={activeFile.url} className="boardImage" alt=""/>
)}

{activeFile && activeFile.type.includes("pdf") && (
<VirtualPDFViewer fileUrl={activeFile.url}/>
)}

</div>
</div>

{/* 🎯 3D Layer (بدون Canvas) */}
{activeScene === "respiratory" && (
<div className="r3fLayer">
<RespiratoryScene />
</div>
)}

{/* Drawing */}
<BoardCanvas
tool={tool}
color={color}
brushSize={brushSize}
undoRef={undoRef}
redoRef={redoRef}
clearRef={clearRef}
/>

{/* Toolbar */}
<Toolbar
setTool={setTool}
setColor={setColor}
setBrushSize={setBrushSize}
undo={()=>undoRef.current()}
redo={()=>redoRef.current()}
clearBoard={()=>clearRef.current()}
toggleCalculator={()=>setShowCalculator(prev=>!prev)}
toggleBiologyLab={()=>setActiveScene("respiratory")}
/>

</div>

{/* Calculator */}
{showCalculator && (
<div className="calculatorLayer">
<button className="closeCalc" onClick={()=>setShowCalculator(false)}>
✕
</button>
<ScientificCalculator/>
</div>
)}

</div>

)
}