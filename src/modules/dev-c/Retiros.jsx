import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {Link,useNavigate,useParams} from 'react-router-dom';
import {request} from '../../api.js';
import {PageHeader,Panel,Button,FormField,StatusBadge,FeedbackMessage,EmptyState,LoadingState,QueryState,RetazoCard,ConfirmDialog,DataTable} from '../../components/ui/index.jsx';
import {date,money} from '../../shared/format.js';
import {useSessionUser} from './session.js';
import {MEDIOS_MANUALES,paymentBlockReason,pickupBlockReason,paymentBody,findReservaId} from './rules.js';
export function Retiros(){const user=useSessionUser();return user?<RetirosView user={user}/>:<LoadingState/>;}
export function RetirosView({user}){
 const navigate=useNavigate();const [search,setSearch]=useState(''),[searchError,setSearchError]=useState('');
 const q=useQuery({queryKey:['retiros',user.id],queryFn:()=>request('/retiros'),refetchInterval:30000});
 const columns=[{key:'id',label:'Reserva',render:r=><Link to={`/retiros/${r.id}`}>#{r.id}</Link>},{key:'cliente_nombre',label:'Cliente'},{key:'material',label:'Retazo',render:r=>`${r.material} ${r.espesor_mm} mm · ${r.alto_cm} × ${r.ancho_cm} cm`},{key:'monto_a_pagar',label:'Importe',render:r=>money(r.monto_a_pagar)},{key:'pago_estado',label:'Pago',render:r=><StatusBadge state={r.pago_estado}/>},{key:'vence_en',label:'Vence',render:r=>date(r.vence_en)}];
 function find(e){e.preventDefault();const id=findReservaId(search);if(!id){setSearchError('Ingresá el número de reserva, por ejemplo 12.');return;}navigate(`/retiros/${id}`);}
 return <><PageHeader title="Pago y retiro" description="Reservas activas de tu sucursal. Registrá primero el pago y después el retiro." actions={<span className="pill">{q.isSuccess?`${q.data.length} activas`:'Consultando reservas…'}</span>}/>
  <Panel><h2>Buscar comprobante</h2><form className="form-grid" onSubmit={find}><FormField label="Número de reserva" hint="El cliente lo ve en Mi reserva." error={searchError}><input inputMode="numeric" value={search} onChange={e=>{setSearch(e.target.value);setSearchError('');}}/></FormField><div className="actions"><Button type="submit">Buscar reserva</Button></div></form></Panel>
  <QueryState query={q}/>
  {q.isSuccess&&(q.data.length?<DataTable columns={columns} rows={q.data}/>:<EmptyState title="No hay reservas activas en tu sucursal" description="Las reservas confirmadas por clientes aparecen acá hasta su retiro o vencimiento."/>)}
 </>;
}
export function RetiroDetalle(){const user=useSessionUser();const {id}=useParams();return user?<RetiroDetalleView user={user} id={id}/>:<LoadingState/>;}
const emptyPayment={medio:'efectivo',comprobante:''};
export function RetiroDetalleView({user,id}){
 const qc=useQueryClient();const [form,setForm]=useState(emptyPayment),[notice,setNotice]=useState(''),[confirming,setConfirming]=useState(false);
 const q=useQuery({queryKey:['retiros',user.id,id],queryFn:()=>request(`/retiros/${id}`)});
 const refresh=()=>qc.invalidateQueries({queryKey:['retiros',user.id]});
 const pay=useMutation({mutationFn:()=>request('/pagos',{method:'POST',body:paymentBody(q.data,form)}),onSuccess:p=>{setForm(emptyPayment);setNotice(`Pago aprobado registrado: ${money(p.monto)} en ${p.medio}. Ya podés registrar el retiro.`);refresh();}});
 const pickup=useMutation({mutationFn:()=>request(`/retiros/${id}/concretar`,{method:'POST',body:{}}),onSuccess:r=>{setConfirming(false);setNotice(r.ya_concretado?'El retiro ya estaba registrado.':'Retiro registrado. La reserva quedó concretada y el pedido cumplido.');refresh();}});
 const r=q.data;const payBlocked=r&&paymentBlockReason(r),pickupBlocked=r&&pickupBlockReason(r);
 return <><PageHeader title={`Reserva #${id}`} description="Verificá la reserva, registrá el pago y después el retiro." actions={<Link className="button secondary" to="/retiros">Volver al listado</Link>}/>
  <QueryState query={q}/><FeedbackMessage kind="success">{notice}</FeedbackMessage>
  {q.isSuccess&&<><section className="cards">
   <RetazoCard retazo={r}><div className="card-top"><StatusBadge state={r.estado}/><span>Retazo #{r.retazo_id}</span></div></RetazoCard>
   <Panel><h2>Reserva</h2><p>Cliente: <strong>{r.cliente_nombre??`#${r.cliente_id}`}</strong></p><p>Confirmada: {date(r.confirmada_en)}</p><div className="deadline"><strong>Pagar y retirar: 12 horas de atención</strong><br/>Vence: {date(r.vence_en)}</div><p>Importe exacto: <strong>{money(r.monto_a_pagar)}</strong></p><p>Pago: <StatusBadge state={r.pago_estado}/></p></Panel>
  </section>
  <Panel><h2>Registrar pago</h2>
   {payBlocked?<p className={r.pago_estado==='aprobado'?'success':'warning'}>{payBlocked}</p>:<form className="form-grid" onSubmit={e=>{e.preventDefault();setNotice('');pay.mutate();}}>
    <FormField label="Medio de pago"><select value={form.medio} onChange={e=>{setForm(f=>({...f,medio:e.target.value}));pay.reset();}}>{MEDIOS_MANUALES.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}</select></FormField>
    <FormField label="Comprobante" hint={form.medio==='efectivo'?'Número del recibo entregado al cliente.':'Número de operación de la transferencia.'}><input required maxLength={200} value={form.comprobante} onChange={e=>{setForm(f=>({...f,comprobante:e.target.value}));pay.reset();}}/></FormField>
    <p className="form-note">Se registra como pago aprobado por {money(r.monto_a_pagar)}, el precio del retazo. MercadoPago (link/QR) está pendiente de integración.</p>
    <Button type="submit" busy={pay.isPending}>{pay.isPending?'Registrando…':'Registrar pago'}</Button>
    <FeedbackMessage>{pay.error?.message}</FeedbackMessage>
   </form>}
  </Panel>
  <Panel><h2>Registrar retiro</h2><p className="muted">Al registrar el retiro, la reserva queda concretada, el retazo retirado y el pedido cumplido.</p>
   {pickupBlocked&&<p className={r.estado==='concretada'?'success':'warning'}>{pickupBlocked}</p>}
   {r.estado!=='concretada'&&<Button disabled={!!pickupBlocked} onClick={()=>{setNotice('');pickup.reset();setConfirming(true);}}>Registrar retiro</Button>}
  </Panel>
  <ConfirmDialog open={confirming} title="Registrar retiro" description={<>{`Entregás ${r.material} ${r.espesor_mm} mm, ${r.alto_cm} × ${r.ancho_cm} cm, de la reserva #${r.id} a ${r.cliente_nombre??'el cliente'}. No se puede deshacer.`}{pickup.error&&<span role="alert" className="field-error"> {pickup.error.message}</span>}</>} confirmLabel="Registrar retiro" busy={pickup.isPending} onConfirm={()=>pickup.mutate()} onCancel={()=>setConfirming(false)}/>
  </>}
 </>;
}
