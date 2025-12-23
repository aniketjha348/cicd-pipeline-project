export function isEmpty(data){
  if (data == null) return true; // null or undefined
  if (typeof data === "string") {
     if(data.trim()=="undefined" || data.trim() ==="null") return true
    return data.trim().length === 0;}
  if(data==="undefined" || data ==="null") return true
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === "object") return Object.keys(data).length === 0;
  if (typeof data === "number" || typeof data === "boolean" || typeof data === "function") return false;

  return false;
}
