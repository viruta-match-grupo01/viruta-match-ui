import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MisReservasView} from '../src/modules/dev-c/Reservas.jsx';
import {RetirosView,RetiroDetalleView} from '../src/modules/dev-c/Retiros.jsx';
import {cancelBlockReason,pickupBlockReason,paymentBlockReason,paymentBody,findReservaId} from '../src/modules/dev-c/rules.js';
import {AppLayout} from '../src/components/layout/AppLayout.jsx';
import {StatusBadge} from '../src/components/ui/index.jsx';
const reserva={id:7,aviso_id:3,pedido_id:2,retazo_id:4,estado:'activa',confirmada_en:'2026-10-16T18:00:00.000Z',vence_en:'2026-10-17T18:00:00.000Z',material:'MDF',espesor_mm:18,alto_cm:45,ancho_cm:65,color:null,acabado:null,foto_url:null,precio:3510.5,forma_retiro:'Retiro presencial en sucursal',sucursal_id:1,sucursal_nombre:'Palermo Hollywood',sucursal_direccion:'Palermo Hollywood, CABA',pago_estado:'pendiente',plazo_retiro:'12 horas de atención'};
const detalle={...reserva,cliente_id:1,cliente_nombre:'Ignacio (cliente)',monto_a_pagar:3510.5};
const user={id:5,nombre:'Encargado',rol:'encargado',sucursal_id:1};
function render(element,cache=[]){const client=new QueryClient();for(const [key,data] of cache)client.setQueryData(key,data);return renderToStaticMarkup(React.createElement(QueryClientProvider,{client},React.createElement(MemoryRouter,null,element)));}
describe('Reglas de pantalla C',()=>{
 it('el retiro exige pago aprobado y reserva activa',()=>{expect(pickupBlockReason(detalle)).toMatch(/pago aprobado/);expect(pickupBlockReason({...detalle,pago_estado:'aprobado'})).toBeNull();expect(pickupBlockReason({...detalle,estado:'vencida',pago_estado:'aprobado'})).toMatch(/venció/);expect(pickupBlockReason({...detalle,estado:'concretada'})).toMatch(/ya está registrado/);});
 it('no se registra un segundo pago ni se cancela una reserva pagada',()=>{expect(paymentBlockReason({...detalle,pago_estado:'aprobado'})).toMatch(/ya está registrado/);expect(paymentBlockReason(detalle)).toBeNull();expect(cancelBlockReason({...reserva,pago_estado:'aprobado'})).toMatch(/pago registrado/);expect(cancelBlockReason({...reserva,estado:'cancelada'})).toMatch(/cancelada/);});
 it('el pago envía el importe mostrado y el comprobante sin espacios',()=>{expect(paymentBody(detalle,{medio:'transferencia',comprobante:'  OP-123 '})).toEqual({reserva_id:7,medio:'transferencia',comprobante:'OP-123',monto:3510.5});});
 it('la búsqueda acepta solo un número de reserva válido',()=>{expect(findReservaId('#12')).toBe(12);expect(findReservaId(' 3 ')).toBe(3);expect(findReservaId('0')).toBeNull();expect(findReservaId('1.5')).toBeNull();expect(findReservaId('abc')).toBeNull();});
});
describe('Pantallas C',()=>{
 it('el cliente ve plazo de retiro y comprobante, sin acción de pago anticipado',()=>{const s=render(React.createElement(MisReservasView,{user:{id:1,rol:'cliente'}}),[[['reservas',1],[reserva]]]);for(const text of ['Reserva #7','Pagar y retirar: 12 horas de atención','Comprobante de reserva: #7','Palermo Hollywood','Cancelar reserva','Pendiente'])expect(s).toContain(text);expect(s).not.toContain('Registrar pago');expect(s).not.toMatch(/Reservar y pagar/i);});
 it('sin reserva activa ofrece volver a los avisos',()=>{const s=render(React.createElement(MisReservasView,{user:{id:1,rol:'cliente'}}),[[['reservas',1],[{...reserva,estado:'concretada'}]]]);expect(s).toContain('No tenés una reserva activa');expect(s).toContain('href="/avisos"');expect(s).toContain('Reservas anteriores');});
 it('el encargado ve importe y estado de pago de su sucursal',()=>{const s=render(React.createElement(RetirosView,{user}),[[['retiros',5],[detalle]]]);for(const text of ['href="/retiros/7"','Ignacio (cliente)','1 activas'])expect(s).toContain(text);expect(s).toMatch(/3\.510,50/);});
 it('con pago pendiente el retiro queda bloqueado y explica por qué',()=>{const s=render(React.createElement(RetiroDetalleView,{user,id:'7'}),[[['retiros',5,'7'],detalle]]);expect(s).toContain('Registrar pago');expect(s).toContain('Registrá un pago aprobado antes del retiro.');expect(s).toMatch(/<button[^>]*disabled=""[^>]*>Registrar retiro<\/button>/);});
 it('con pago aprobado habilita el retiro y oculta el formulario de pago',()=>{const s=render(React.createElement(RetiroDetalleView,{user,id:'7'}),[[['retiros',5,'7'],{...detalle,pago_estado:'aprobado'}]]);expect(s).toContain('El pago ya está registrado como aprobado.');expect(s).not.toContain('Medio de pago');expect(s).toMatch(/<button type="button" class="button primary">Registrar retiro<\/button>/);});
 it('la ruta de detalle sin label no aparece en el menú',()=>{const s=renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(AppLayout,{user,moduleRoutes:[{path:'/retiros',label:'Pago y retiro',roles:['encargado']},{path:'/retiros/:id',roles:['encargado']}]},'x')));expect(s).toContain('Pago y retiro');expect(s).not.toContain('/retiros/:id');});
 it('los estados de reserva y pago se muestran traducidos',()=>{for(const [state,label] of [['activa','Activa'],['concretada','Concretada'],['vencida','Vencida'],['aprobado','Aprobado']])expect(renderToStaticMarkup(React.createElement(StatusBadge,{state}))).toContain(label);});
});
