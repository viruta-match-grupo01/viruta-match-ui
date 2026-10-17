import React from 'react';
import {ConUsuario} from './ConUsuario.jsx';
import {Retazos} from './Retazos.jsx';
import {NuevoRetazo} from './NuevoRetazo.jsx';
import {Calidad,CalidadDetalle} from './Calidad.jsx';
import {Precios} from './Precios.jsx';
import {Incentivos} from './Incentivos.jsx';

/**
 * Rutas de A para equipo-routes.jsx. `menu:false` las oculta del menú lateral (formularios y
 * detalles a los que se llega desde otra pantalla). Menú por rol: operario → Mis cargas;
 * encargado → Control de calidad; dueño → Precios por m².
 */
export const devARoutes=[
  {path:'/incentivos',label:'Mis incentivos',roles:['operario','encargado'],element:<ConUsuario Screen={Incentivos}/>},
  {path:'/retazos',label:'Mis cargas',roles:['operario'],element:<ConUsuario Screen={Retazos}/>},
  {path:'/retazos/nuevo',label:'Cargar retazo',roles:['operario'],menu:false,element:<ConUsuario Screen={NuevoRetazo}/>},
  {path:'/calidad',label:'Control de calidad',roles:['encargado'],element:<ConUsuario Screen={Calidad}/>},
  {path:'/calidad/:id',label:'Control de retazo',roles:['encargado'],menu:false,element:<ConUsuario Screen={CalidadDetalle}/>},
  {path:'/precios',label:'Precios por m²',roles:['duenio'],element:<ConUsuario Screen={Precios}/>}
];
