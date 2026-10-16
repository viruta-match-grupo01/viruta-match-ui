/** Único cliente HTTP. Identidad siempre por cookie de sesión. */
export async function request(path,{method='GET',body}={}){
 const base=import.meta.env?.VITE_API_URL??'/api';
 let response;
 try{response=await fetch(`${base.replace(/\/$/,'')}${path}`,{method,credentials:'include',headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});}
 catch{const error=new Error('No se pudo conectar con la API. Verificá que esté iniciada.');error.code='SIN_CONEXION';throw error;}
 const text=await response.text();let result;
 try{result=text?JSON.parse(text):null;}catch{const error=new Error('La API devolvió una respuesta inesperada.');error.status=response.status;throw error;}
 if(!response.ok){const error=new Error(result?.message??result?.error??'No se pudo completar la operación');error.status=response.status;error.code=result?.error;throw error;}
 return result;
}
