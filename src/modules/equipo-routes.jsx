import React from 'react';
import {Cuenta,Inventario,Administracion,Calificacion} from './PantallasComplementarias.jsx';
import {devARoutes} from './dev-a/routes.jsx';
import {Prototipo} from './Prototipo.jsx';
import {MisReservas} from './dev-c/Reservas.jsx';
import {Retiros,RetiroDetalle} from './dev-c/Retiros.jsx';
/** A y C importan sus pantallas aquí; el layout ya existe. Una ruta sin label no aparece en el menú (detalle). */
export const equipoRoutes=[
 ...devARoutes,
 {path:'/reservas',label:'Mi reserva',roles:['cliente'],element:<MisReservas/>},
 {path:'/cuenta',label:'Mi perfil',roles:['cliente'],element:<Cuenta/>},
 {path:'/feedback',label:'Calificación y puntos',roles:['cliente'],element:<Calificacion/>},
 {path:'/inventario',label:'Inventario y depósito',roles:['operario'],element:<Inventario/>},
 {path:'/retiros',label:'Pago y retiro',roles:['encargado'],element:<Retiros/>},
 {path:'/retiros/:id',roles:['encargado'],element:<RetiroDetalle/>},
 {path:'/usuarios',label:'Usuarios y roles',roles:['duenio'],element:<Administracion/>},
 {path:'/prototipo',label:'Herramientas del prototipo',roles:['duenio'],element:<Prototipo/>},
];
