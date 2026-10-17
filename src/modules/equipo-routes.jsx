import React from 'react';
import {devARoutes} from './dev-a/routes.jsx';
import {Prototipo} from './Prototipo.jsx';
import {MisReservas} from './dev-c/Reservas.jsx';
import {Retiros,RetiroDetalle} from './dev-c/Retiros.jsx';
/** A y C importan sus pantallas aquí; el layout ya existe. Una ruta sin label no aparece en el menú (detalle). */
export const equipoRoutes=[
 ...devARoutes,
 {path:'/prototipo',label:'Herramientas del prototipo',roles:['duenio'],element:<Prototipo/>},
 // {path:'/retazos',label:'Retazos',roles:['operario'],element:<Retazos/>},
 // {path:'/calidad',label:'Control de calidad',roles:['encargado'],element:<Calidad/>},
 {path:'/reservas',label:'Mi reserva',roles:['cliente'],element:<MisReservas/>},
 {path:'/retiros',label:'Pago y retiro',roles:['encargado'],element:<Retiros/>},
 {path:'/retiros/:id',roles:['encargado'],element:<RetiroDetalle/>},
];
