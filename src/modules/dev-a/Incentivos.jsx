import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {request} from '../../api.js';
import {PageHeader,QueryState,DataTable,EmptyState} from '../../components/ui/index.jsx';
import {money,date} from '../../shared/format.js';
export function Incentivos({user}) {
 const q=useQuery({queryKey:['incentivos',user.id],queryFn:()=>request('/incentivos'),refetchInterval:30000});
 return <><PageHeader title="Mis incentivos" description="Sobre ventas retiradas: 15 % para quien cargó el retazo y 10 % para quien aprobó su control. No representa una liquidación de sueldos."/><QueryState query={q}/>
 {q.isSuccess&&(q.data.length?<DataTable rows={q.data} columns={[{key:'retazo_id',label:'Retazo'},{key:'porcentaje',label:'Porcentaje',render:r=>`${r.porcentaje} %`},{key:'monto',label:'Importe',render:r=>money(r.monto)},{key:'generado_en',label:'Fecha',render:r=>date(r.generado_en)}]}/>:<EmptyState title="Todavía no hay incentivos" description="Aparecen después de registrar el retiro de una venta en la que participaste."/>)}</>;
}
