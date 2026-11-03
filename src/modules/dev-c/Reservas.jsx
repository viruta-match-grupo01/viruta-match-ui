import React,{useState} from 'react';
import {Icon} from '../../components/ui/Icon.jsx';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import {request} from '../../api.js';
import {PageHeader,Panel,Button,StatusBadge,FeedbackMessage,EmptyState,LoadingState,QueryState,RetazoCard,ConfirmDialog,DataTable} from '../../components/ui/index.jsx';
import {date} from '../../shared/format.js';
import {useSessionUser} from './session.js';
import {cancelBlockReason} from './rules.js';
export function MisReservas(){const user=useSessionUser();return user?<MisReservasView user={user}/>:<LoadingState/>;}
export function MisReservasView({user}){
 const qc=useQueryClient();const [cancel,setCancel]=useState(null),[notice,setNotice]=useState('');
 const q=useQuery({queryKey:['reservas',user.id],queryFn:()=>request('/reservas'),refetchInterval:30000});
 const remove=useMutation({mutationFn:id=>request(`/reservas/${id}`,{method:'DELETE'}),onSuccess:()=>{setCancel(null);setNotice('Reserva cancelada. El retazo vuelve a ofrecerse a otros pedidos.');for(const key of ['reservas','avisos','pedidos'])qc.invalidateQueries({queryKey:[key,user.id]});}});
 const activas=q.data?.filter(r=>r.estado==='activa')??[],historial=q.data?.filter(r=>r.estado!=='activa')??[];
 const columns=[{key:'id',label:'Reserva',render:r=>`#${r.id}`},{key:'material',label:'Retazo',render:r=>`${r.material} ${r.espesor_mm} mm · ${r.alto_cm} × ${r.ancho_cm} cm`},{key:'sucursal_nombre',label:'Sucursal'},{key:'estado',label:'Estado',render:r=><StatusBadge state={r.estado}/>},{key:'confirmada_en',label:'Confirmada',render:r=>date(r.confirmada_en)}];
 return <><PageHeader title="Mi reserva" description="Pagás y retirás en la sucursal. El circuito MercadoPago es exclusivamente de prueba cuando está habilitado."/>
  <QueryState query={q}/><FeedbackMessage kind="success">{notice}</FeedbackMessage>
  {q.isSuccess&&activas.length>0&&<div className="stepper" aria-label="Pasos del retiro"><span className="done"><Icon name="check_circle"/>Reserva confirmada</span><span className="separator"/><span className="current"><Icon name="payments"/>Pagar en sucursal</span><span className="separator"/><span><Icon name="inventory_2"/>Retirar material</span></div>}
  {q.isSuccess&&activas.length>0&&<section className="cards reservation-cards">{activas.map(r=>{const blocked=cancelBlockReason(r);return <RetazoCard key={r.id} retazo={r} actions={blocked?<p className="muted">{blocked}</p>:<Button variant="danger" onClick={()=>{setNotice('');remove.reset();setCancel(r);}}>Cancelar reserva</Button>}>
   <div className="card-top"><StatusBadge state={r.estado}/><span>Reserva #{r.id}</span></div>
   <div className="deadline"><strong>Pagar y retirar: 12 horas de atención</strong><span className="deadline-display">{date(r.vence_en)}</span>Vencimiento en horario de Buenos Aires.<br/>Confirmada: {date(r.confirmada_en)}</div>
   <p>Pago: <StatusBadge state={r.pago_estado}/></p>
   <PagoDePrueba reserva={r} onVerified={()=>qc.invalidateQueries({queryKey:['reservas',user.id]})}/>
   <p><strong>Comprobante de reserva: #{r.id}</strong><br/><small>Mostralo en {r.sucursal_nombre} para pagar y retirar.</small></p>
   <p className="muted">{r.plazo_retiro}</p>
  </RetazoCard>;})}</section>}
  {q.isSuccess&&activas.length===0&&<EmptyState title="No tenés una reserva activa" description="Cuando confirmes un aviso, la reserva aparece acá con su plazo de retiro." action={<Link className="button secondary" to="/avisos">Ver coincidencias y avisos</Link>}/>}
  {q.isSuccess&&historial.length>0&&<Panel><h2>Reservas anteriores</h2><DataTable columns={columns} rows={historial}/></Panel>}
  <ConfirmDialog open={cancel!==null} title="Cancelar reserva" description={<>{cancel&&`La reserva #${cancel.id} (${cancel.material} ${cancel.alto_cm} × ${cancel.ancho_cm} cm) se cancela y el retazo vuelve a ofrecerse a otros pedidos.`}{remove.error&&<span role="alert" className="field-error"> {remove.error.message}</span>}</>} confirmLabel="Cancelar reserva" busy={remove.isPending} onConfirm={()=>remove.mutate(cancel.id)} onCancel={()=>setCancel(null)}/>
 </>;
}

/** Link sandbox y verificación de estado mediante API oficial; nunca se aprueba solo por volver del checkout. */
export function PagoDePrueba({reserva,onVerified}){
 const [paymentId,setPaymentId]=useState('');
 const checkout=useMutation({mutationFn:()=>request(`/pagos/mercadopago/${reserva.id}/preferencia`,{method:'POST',body:{}})});
 const verify=useMutation({mutationFn:()=>request(`/pagos/mercadopago/${reserva.id}/verificar`,{method:'POST',body:{pago_id:paymentId}}),onSuccess:result=>{if(result.estado==='aprobado')onVerified?.();}});
 if(reserva.pago_estado==='aprobado')return <p className="success">Pago verificado como aprobado.</p>;
 return <div className="mp-demo"><p><strong>MercadoPago (solo test)</strong> · Alternativa opcional para demostrar el circuito.</p>
  <Button type="button" variant="secondary" busy={checkout.isPending} onClick={()=>checkout.mutate()}>Generar enlace de prueba</Button>
  {checkout.data?.url&&<p><a className="button secondary" href={checkout.data.url} target="_blank" rel="noreferrer">Abrir checkout de prueba</a></p>}
  <FeedbackMessage>{checkout.error?.message}</FeedbackMessage>
  <div className="form-grid"><label className="form-field">ID de pago devuelto por MercadoPago<input inputMode="numeric" pattern="[0-9]+" placeholder="ID numérico del pago" value={paymentId} onChange={e=>setPaymentId(e.target.value)}/></label>
  <Button type="button" variant="secondary" disabled={!/^[0-9]+$/.test(paymentId)} busy={verify.isPending} onClick={()=>verify.mutate()}>Verificar pago con MercadoPago</Button></div>
  {verify.data&&<p role="status">Estado verificado: {verify.data.estado}{verify.data.estado_proveedor?` (${verify.data.estado_proveedor})`:''}.</p>}
  <FeedbackMessage>{verify.error?.message}</FeedbackMessage>
  <p className="muted">Sin token TEST en la API esta opción no funciona; el pago manual sigue disponible. Nunca usar dinero real para la demo.</p>
 </div>;
}
