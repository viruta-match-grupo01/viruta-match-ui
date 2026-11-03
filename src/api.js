/** Único cliente HTTP. Identidad siempre por cookie de sesión. */
export async function request(path,{method='GET',body}={}){
 const base=import.meta.env?.VITE_API_URL??'/api';
 // La API rechaza con 415 todo POST/PUT/PATCH/DELETE sin cuerpo JSON (req.is exige cuerpo): sin datos se envía {}.
 const payload=body===undefined&&method!=='GET'?{}:body;
 let response;
 try{response=await fetch(`${base.replace(/\/$/,'')}${path}`,{method,credentials:'include',headers:{'Content-Type':'application/json'},...(payload===undefined?{}:{body:JSON.stringify(payload)})});}
 catch{const error=new Error('No se pudo conectar con la API. Verificá que esté iniciada.');error.code='SIN_CONEXION';throw error;}
 const text=await response.text();let result;
 try{result=text?JSON.parse(text):null;}catch{const error=new Error('La API devolvió una respuesta inesperada.');error.status=response.status;throw error;}
 if(!response.ok){const error=new Error(result?.message??result?.error??'No se pudo completar la operación');error.status=response.status;error.code=result?.error;throw error;}
 return result;
}

/** La imagen se sube como binario autenticado, sin base64 ni credenciales en la URL. */
export async function uploadPhoto(file){
 if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Seleccioná una imagen JPG, PNG o WebP.');
 if(file.size>4*1024*1024||file.size===0)throw new Error('La foto debe ocupar entre 1 byte y 4 MB.');
 const base=import.meta.env?.VITE_API_URL??'/api';
 let res;
 try{res=await fetch(`${base.replace(/\/$/,'')}/fotos`,{method:'POST',credentials:'include',headers:{'Content-Type':file.type},body:file});}
 catch{throw new Error('No se pudo subir la foto; verificá la conexión.');}
 const result=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(result.message??'No se pudo cargar la fotografía.');
 return result;
}

/** Resuelve fotos privadas si la API está en otro host distinto al frontend. */
export function mediaUrl(value){
 if(typeof value!=='string'||!value.startsWith('/api/fotos/'))return value;
 const base=import.meta.env?.VITE_API_URL??'/api';
 try{return /^https?:\/\//.test(base)?new URL(base).origin+value:value;}catch{return value;}
}
