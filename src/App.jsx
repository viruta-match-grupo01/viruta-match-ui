import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {Routes,Route,Navigate,useParams} from 'react-router-dom';
import {request} from './api.js';
import {AppLayout} from './components/layout/AppLayout.jsx';
import {PageHeader,Panel,Button,FormField,StatusBadge,FeedbackMessage,EmptyState,QueryState,RetazoCard,ConfirmDialog,DataTable} from './components/ui/index.jsx';
import {date} from './shared/format.js';
import {Link} from 'react-router-dom';
import {Icon} from './components/ui/Icon.jsx';
export function DevBApp({user,moduleRoutes=[]}){
 if(!user)return <main><h1>Viruta Match</h1><p>Iniciá sesión para continuar.</p></main>;
 const own=user.rol==='cliente';
 const guard=(allowed,element)=>allowed?element:<Panel><h1>Acceso restringido</h1><p>Esta función corresponde a otro rol.</p></Panel>;
 return <AppLayout user={user} moduleRoutes={moduleRoutes}><Routes>
  <Route path="/" element={<Navigate to={own?'/pedidos':user.rol==='duenio'?'/reportes':'/modulos'} replace/>}/>
  <Route path="/pedidos" element={guard(own,<Pedidos user={user}/>)}/>
  <Route path="/avisos" element={guard(own,<Avisos user={user}/>)}/>
  <Route path="/avisos/:id" element={guard(own,<Avisos user={user}/>)}/>
  <Route path="/reportes" element={guard(user.rol==='duenio',<Reportes user={user}/>)}/>
  <Route path="/modulos" element={<><PageHeader title="Tu mesa de trabajo" description="Cada retazo tiene un recorrido. Elegí una tarea para continuar."/><section className="role-grid">{moduleRoutes.filter(r=>r.label&&r.menu!==false&&r.roles.includes(user.rol)).map(r=><Panel key={r.path}><Icon name={r.path==='/calidad'?'fact_check':r.path==='/retiros'?'point_of_sale':'carpenter'}/><h2>{r.label}</h2><Link className="button secondary" to={r.path}>Abrir {r.label.toLowerCase()}</Link></Panel>)}</section></>}/>
  {moduleRoutes.map(r=><Route key={r.path} path={r.path} element={guard(r.roles.includes(user.rol),r.element)}/>)}
  <Route path="*" element={<Panel><h1>Página no encontrada</h1><p>Elegí una opción del menú para continuar.</p></Panel>}/>
 </Routes></AppLayout>;
}
const initial={material:'MDF',espesor_mm:18,alto_min_cm:'40',ancho_min_cm:'60',color:'blanco',acabado:'mate',tolerancia_pct:'',sucursal_preferida_id:''};
export function Pedidos({user}){
 const qc=useQueryClient();
 const q=useQuery({queryKey:['pedidos',user.id],queryFn:()=>request('/pedidos')});
 const branches=useQuery({queryKey:['sucursales',user.id],queryFn:()=>request('/sucursales')});
 const cats=useQuery({queryKey:['catalogos',user.id],queryFn:()=>request('/catalogos')});
 const [form,setForm]=useState(initial),[cancel,setCancel]=useState(null),[notice,setNotice]=useState('');
 const refresh=()=>{qc.invalidateQueries({queryKey:['pedidos',user.id]});qc.invalidateQueries({queryKey:['avisos',user.id]});};
 const count=q.data?.filter(p=>p.estado==='abierto').length??0;
 const branchId=Number(form.sucursal_preferida_id||branches.data?.[0]?.id||0);
 const create=useMutation({mutationFn:()=>request('/pedidos',{method:'POST',body:{material:form.material,espesor_mm:Number(form.espesor_mm),alto_min_cm:Number(form.alto_min_cm),ancho_min_cm:Number(form.ancho_min_cm),color:form.material==='melamina'?form.color:null,acabado:form.material==='melamina'?form.acabado:null,tolerancia_pct:form.tolerancia_pct===''?null:Number(form.tolerancia_pct),sucursal_preferida_id:branchId}}),onSuccess:()=>{setForm(initial);setNotice('Pedido creado. Vamos a buscar materiales compatibles.');refresh();}});
 const renew=useMutation({mutationFn:id=>request(`/pedidos/${id}/renovar`,{method:'POST',body:{}}),onSuccess:()=>{setNotice('Pedido renovado por 30 días.');refresh();}});
 const remove=useMutation({mutationFn:id=>request(`/pedidos/${id}`,{method:'DELETE'}),onSuccess:()=>{setCancel(null);setNotice('Pedido cancelado.');refresh();}});
 function update(key,value){setForm(f=>({...f,[key]:value}));setNotice('');create.reset();}
 const numberField=(key,label)=> <FormField label={label}><input type="number" min="1" max="120" step="1" required value={form[key]} onChange={e=>update(key,e.target.value)}/></FormField>;
 return <><PageHeader title="Mis pedidos" description="Contanos qué necesitás. Te avisamos cuando aparezca un retazo compatible." actions={<span className="pill">{q.isSuccess?`${count} de 3 abiertos`:'Consultando pedidos…'}</span>}/>
  <FeedbackMessage kind="success">{notice}</FeedbackMessage>
  <Panel><h2>Crear un pedido</h2><p className="muted">Hasta 3 abiertos. Vencen a los 30 días y podés renovarlos.</p>
  <QueryState query={cats}/><QueryState query={branches}/>
  {cats.isSuccess&&branches.isSuccess&&<form className="form-grid" onSubmit={e=>{e.preventDefault();setNotice('');create.mutate();}}>
   <FormField label="Material"><select value={form.material} onChange={e=>update('material',e.target.value)}>{cats.data.materiales.map(x=><option key={x}>{x}</option>)}</select></FormField>
   <FormField label="Espesor (mm)"><select value={form.espesor_mm} onChange={e=>update('espesor_mm',e.target.value)}>{cats.data.espesores_mm.map(x=><option key={x} value={x}>{String(x).replace('.',',')}</option>)}</select></FormField>
   {numberField('alto_min_cm','Alto mínimo (cm)')}{numberField('ancho_min_cm','Ancho mínimo (cm)')}
   {form.material==='melamina'&&<><FormField label="Color"><select value={form.color} onChange={e=>update('color',e.target.value)}>{cats.data.colores.map(x=><option key={x}>{x}</option>)}</select></FormField><FormField label="Acabado"><select value={form.acabado} onChange={e=>update('acabado',e.target.value)}>{cats.data.acabados.map(x=><option key={x}>{x}</option>)}</select></FormField></>}
   <FormField label="Sucursal preferida"><select required value={branchId} onChange={e=>update('sucursal_preferida_id',e.target.value)}>{branches.data.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}</select></FormField>
   <FormField label="Tolerancia de área (%)" hint="Vacío: 30 %. El valor 0 se respeta."><input type="number" min="0" step="any" value={form.tolerancia_pct} onChange={e=>update('tolerancia_pct',e.target.value)}/></FormField>
   <p className="form-note">Se permite rotar el retazo. Ambas medidas deben alcanzar tu mínimo. La tolerancia se aplica al área, no a cada lado.</p>
   {count>=3&&<p className="form-note">Ya tenés tres pedidos abiertos. Cancelá uno para crear otro.</p>}
   <Button type="submit" busy={create.isPending} disabled={!q.isSuccess||count>=3||!branchId}>{create.isPending?'Guardando…':'Crear pedido'}</Button>
   <FeedbackMessage>{create.error?.message}</FeedbackMessage>
  </form>}</Panel>
  <QueryState query={q}/><FeedbackMessage>{renew.error?.message}</FeedbackMessage>
  {q.isSuccess&&<section className="cards">{q.data.map(p=><article className="panel" key={p.id}><div className="card-top"><StatusBadge state={p.estado}/><span>Pedido #{p.id}</span></div><h2>{p.material} · {p.espesor_mm} mm</h2><p className="measure">{p.alto_min_cm} × {p.ancho_min_cm} <small>cm mínimo</small></p>{p.color&&<p>{p.color} · {p.acabado}</p>}<p>Tolerancia: {p.tolerancia_pct??30} %</p><p>{branches.data?.find(s=>s.id===p.sucursal_preferida_id)?.nombre??'Consultando sucursal…'}</p><p className="muted">Vence: {date(p.vence_en)}</p>{p.estado!=='cumplido'&&<div className="actions"><Button variant="secondary" busy={renew.isPending} onClick={()=>{setNotice('');renew.mutate(p.id);}}>Renovar 30 días</Button>{p.estado==='abierto'&&<Button variant="danger" onClick={()=>{remove.reset();setCancel(p.id);}}>Cancelar pedido</Button>}</div>}</article>)}</section>}
  {q.isSuccess&&q.data.length===0&&<EmptyState title="Todavía no tenés pedidos" description="Creá el primero para encontrar materiales."/>}
  <ConfirmDialog open={cancel!==null} title="Cancelar pedido" description={<>{`El pedido #${cancel??''} dejará de buscar retazos. Sus avisos pendientes también se cancelarán.`}{remove.error&&<span role="alert" className="field-error"> {remove.error.message}</span>}</>} confirmLabel="Cancelar pedido" busy={remove.isPending} onConfirm={()=>remove.mutate(cancel)} onCancel={()=>setCancel(null)}/>
  <FeedbackMessage>{remove.error?.message}</FeedbackMessage>
 </>;
}
export function Avisos({user}){
 const {id}=useParams();const qc=useQueryClient();const [notice,setNotice]=useState(''),[search,setSearch]=useState(''),[view,setView]=useState('grid');
 const q=useQuery({queryKey:['avisos',user.id,id??'lista'],queryFn:async()=>id?[await request(`/avisos/${id}`)]:request('/avisos'),refetchInterval:30000});
 const confirm=useMutation({mutationFn:aviso=>request('/reservas',{method:'POST',body:{aviso_id:aviso.id}}),onSuccess:()=>{setNotice('Reserva confirmada. Pagás al retirar en la sucursal.');qc.invalidateQueries({queryKey:['avisos',user.id]});qc.invalidateQueries({queryKey:['reservas',user.id]});qc.invalidateQueries({queryKey:['pedidos',user.id]});}});
 const filtered=(q.data??[]).filter(a=>`${a.material} ${a.color??''} ${a.espesor_mm} ${a.sucursal_nombre}`.toLowerCase().includes(search.toLowerCase()));
 return <><PageHeader title="Coincidencias y avisos" description="Catálogo de coincidencias para tus proyectos. Los materiales se ofrecen por turnos al pedido más antiguo." actions={<span className="pill"><Icon name="filter_alt"/>Matching de tus pedidos</span>}/><QueryState query={q}/><FeedbackMessage>{confirm.error?.message}</FeedbackMessage><FeedbackMessage kind="success">{notice}</FeedbackMessage>
 {q.isSuccess&&q.data.length>0&&<div className="list-toolbar"><FormField label="Buscar en mis coincidencias"><input type="search" placeholder="Material, espesor o sucursal" value={search} onChange={e=>setSearch(e.target.value)}/></FormField><div className="view-toggle"><Button variant={view==='grid'?'primary':'secondary'} aria-label="Vista de tarjetas" aria-pressed={view==='grid'} onClick={()=>setView('grid')}><Icon name="grid_view"/></Button><Button variant={view==='list'?'primary':'secondary'} aria-label="Vista de lista" aria-pressed={view==='list'} onClick={()=>setView('list')}><Icon name="view_list"/></Button></div></div>}
 {q.isSuccess&&<section className={`cards ${view==='list'?'list-view':''}`}>{filtered.map(a=><RetazoCard key={a.id} retazo={a} actions={<><Button busy={confirm.isPending} disabled={!a.puede_confirmar} onClick={()=>{setNotice('');confirm.mutate(a);}}>{confirm.isPending?'Confirmando…':'Confirmar reserva'}</Button><small>Pagás al retirar en la sucursal de origen.</small></>}><div className="card-top"><StatusBadge state={a.estado}/><span>Pedido #{a.pedido_id}</span></div><div className="deadline"><strong>Confirmar: 2 horas de atención</strong><br/>Hasta: {date(a.vence_confirmacion_en)}<br/>Retiro: 12 horas de atención desde la confirmación.</div>{!a.puede_confirmar&&<p className="muted">{a.estado==='en_cola'?'El plazo empieza cuando se envía el aviso.':'Este aviso no está habilitado para confirmar una reserva.'}</p>}</RetazoCard>)}</section>}
 {q.isSuccess&&q.data.length>0&&filtered.length===0&&<EmptyState title="Sin coincidencias para esta búsqueda" description="Probá con otro material o sucursal. Tus pedidos no cambian."/>}
 {q.isSuccess&&q.data.length===0&&<EmptyState title="Todavía no hay coincidencias" description="Tus pedidos siguen buscando. Te avisamos cuando aparezca un material compatible."/>}</>;
}
export function Reportes({user}){
 const [branch,setBranch]=useState('todas');const qc=useQueryClient();const [result,setResult]=useState('');
 const q=useQuery({queryKey:['reportes',user.id],queryFn:()=>request('/reportes'),refetchInterval:30000});
 const reconcile=useMutation({mutationFn:({id,canal,entregado})=>request(`/avisos/${id}/reconciliar`,{method:'POST',body:{canal,entregado}}),onSuccess:()=>{setResult('Resultado registrado. Se volvió a evaluar el aviso.');qc.invalidateQueries({queryKey:['reportes',user.id]});}});
 const columns=[{key:'nombre',label:'Sucursal'},...['cargados','coincidencias','reservas','retiros','descartes'].map(k=>({key:k,label:k[0].toUpperCase()+k.slice(1)})),{key:'calificacion_material',label:'Material',render:r=>r.calificacion_material?.toFixed(1)??'—'},{key:'calificacion_trato',label:'Trato',render:r=>r.calificacion_trato?.toFixed(1)??'—'}];
 return <><PageHeader title="Reportes por sucursal" description="Seguimiento de los materiales y sus retiros."/><QueryState query={q}/>{q.isSuccess&&<><section className="metrics">{Object.entries(q.data.totales).map(([k,v])=><Panel key={k}><span>{k}</span><strong>{v}</strong></Panel>)}</section><div className="workbench-grid"><Panel><h2><Icon name="bar_chart"/>Retiros por sucursal</h2><p className="muted">Cantidades acumuladas registradas en el sistema.</p><div className="chart-rows">{q.data.sucursales.filter(s=>branch==='todas'||s.id===Number(branch)).map(s=><div className="chart-row" key={s.id}><span>{s.nombre}</span><div className="chart-track"><div className="chart-bar" style={{width:`${s.retiros/Math.max(1,...q.data.sucursales.map(x=>x.retiros))*100}%`}}/></div><span className="chart-number">{s.retiros}</span></div>)}</div></Panel><Panel><h2>Retazos que encuentran un nuevo uso</h2><p>{q.data.porcentaje_retiro.toFixed(1)} % retirados sobre cargados · Meta inicial: 60 %</p><progress aria-label="Porcentaje de retazos retirados" max="100" value={q.data.porcentaje_retiro}/><p className="muted">Indicador acumulado; no mide reducción de descarte sin una línea base.</p></Panel></div>
  <div className="branch-filter"><FormField label="Sucursal"><select value={branch} onChange={e=>setBranch(e.target.value)}><option value="todas">Todas las sucursales</option>{q.data.sucursales.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}</select></FormField></div><DataTable columns={columns} rows={q.data.sucursales.filter(s=>branch==='todas'||s.id===Number(branch))}/>
  <Panel><h2>Seguimiento de avisos</h2><p>{q.data.cola.map(x=>`${x.estado}: ${x.cantidad}`).join(' · ')||'Sin avisos'}</p><FeedbackMessage>{reconcile.error?.message}</FeedbackMessage><FeedbackMessage kind="success">{result}</FeedbackMessage>
  {q.data.avisos_fallidos.map(a=><div className="review-item" key={a.id}><h3>Aviso #{a.id}</h3><p>Cliente #{a.cliente_id} · Retazo #{a.retazo_id} · {a.error_codigo}</p><p className="muted">Verificá el resultado con el proveedor antes de registrar. Un envío incierto no se reenvía automáticamente.</p>{a.envios?.map(e=><div key={e.canal}><p>{e.canal}: {e.estado}</p>{['incierto','fallido'].includes(e.estado)&&<div className="actions"><Button variant="secondary" busy={reconcile.isPending} onClick={()=>reconcile.mutate({id:a.id,canal:e.canal,entregado:true})}>Proveedor confirmó entrega</Button><Button variant="danger" busy={reconcile.isPending} onClick={()=>reconcile.mutate({id:a.id,canal:e.canal,entregado:false})}>Proveedor confirmó que no se envió</Button></div>}</div>)}</div>)}</Panel>
 </>}</>;
}
