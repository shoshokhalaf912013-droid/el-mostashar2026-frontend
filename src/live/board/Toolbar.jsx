import { useState } from "react"

export default function Toolbar({
setTool,
setColor,
setBrushSize,
undo,
redo,
clearBoard,
toggleCalculator,
toggleBiologyLab
}){

const [showLabMenu,setShowLabMenu] = useState(false)

const toggleLabMenu = () => {
setShowLabMenu(prev => !prev)
}

const openLab = () => {
toggleBiologyLab()
setShowLabMenu(false)
}

return(

<div className="toolbarLayer">

<div className="toolbar">

<button className="toolBtn" onClick={()=>setTool("pen")}>Pen</button>

<button className="toolBtn" onClick={()=>setTool("marker")}>Mark</button>

<button className="toolBtn" onClick={()=>setTool("eraser")}>Erase</button>

<button className="toolBtn" onClick={()=>setTool("line")}>Line</button>

<button className="toolBtn" onClick={()=>setTool("rect")}>Rect</button>

<button className="toolBtn" onClick={()=>setTool("circle")}>Circle</button>

<select
className="sizeSelect"
onChange={(e)=>setBrushSize(Number(e.target.value))}
>
<option value="2">Thin</option>
<option value="4">Normal</option>
<option value="8">Thick</option>
</select>

<input
type="color"
className="colorPicker"
onChange={(e)=>setColor(e.target.value)}
/>

<button className="toolBtn" onClick={undo}>Undo</button>

<button className="toolBtn" onClick={redo}>Redo</button>

<button className="toolBtn" onClick={clearBoard}>Clear</button>

{/* زر الآلة الحاسبة بعد التعديل */}

<button
className="toolBtn"
onClick={toggleCalculator}
title="Calculator"
>
🧮
</button>

{/* زر المختبر */}

<div className="labMenuWrapper">

<button
className="toolBtn"
onClick={toggleLabMenu}
title="Biology Lab"
>
🧪
</button>

{showLabMenu && (

<div className="labDropdown">

<button
className="labItem"
onClick={openLab}
>
🫁 Respiratory System
</button>

<button
className="labItem"
onClick={openLab}
>
🫀 Circulatory System
</button>

<button
className="labItem"
onClick={openLab}
>
🧠 Nervous System
</button>

<button
className="labItem"
onClick={openLab}
>
🍽 Digestive System
</button>

</div>

)}

</div>

</div>

</div>

)

}