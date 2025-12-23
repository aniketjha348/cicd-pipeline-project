export function extractDriveFileId(url:string) {
  try {
   

    // Check if URL hostname is Google Drive
   const id=idExtract(url)
   if(id){
  //  return `https://lh3.googleusercontent.com/d/${id}` 

  return `https://drive.google.com/thumbnail?id=${id}`
   return `https://drive.google.com/uc?export=view&id=${id}`
   }
    return url; // Not a recognized Drive URL or no ID found
  } catch (e) {
    return null; // Invalid URL input
  }
}

const idExtract=(url:string)=>{
     const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
     if (
      hostname === "drive.google.com" || 
      hostname === "docs.google.com" || 
      hostname === "drive.googleusercontent.com"
    ) {
      // Try multiple patterns for file ID extraction
      // Pattern 1: /file/d/<ID>/
      let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return match[1];

      // Pattern 2: ?id=<ID> in query params
      const idParam = parsedUrl.searchParams.get("id");
      if (idParam) return idParam;

      // Pattern 3: /uc?export=view&id=<ID>
      match = url.match(/uc\?export=.+&id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return match[1];
    }
}