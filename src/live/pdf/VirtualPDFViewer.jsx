import { useEffect, useRef } from "react"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function VirtualPDFViewer({ fileUrl }) {

  const containerRef = useRef(null)

  useEffect(() => {

    if(!fileUrl) return

    loadPDF()

  }, [fileUrl])


  async function loadPDF(){

    const container = containerRef.current
    if(!container) return

    container.innerHTML = ""

    const pdf = await pdfjsLib.getDocument(fileUrl).promise

    console.log("PDF Pages:", pdf.numPages)

    for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++){

      const page = await pdf.getPage(pageNum)

      const viewport = page.getViewport({ scale: 1.5 })

      /* صفحة PDF */

      const pageDiv = document.createElement("div")
      pageDiv.className = "pdf-page"

      /* Canvas */

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      await page.render(renderContext).promise

      pageDiv.appendChild(canvas)
      container.appendChild(pageDiv)

    }

  }

  return (
    <div className="virtual-pdf" ref={containerRef}></div>
  )
}