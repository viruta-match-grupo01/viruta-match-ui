import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {AppLayout} from '../src/components/layout/AppLayout.jsx';
import {equipoRoutes} from '../src/modules/equipo-routes.jsx';
import {devARoutes} from '../src/modules/dev-a/routes.jsx';
import {initialRetazoForm,formErrors,medidaError,quedaraDescartado,buildRetazoPayload,estimateQuery,thicknessLabel,FOTO_EJEMPLO} from '../src/modules/dev-a/retazo-form.js';

const form=(extra={})=>({...initialRetazoForm,alto_cm:'40',ancho_cm:'66',...extra});
const menu=(user,routes)=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(AppLayout,{user,moduleRoutes:routes},'x')));

describe('Dev A · formulario de carga',()=>{
  it('valida medidas enteras entre 1 y 120 cm, con mensajes en español',()=>{
    expect(medidaError('','Alto')).toContain('indicá');
    expect(medidaError('12.5','Alto')).toContain('entero');
    expect(medidaError('0','Alto')).toContain('mayor que 0');
    expect(medidaError('121','Ancho')).toContain('120');
    expect(medidaError('120','Ancho')).toBe('');expect(medidaError('1','Ancho')).toBe('');
  });
  it('exige forma de retiro y no muestra errores si todo está completo',()=>{
    expect(formErrors(form())).toEqual({});
    expect(formErrors(form({forma_retiro:' a '})).forma_retiro).toBeTruthy();
    expect(Object.keys(formErrors(form({alto_cm:'',ancho_cm:'x'})))).toEqual(['alto_cm','ancho_cm']);
  });
  it('avisa que una medida menor a 20 cm queda descartada, solo con medidas válidas',()=>{
    expect(quedaraDescartado(form({alto_cm:'15',ancho_cm:'40'}))).toBe(true);
    expect(quedaraDescartado(form({alto_cm:'20',ancho_cm:'40'}))).toBe(false);
    expect(quedaraDescartado(form({alto_cm:'',ancho_cm:'10'}))).toBe(false);
  });
  it('el cuerpo respeta el contrato: sin sucursal, operario, precio ni estado; color solo en melamina',()=>{
    const mdf=buildRetazoPayload(form());
    expect(mdf).toEqual({material:'MDF',espesor_mm:18,alto_cm:40,ancho_cm:66,color:null,acabado:null,foto_url:FOTO_EJEMPLO,forma_retiro:'Retiro presencial en sucursal'});
    for(const forbidden of ['sucursal_id','cargado_por','precio','estado','cargado_en']) expect(mdf).not.toHaveProperty(forbidden);
    const mela=buildRetazoPayload(form({material:'melamina',color:'roble',acabado:'brillante',espesor_mm:'5.5'}));
    expect(mela).toMatchObject({material:'melamina',espesor_mm:5.5,color:'roble',acabado:'brillante'});
    expect(buildRetazoPayload(form({material:'aglomerado',color:'roble'})).color).toBeNull();
  });
  it('la consulta de precio solo existe con medidas válidas e incluye color solo en melamina',()=>{
    expect(estimateQuery(form({alto_cm:''}))).toBeNull();
    expect(estimateQuery(form())).toBe('material=MDF&espesor_mm=18&alto_cm=40&ancho_cm=66');
    expect(estimateQuery(form({material:'melamina',color:'roble'}))).toContain('color=roble');
  });
  it('los espesores se muestran con coma decimal',()=>{expect(thicknessLabel(5.5)).toBe('5,5');expect(thicknessLabel(18)).toBe('18');});
});

describe('Dev A · registro de pantallas',()=>{
  it('registra solo las rutas propuestas del mapa, cada una para su rol',()=>{
    const byPath=Object.fromEntries(devARoutes.map(r=>[r.path,r.roles]));
    expect(byPath).toEqual({'/incentivos':['operario','encargado'],'/retazos':['operario'],'/retazos/nuevo':['operario'],'/calidad':['encargado'],'/calidad/:id':['encargado'],'/precios':['duenio']});
    for(const r of devARoutes) expect(equipoRoutes).toContain(r);
  });
  it('cada rol ve en el menú solo sus funciones y las rutas con :id no aparecen',()=>{
    const operario=menu({nombre:'Op',rol:'operario'},equipoRoutes),encargado=menu({nombre:'En',rol:'encargado'},equipoRoutes),duenio=menu({nombre:'Du',rol:'duenio'},equipoRoutes),cliente=menu({nombre:'Cl',rol:'cliente'},equipoRoutes);
    expect(operario).toContain('href="/retazos"');expect(operario).not.toContain('/calidad');expect(operario).not.toContain('/precios');expect(operario).not.toContain('/retazos/nuevo');
    expect(encargado).toContain('href="/calidad"');expect(encargado).not.toContain('/retazos');expect(encargado).not.toContain(':id');
    expect(duenio).toContain('href="/precios"');expect(duenio).toContain('href="/reportes"');
    for(const path of ['/retazos','/calidad','/precios']) expect(cliente).not.toContain(`href="${path}"`);
  });
  it('una ruta sin menu:false conserva el comportamiento de B y C',()=>{
    expect(menu({nombre:'C',rol:'cliente'},[{path:'/reservas',label:'Mi reserva',roles:['cliente']}])).toContain('href="/reservas"');
  });
});
