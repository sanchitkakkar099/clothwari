const bulkMainFilesDownload = (e,file) =>  {
    e.preventDefault()
    const a = document.createElement('a');
    a.href = file?.filepath;
    a.download = file.filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const imageFilesDownload = (e,file) =>  {
    e.preventDefault()
    const a = document.createElement('a');
    a.href = file?.filepath;
    a.download = file.filename;
    a.target = '_blank'
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const  bulkThumbnailFilesDownload = async (e,file) =>  {
    e.preventDefault()
    const a = document.createElement('a');
    a.href = file.filepath;
    a.download = file.filename;
    a.target = '_blank'
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export {bulkMainFilesDownload,bulkThumbnailFilesDownload,imageFilesDownload}