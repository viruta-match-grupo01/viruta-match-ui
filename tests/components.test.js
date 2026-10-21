import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {FormField,Button,StatusBadge,RetazoCard,FeedbackMessage} from '../src/components/ui/index.jsx';
import {AppLayout} from '../src/components/layout/AppLayout.jsx';
import {MemoryRouter} from 'react-router-dom';
const html=element=>renderToStaticMarkup(element);
describe('Contrato visual compartido',()=>{
 it('asocia label, ayuda y error al campo para lectores de pantalla',()=>{const s=html(React.createElement(FormField,{label:'Alto mínimo (cm)',error:'Indicá una medida válida'},React.createElement('input',{type:'number'})));expect(s).toContain('aria-invalid="true"');expect(s).toMatch(/for="([^"]+)"/);expect(s).toContain('aria-describedby=');expect(s).toContain('Indicá una medida válida');});
 it('una operación pendiente deshabilita doble envío y lo comunica',()=>{const s=html(React.createElement(Button,{busy:true},'Guardando…'));expect(s).toContain('disabled');expect(s).toContain('aria-busy="true"');expect(s).toContain('type="button"');});
 it('el estado no depende solo del color ni expone el enum técnico',()=>{const s=html(React.createElement(StatusBadge,{state:'pendiente_control'}));expect(s).toContain('Pendiente de control');});
 it('una tarjeta sin foto conserva medidas, precio y contexto',()=>{const s=html(React.createElement(RetazoCard,{retazo:{material:'MDF',espesor_mm:18,alto_cm:40,ancho_cm:60,precio:3000,sucursal_nombre:'Floresta',forma_retiro:'Presencial'}}));for(const text of ['Material sin foto','40','60','Floresta','Presencial'])expect(s).toContain(text);});
 it('no muestra funciones de otro rol en el menú',()=>{const s=html(React.createElement(MemoryRouter,null,React.createElement(AppLayout,{user:{nombre:'Cliente',rol:'cliente'},moduleRoutes:[{path:'/calidad',label:'Calidad',roles:['encargado']}]},'Contenido')));expect(s).toContain('Mis pedidos');expect(s).not.toContain('href="/calidad"');});
 it('errores y confirmaciones se anuncian con semántica distinta',()=>{expect(html(React.createElement(FeedbackMessage,null,'Error'))).toContain('role="alert"');expect(html(React.createElement(FeedbackMessage,{kind:'success'},'Guardado'))).toContain('role="status"');});
});
