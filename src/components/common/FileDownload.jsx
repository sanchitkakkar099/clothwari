export const downloadFile = (e,fileUrl,fileName) => { 
    e.preventDefault()
    var link = document.createElement('a');
    link.href = fileUrl;
    link.target = "_blank"
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 