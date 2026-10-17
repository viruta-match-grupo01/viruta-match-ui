import {stateLabels} from '../../shared/format.js';
/** Solo explican en pantalla por qué una acción no está disponible; la API vuelve a validar todo. */
export const MEDIOS_MANUALES=[{value:'efectivo',label:'Efectivo'},{value:'transferencia',label:'Transferencia'}];
const inactive=r=>r.estado==='vencida'?'La reserva venció; el retazo volvió a estar disponible.':`La reserva está ${(stateLabels[r.estado]??r.estado).toLowerCase()}.`;
export function cancelBlockReason(r){if(r.estado!=='activa')return inactive(r);if(r.pago_estado==='aprobado')return 'Tiene un pago registrado; consultá en la sucursal.';return null;}
export function paymentBlockReason(r){if(r.pago_estado==='aprobado')return 'El pago ya está registrado como aprobado.';if(r.estado!=='activa')return inactive(r);return null;}
export function pickupBlockReason(r){if(r.estado==='concretada')return 'El retiro ya está registrado.';if(r.estado!=='activa')return inactive(r);if(r.pago_estado!=='aprobado')return 'Registrá un pago aprobado antes del retiro.';return null;}
/** El importe enviado es el que vio el encargado; si el precio cambió, la API responde MONTO_INCORRECTO. */
export function paymentBody(reserva,form){return {reserva_id:reserva.id,medio:form.medio,comprobante:form.comprobante.trim(),monto:reserva.monto_a_pagar};}
export function findReservaId(text){const s=String(text??'').trim().replace(/^#/,'');return /^[1-9]\d*$/.test(s)?Number(s):null;}
