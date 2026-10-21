import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {request} from '../../api.js';
import {PageHeader,Button,FormField,FeedbackMessage,StatusBadge,EmptyState,QueryState,RetazoCard} from '../../components/ui/index.jsx';
import {date} from '../../shared/format.js';

/** /retazos · operario · sus cargas, con el estado del control y el motivo si fue descartado. */
export function Retazos({user}) {
  const navigate=useNavigate();
  const q=useQuery({queryKey:['retazos',user.id],queryFn:()=>request('/retazos'),refetchInterval:30000});
  return <>
    <PageHeader title="Mis cargas" description="Retazos que cargaste y cómo va el control de calidad de cada uno." actions={<Button onClick={()=>navigate('/retazos/nuevo')}>Cargar retazo</Button>}/>
    <QueryState query={q}/>
    {q.isSuccess&&<section className="cards">{q.data.map(r=><RetazoCard key={r.id} retazo={r}>
      <div className="card-top"><StatusBadge state={r.estado}/><span>Retazo #{r.id}</span></div>
      <p className="muted">Cargado: {date(r.cargado_en)}</p>
      {r.estado==='pendiente_control'&&<p className="muted">El encargado lo controla antes de: {date(r.control_limite_en)}</p>}
      {r.estado==='descartado'&&r.motivo_estado&&<p className="warning">Motivo: {r.motivo_estado}</p>}
      {r.estado==='corregir_medidas'&&<CorregirMedidas retazo={r} user={user}/>}
    </RetazoCard>)}</section>}
    {q.isSuccess&&q.data.length===0&&<EmptyState title="Todavía no cargaste retazos" description="Cargá el primero para que pase al control de calidad." action={<Button onClick={()=>navigate('/retazos/nuevo')}>Cargar retazo</Button>}/>}
  </>;
}
function CorregirMedidas({retazo,user}) {
 const qc=useQueryClient();const [alto,setAlto]=useState(retazo.alto_cm),[ancho,setAncho]=useState(retazo.ancho_cm);
 const save=useMutation({mutationFn:()=>request(`/retazos/${retazo.id}/medidas`,{method:'PATCH',body:{alto_cm:Number(alto),ancho_cm:Number(ancho)}}),onSuccess:()=>qc.invalidateQueries({queryKey:['retazos',user.id]})});
 return <form onSubmit={e=>{e.preventDefault();save.mutate();}}><p className="warning">Corregir: {retazo.ultimo_control?.motivo}</p><FormField label="Alto corregido (cm)"><input required type="number" min="1" max="120" step="1" value={alto} onChange={e=>setAlto(e.target.value)}/></FormField><FormField label="Ancho corregido (cm)"><input required type="number" min="1" max="120" step="1" value={ancho} onChange={e=>setAncho(e.target.value)}/></FormField><Button type="submit" busy={save.isPending}>Guardar y repetir control</Button><FeedbackMessage>{save.error?.message}</FeedbackMessage></form>;
}
