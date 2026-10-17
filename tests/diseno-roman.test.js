import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {it,expect} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {Cuenta,Calificacion,Administracion,InventarioView} from '../src/modules/PantallasComplementarias.jsx';
import {AppLayout} from '../src/components/layout/AppLayout.jsx';
import {Icon} from '../src/components/ui/Icon.jsx';
import {Reportes} from '../src/App.jsx';
function render(element,cache=[]){const client=new QueryClient({defaultOptions:{queries:{retry:false}}});for(const [key,value] of cache)client.setQueryData(key,value);return renderToStaticMarkup(React.createElement(QueryClientProvider,{client},React.createElement(MemoryRouter,null,element)));}
it('la navegación móvil tiene controles accesibles y conserva los permisos de cada ruta',()=>{
 const s=render(React.createElement(AppLayout,{user:{nombre:'Cliente',rol:'cliente'},moduleRoutes:[{path:'/cuenta',label:'Mi perfil',roles:['cliente']},{path:'/usuarios',label:'Usuarios y roles',roles:['duenio']}]},'Contenido'));
 expect(s).toContain('aria-controls="menu-principal"');expect(s).toContain('aria-expanded="false"');expect(s).toContain('href="#contenido"');expect(s).toContain('href="/cuenta"');expect(s).not.toContain('href="/usuarios"');
});
it('los íconos decorativos no cambian el nombre accesible de las acciones',()=>{const s=render(React.createElement(Icon,{name:'grid_view'}));expect(s).toContain('aria-hidden="true"');expect(s).not.toContain('http');});
it('el perfil refleja exclusivamente la sesión actual y no ofrece guardar preferencias sin API',()=>{const s=render(React.createElement(Cuenta),[[['session'],{id:12,nombre:'Cuenta doce',email:'doce@example.invalid',rol:'cliente'}]]);expect(s).toContain('doce@example.invalid');expect(s).toMatch(/readonly/i);expect(s).not.toContain('usuario1@example.invalid');expect(s).not.toContain('Guardar');expect(s).toContain('RF-08');});
it('calificación y puntos no inventan una escala, saldos o acciones de canje',()=>{const s=render(React.createElement(Calificacion));expect(s).toContain('Fuera del prototipo');expect(s).toContain('Fase 2');expect(s).not.toContain('<form');expect(s).not.toContain('42 puntos');expect(s).toContain('href="/reservas"');});
it('la administración describe permisos sin permitir elevación de rol o fabricar usuarios',()=>{const s=render(React.createElement(Administracion));expect(s).toContain('no otorga ni modifica accesos');expect(s).not.toContain('<select');expect(s).not.toContain('Carlos Gómez');expect(s).not.toContain('tokens activos');});
it('inventario y gráfico utilizan exclusivamente registros de sus consultas',()=>{
 const user={id:4,rol:'operario'};const rows=[{id:99,material:'MDF',espesor_mm:18,alto_cm:40,ancho_cm:60,precio:20,estado:'disponible',cargado_en:'2026-10-17T13:00:00Z'}];
 const inv=render(React.createElement(InventarioView,{user}),[[['retazos',4],rows]]);expect(inv).toContain('#99');expect(inv).toContain('ni presenta un inventario global');expect(inv).not.toContain('Estante A');
 const data={totales:{cargados:7,coincidencias:3,reservas:2,retiros:1,descartes:1},porcentaje_retiro:100/7,sucursales:[{id:1,nombre:'Sucursal de prueba',cargados:7,coincidencias:3,reservas:2,retiros:1,descartes:1}],cola:[],avisos_fallidos:[]};
 const report=render(React.createElement(Reportes,{user:{id:3,rol:'duenio'}}),[[['reportes',3],data]]);expect(report).toContain('Sucursal de prueba');expect(report).toContain('width:100%');expect(report).not.toContain('kg');expect(report).not.toContain('CO2');
});
