import {describe,it,expect,vi,afterEach} from 'vitest';
import {request} from '../src/api.js';
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
const response=(data,status=200)=>({ok:status<400,status,text:async()=>JSON.stringify(data)});
describe('Cliente HTTP de la UI',()=>{
 it('usa cookie sin aceptar identidad suministrada por la pantalla',async()=>{vi.stubEnv('VITE_API_URL','/api');const fetch=vi.fn().mockResolvedValue(response([]));vi.stubGlobal('fetch',fetch);await request('/pedidos');expect(fetch).toHaveBeenCalledWith('/api/pedidos',expect.objectContaining({credentials:'include'}));expect(fetch.mock.calls[0][1].headers['X-Demo-User']).toBeUndefined();});
 it('configura API separada y envía JSON',async()=>{vi.stubEnv('VITE_API_URL','https://api.example.invalid/api/');const fetch=vi.fn().mockResolvedValue(response({id:1}));vi.stubGlobal('fetch',fetch);await request('/auth/login',{method:'POST',body:{email:'a@b.invalid',password:'test'}});expect(fetch.mock.calls[0][0]).toBe('https://api.example.invalid/api/auth/login');expect(JSON.parse(fetch.mock.calls[0][1].body).email).toBe('a@b.invalid');});
 it('conserva 401 para distinguir sesión faltante de servidor caído',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(response({error:'SESION_REQUERIDA',message:'Iniciá sesión'},401)));await expect(request('/auth/me')).rejects.toMatchObject({status:401,code:'SESION_REQUERIDA'});});
 it('no simula éxito si C todavía no está integrado',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(response({error:'MODULO_PENDIENTE',message:'Reservas pendiente'},501)));await expect(request('/reservas',{method:'POST',body:{aviso_id:1}})).rejects.toMatchObject({status:501});});
 it('un proxy HTML se informa como respuesta inesperada',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,status:200,text:async()=>'<html>Vite</html>'}));await expect(request('/pedidos')).rejects.toThrow('respuesta inesperada');});
 it('cancelar sin datos envía un cuerpo JSON vacío, requerido por la API',async()=>{const fetch=vi.fn().mockResolvedValue(response({estado:'cancelado'}));vi.stubGlobal('fetch',fetch);await request('/pedidos/1',{method:'DELETE'});expect(fetch.mock.calls[0][1].headers['Content-Type']).toBe('application/json');expect(fetch.mock.calls[0][1].body).toBe('{}');});
 it('un GET nunca envía cuerpo',async()=>{const fetch=vi.fn().mockResolvedValue(response([]));vi.stubGlobal('fetch',fetch);await request('/reservas');expect(fetch.mock.calls[0][1].body).toBeUndefined();});
 it('diferencia una falla de red de una sesión cerrada',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));await expect(request('/pedidos')).rejects.toMatchObject({code:'SIN_CONEXION'});});
});
