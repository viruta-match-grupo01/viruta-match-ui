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
