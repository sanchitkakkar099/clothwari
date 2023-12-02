const bulkMainFilesDownload = (e,files) =>  {
    e.preventDefault()
    for (const file of files) {
      const a = document.createElement('a');
      a.href = file?.filepath;
      a.download = file.filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

const  bulkThumbnailFilesDownload = async (e,files) =>  {
    e.preventDefault()
    for (const file of files) {
      try {
        const a = document.createElement('a');
        a.href = file.filepath;
        a.download = file.filename;
        a.target = '_blank'
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error(`Error downloading ${file}:`, error);
      }
    }
  }
  

  export {bulkMainFilesDownload,bulkThumbnailFilesDownload}