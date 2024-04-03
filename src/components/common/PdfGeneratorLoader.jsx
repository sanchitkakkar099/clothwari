import React from 'react'
import "./pdfgeneratorloader.css"

function PdfGeneratorLoader() {
  return (
    <div className="loader-container">
    <div className="loader">
  <div className="loader-inner"></div>
  <div className="loader-text">Generating..</div>
</div>
  </div>
  )
}

export default PdfGeneratorLoader
