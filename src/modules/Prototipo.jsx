import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {request} from '../api.js';
import {PageHeader,Panel,Button,QueryState,FeedbackMessage,EmptyState} from '../components/ui/index.jsx';
import {date} from '../shared/format.js';
export function Prototipo() {
 const qc=useQueryClient();const [notice,setNotice]=useState('');
 const env=useQuery({queryKey:['entorno'],queryFn:()=>request('/entorno'),refetchInterval:30000});
 const mails=useQuery({queryKey:['demo-correos'],queryFn:()=>request('/demo/correos'),enabled:env.data?.demo===true,refetchInterval:10000});
 const run=useMutation({mutationFn:action=>request(`/demo/${action}`,{method:'POST',body:{}}),onSuccess:()=>{setNotice('Simulación actualizada. Revisá la hora y los avisos.');qc.invalidateQueries();}});
 return <><PageHeader title="Herramientas del prototipo" description="Solo disponibles en desarrollo local y para el dueño. Los datos, precios y correos de ejemplo son ficticios."/><QueryState query={env}/>
 {env.data&&!env.data.demo&&<Panel><p>Modo de demostración desactivado. En una base local de prueba, configurar ALLOW_DEMO=true en API/.env y reiniciar la API.</p></Panel>}
 {env.data?.demo&&<><Panel><h2>Reloj y avisos</h2><p>Hora del servidor: <strong>{date(env.data.ahora)}</strong> (Buenos Aires).</p><p>Al iniciar la demostración, avanzá al próximo día de atención a las 10:00. Hacelo una sola vez, antes de crear el pedido. Avanzar puede vencer pedidos, avisos o reservas existentes. El reloj vuelve a la hora real al reiniciar la API; usá una base de prueba nueva para cada ensayo.</p>
 <div className="actions"><Button busy={run.isPending} onClick={()=>run.mutate('horario')}>Preparar horario de demostración</Button><Button variant="secondary" busy={run.isPending} onClick={()=>run.mutate('tick')}>Procesar avisos ahora</Button></div><FeedbackMessage>{run.error?.message}</FeedbackMessage><FeedbackMessage kind="success">{notice}</FeedbackMessage></Panel>
 <Panel><h2>Correos capturados (simulación)</h2><p>Canal configurado: {env.data.avisos}. Esta bandeja guarda mensajes de prueba durante esta ejecución; no son correos enviados a casillas reales.</p><QueryState query={mails}/>{mails.data?.map((m,i)=><details key={`${m.avisoId}-${i}`}><summary>Aviso #{m.avisoId} · {m.email}</summary><p>{m.subject}</p><pre>{m.text}</pre></details>)}{mails.data?.length===0&&<EmptyState title="Sin mensajes capturados" description="Creá el pedido, aprobá un retazo compatible y procesá los avisos."/>}</Panel></>}
 </>;
}
