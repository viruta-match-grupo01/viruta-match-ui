export const money=value=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(value);
export const date=value=>value?new Intl.DateTimeFormat('es-AR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Argentina/Buenos_Aires'}).format(new Date(value)):'—';
export const stateLabels={pendiente_control:'Pendiente de control',disponible:'Disponible',reservado:'Reservado',retirado:'Retirado',descartado:'Descartado',abierto:'Abierto',cumplido:'Cumplido',cancelado:'Cancelado',vencido:'Vencido',en_cola:'En cola',enviado:'Enviado',fallido:'Requiere revisión',confirmado:'Confirmado'};
export const roleLabels={cliente:'Cliente',operario:'Operario',encargado:'Encargado',duenio:'Dueño'};
