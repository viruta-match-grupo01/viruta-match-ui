import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {useNavigate,useParams} from 'react-router-dom';
import {request} from '../../api.js';
import {PageHeader,Panel,Button,FormField,StatusBadge,FeedbackMessage,EmptyState,QueryState,RetazoCard,ConfirmDialog} from '../../components/ui/index.jsx';
import {date} from '../../shared/format.js';
import './dev-a.css';

/** /calidad · encargado · pendientes de su sucursal, los más antiguos primero. */
export function Calidad({user}) {
  const navigate=useNavigate();
  const q=useQuery({queryKey:['calidad',user.id],queryFn:()=>request('/calidad'),refetchInterval:30000});
  return <>
    <PageHeader title="Control de calidad" description="Retazos de tu sucursal que esperan control. Ninguno se ofrece a un cliente hasta que lo apruebes."/>
    <QueryState query={q}/>
    {q.isSuccess&&<section className="cards">{q.data.map(r=><RetazoCard key={r.id} retazo={r} actions={<Button onClick={()=>navigate(`/calidad/${r.id}`)}>Revisar retazo</Button>}>
      <div className="card-top"><StatusBadge state={r.estado}/><span>Retazo #{r.id}</span></div>
      <p className="muted">Cargó: {r.cargado_por_nombre} · {date(r.cargado_en)}</p>
      <p className={r.fuera_de_plazo?'warning':'muted'}>{r.fuera_de_plazo?'Fuera de plazo: ':'Controlar antes de: '}{date(r.control_limite_en)} (24 horas desde la carga)</p>
    </RetazoCard>)}</section>}
    {q.isSuccess&&q.data.length===0&&<EmptyState title="No hay retazos pendientes" description="Cuando un operario cargue uno en tu sucursal, aparece acá."/>}
  </>;
}

const noChecks={humedad_ok:false,bordes_ok:false,medidas_ok:false};
const checkLabels=[['humedad_ok','Sin humedad'],['bordes_ok','Bordes en buen estado'],['medidas_ok','Las medidas coinciden con las cargadas']];

/** /calidad/:id · encargado · aprobar el control o rechazar con motivo. */
export function CalidadDetalle({user}) {
  const {id}=useParams();const navigate=useNavigate();const qc=useQueryClient();
  const q=useQuery({queryKey:['calidad',user.id,id],queryFn:()=>request(`/calidad/${id}`),retry:false});
  const [checks,setChecks]=useState(noChecks),[motivo,setMotivo]=useState(''),[askReject,setAskReject]=useState(false),[motivoError,setMotivoError]=useState(''),[notice,setNotice]=useState('');
  const refresh=()=>qc.invalidateQueries({queryKey:['calidad',user.id]});
  const approve=useMutation({mutationFn:()=>request(`/calidad/${id}/aprobar`,{method:'POST',body:checks}),onSuccess:()=>{setNotice('Control aprobado. El retazo quedó disponible para ofrecerse a los clientes.');refresh();}});
  const reject=useMutation({mutationFn:()=>request(`/calidad/${id}/rechazar`,{method:'POST',body:{motivo:motivo.trim()}}),onSuccess:()=>{setAskReject(false);setNotice('Retazo descartado. No se avisó a ningún cliente.');refresh();}});
  const correction=useMutation({mutationFn:()=>request(`/calidad/${id}/corregir-medidas`,{method:'POST',body:{motivo:motivo.trim()}}),onSuccess:()=>{setNotice('Corrección solicitada. El operario la ve en Mis cargas; después se repite el control.');refresh();}});
  const allChecked=Object.values(checks).every(Boolean);
  function startReject(){setNotice('');approve.reset();reject.reset();if(motivo.trim().length<3){setMotivoError('Indicá el motivo del rechazo');return;}setMotivoError('');setAskReject(true);}
  const r=q.data;
  return <>
    <PageHeader title={`Control del retazo #${id}`} description="Verificá el material en la sucursal antes de decidir." actions={<Button variant="secondary" onClick={()=>navigate('/calidad')}>Volver a pendientes</Button>}/>
    <QueryState query={q}/>
    <FeedbackMessage kind="success">{notice}</FeedbackMessage>
    {r&&<div className="cards">
      <RetazoCard retazo={r}>
        <div className="card-top"><StatusBadge state={r.estado}/><span>Cargó: {r.cargado_por_nombre}</span></div>
        <p className="muted">Cargado: {date(r.cargado_en)}</p>
        {r.estado==='pendiente_control'&&<p className={r.fuera_de_plazo?'warning':'muted'}>{r.fuera_de_plazo?'Fuera de plazo: ':'Controlar antes de: '}{date(r.control_limite_en)}</p>}
        {r.estado==='descartado'&&r.motivo_estado&&<p className="warning">Motivo: {r.motivo_estado}</p>}
      </RetazoCard>
      {r.estado==='pendiente_control'?<Panel>
        <h2>Resultado del control</h2>
        <form className="form-grid" onSubmit={e=>{e.preventDefault();setNotice('');reject.reset();approve.mutate();}}>
          <fieldset className="check-list"><legend>Qué verificaste</legend>
            {checkLabels.map(([key,label])=><label key={key} className="check-field"><input type="checkbox" checked={checks[key]} onChange={e=>{setChecks(c=>({...c,[key]:e.target.checked}));setNotice('');}}/>{label}</label>)}
          </fieldset>
          {!allChecked&&<p className="form-note">Para aprobar tenés que marcar los tres puntos. Si algo falla, rechazá el retazo e indicá el motivo.</p>}
          <Button type="submit" busy={approve.isPending} disabled={!allChecked||reject.isPending}>{approve.isPending?'Aprobando…':'Aprobar control'}</Button>
          <FeedbackMessage>{approve.error?.message}</FeedbackMessage>
        </form>
        <hr/>
        <div className="form-grid">
          <FormField label="Motivo del rechazo o corrección" hint="El operario va a poder ver este motivo en sus cargas." error={motivoError}><textarea maxLength={300} value={motivo} onChange={e=>{setMotivo(e.target.value);setMotivoError('');}}/></FormField>
          <Button variant="secondary" busy={correction.isPending} disabled={approve.isPending||reject.isPending} onClick={()=>{if(motivo.trim().length<3){setMotivoError('Indicá qué medidas debe revisar el operario');return;}correction.mutate();}}>Solicitar corrección de medidas</Button>
          <FeedbackMessage>{correction.error?.message}</FeedbackMessage>
          <Button variant="danger" disabled={approve.isPending} onClick={startReject}>Rechazar retazo</Button>
        </div>
      </Panel>:<Panel><h2>Control resuelto</h2><p><StatusBadge state={r.estado}/></p><p className="muted">Este retazo ya no está pendiente de control.</p></Panel>}
    </div>}
    <ConfirmDialog open={askReject} title="Rechazar retazo" description={<>{`El retazo #${id} pasa a descartado y no se ofrece a ningún cliente. Motivo: ${motivo.trim()}`}{reject.error&&<span role="alert" className="field-error"> {reject.error.message}</span>}</>} confirmLabel="Rechazar retazo" busy={reject.isPending} onConfirm={()=>reject.mutate()} onCancel={()=>setAskReject(false)}/>
  </>;
}
