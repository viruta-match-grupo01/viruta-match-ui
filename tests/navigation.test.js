import {it,expect} from 'vitest';
import {destinationAfterLogin} from '../src/shared/navigation.js';
it('cambiar cliente por dueño abre reportes, sin dejarlo en pedidos restringidos',()=>{expect(destinationAfterLogin({rol:'duenio'},'/pedidos')).toBe('/reportes');});
it('login desde enlace de aviso conserva el retazo ofrecido para el cliente',()=>{expect(destinationAfterLogin({rol:'cliente'},'/avisos/12')).toBe('/avisos/12');});
it('un enlace interno o externo no habilitado no se usa como redirección',()=>{expect(destinationAfterLogin({rol:'operario'},'/reportes')).toBe('/modulos');expect(destinationAfterLogin({rol:'cliente'},'https://otra.invalid')).toBe('/pedidos');});
