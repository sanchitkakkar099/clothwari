import html2pdf from 'html2pdf.js'

export const pdfGenerator = (id,fileName) => {
    console.log('fileName',fileName);
    const domElement = document.getElementById(id)
    const option = {
        margin:15,
        filename:fileName,
        image:{type :"jpeg",quality:1},
        html2canvas:{scale:2,letterRendering:true},
        jsPDF:{unit:"pt",format:'letter',orientation:'portrait'},
    }
    html2pdf().from(domElement).set(option).save()
}

