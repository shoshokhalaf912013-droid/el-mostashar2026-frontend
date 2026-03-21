import { useEffect,useRef } from "react"

export default function BoardCanvas({
tool,
color,
brushSize,
undoRef,
redoRef,
clearRef
}){

const canvasRef = useRef(null)
const tempCanvasRef = useRef(null)

const drawing = useRef(false)

const startX = useRef(0)
const startY = useRef(0)

const history = useRef([])
const redoStack = useRef([])

/* refs للأداة واللون والحجم */

const toolRef = useRef(tool)
const colorRef = useRef(color)
const sizeRef = useRef(brushSize)

useEffect(()=>{toolRef.current=tool},[tool])
useEffect(()=>{colorRef.current=color},[color])
useEffect(()=>{sizeRef.current=brushSize},[brushSize])

useEffect(()=>{

const canvas = canvasRef.current
const tempCanvas = tempCanvasRef.current

const ctx = canvas.getContext("2d")
const tempCtx = tempCanvas.getContext("2d")

ctx.lineCap="round"

function resize(){

const rect = canvas.parentElement.getBoundingClientRect()

canvas.width = rect.width
canvas.height = rect.height

tempCanvas.width = rect.width
tempCanvas.height = rect.height

}

resize()
window.addEventListener("resize",resize)

function getPos(e){

const rect = tempCanvas.getBoundingClientRect()

return{
x:e.clientX-rect.left,
y:e.clientY-rect.top
}

}

function save(){

history.current.push(canvas.toDataURL())
redoStack.current=[]

}

/* بداية الرسم */

function start(e){

drawing.current=true

const pos=getPos(e)

startX.current=pos.x
startY.current=pos.y

const tool=toolRef.current

if(tool==="pen" || tool==="marker" || tool==="eraser"){

ctx.beginPath()
ctx.moveTo(pos.x,pos.y)

}

}

/* أثناء الرسم */

function move(e){

if(!drawing.current) return

const pos=getPos(e)

const tool=toolRef.current
const color=colorRef.current
const size=sizeRef.current

if(tool==="pen"){

ctx.globalCompositeOperation="source-over"
ctx.strokeStyle=color
ctx.lineWidth=size

ctx.lineTo(pos.x,pos.y)
ctx.stroke()

}

else if(tool==="marker"){

ctx.globalCompositeOperation="multiply"
ctx.strokeStyle=color
ctx.lineWidth=size*6
ctx.globalAlpha=0.25

ctx.lineTo(pos.x,pos.y)
ctx.stroke()

ctx.globalAlpha=1

}

else if(tool==="eraser"){

ctx.globalCompositeOperation="destination-out"
ctx.lineWidth=size*2

ctx.lineTo(pos.x,pos.y)
ctx.stroke()

}

else{

tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height)

tempCtx.strokeStyle=color
tempCtx.lineWidth=size

if(tool==="line"){

tempCtx.beginPath()
tempCtx.moveTo(startX.current,startY.current)
tempCtx.lineTo(pos.x,pos.y)
tempCtx.stroke()

}

else if(tool==="rect"){

tempCtx.strokeRect(
startX.current,
startY.current,
pos.x-startX.current,
pos.y-startY.current
)

}

else if(tool==="circle"){

const r=Math.sqrt(
Math.pow(pos.x-startX.current,2)+
Math.pow(pos.y-startY.current,2)
)

tempCtx.beginPath()
tempCtx.arc(startX.current,startY.current,r,0,Math.PI*2)
tempCtx.stroke()

}

}

}

/* نهاية الرسم */

function end(){

if(!drawing.current) return

drawing.current=false

const tool=toolRef.current

if(tool==="line" || tool==="rect" || tool==="circle"){

ctx.drawImage(tempCanvas,0,0)
tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height)

}

ctx.globalCompositeOperation="source-over"
ctx.globalAlpha=1

ctx.closePath()

save()

}

/* السماح بالسكرول بعجلة الماوس */

function handleWheel(e){

const stage = canvas.parentElement
stage.scrollTop += e.deltaY

}

/* events */

tempCanvas.addEventListener("mousedown",start)
tempCanvas.addEventListener("mousemove",move)
tempCanvas.addEventListener("mouseup",end)
tempCanvas.addEventListener("mouseleave",end)
tempCanvas.addEventListener("wheel",handleWheel)

return()=>{

tempCanvas.removeEventListener("mousedown",start)
tempCanvas.removeEventListener("mousemove",move)
tempCanvas.removeEventListener("mouseup",end)
tempCanvas.removeEventListener("mouseleave",end)
tempCanvas.removeEventListener("wheel",handleWheel)

window.removeEventListener("resize",resize)

}

},[])

/* Undo */

useEffect(()=>{

undoRef.current=()=>{

if(history.current.length<=1) return

const canvas=canvasRef.current
const ctx=canvas.getContext("2d")

redoStack.current.push(history.current.pop())

const img=new Image()
img.src=history.current[history.current.length-1]

img.onload=()=>{

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(img,0,0)

}

}

},[])

/* Redo */

useEffect(()=>{

redoRef.current=()=>{

if(redoStack.current.length===0) return

const canvas=canvasRef.current
const ctx=canvas.getContext("2d")

const state=redoStack.current.pop()

history.current.push(state)

const img=new Image()
img.src=state

img.onload=()=>{

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.drawImage(img,0,0)

}

}

},[])

/* Clear */

useEffect(()=>{

clearRef.current=()=>{

const canvas=canvasRef.current
const ctx=canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

history.current=[]
redoStack.current=[]

}

},[])

return(

<>
<canvas ref={canvasRef} className="boardCanvas"/>
<canvas ref={tempCanvasRef} className="tempCanvas"/>
</>

)

}