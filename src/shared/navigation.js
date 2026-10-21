/** Conservar enlaces de avisos del cliente; al cambiar de rol entrar en su pantalla propia. */
export function destinationAfterLogin(user,pathname='/'){
 if(user.rol==='cliente')return /^\/avisos\/[1-9]\d*$/.test(pathname)?pathname:'/pedidos';
 return user.rol==='duenio'?'/reportes':'/modulos';
}
