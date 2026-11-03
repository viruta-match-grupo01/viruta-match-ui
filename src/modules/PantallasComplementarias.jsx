import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {request} from '../api.js';
import {PageHeader,Panel,Button,FormField,FeedbackMessage,QueryState,DataTable,StatusBadge} from '../components/ui/index.jsx';
import {Icon} from '../components/ui/Icon.jsx';
import {useSessionUser} from './dev-c/session.js';
import {date,money,roleLabels} from '../shared/format.js';
const capabilities=[['cliente','person','Cliente','Crea pedidos, recibe coincidencias y confirma una reserva. Paga y retira en la sucursal de origen.'],['operario','carpenter','Operario','Carga retazos y corrige las medidas que solicita el encargado. Consulta sus incentivos.'],['encargado','fact_check','Encargado','Controla la calidad y registra el pago y retiro de su sucursal.'],['duenio','monitoring','Dueño','Administra precios por m² y consulta reportes por sucursal.']];
export function Cuenta(){
 const user=useSessionUser(),qc=useQueryClient();
 const q=useQuery({queryKey:['preferencias',user?.id],queryFn:()=>request('/auth/preferencias'),enabled:!!user&&user.rol==='cliente'});
 const [medio,setMedio]=useState('correo'),[telefono,setTelefono]=useState('');
 useEffect(()=>{if(q.data){setMedio(q.data.medio_aviso);setTelefono(q.data.telefono??'');}},[q.data]);
 const save=useMutation({mutationFn:()=>request('/auth/preferencias',{method:'PATCH',body:{medio_aviso:medio,telefono}}),onSuccess:()=>qc.invalidateQueries({queryKey:['preferencias',user?.id]})});
 if(!user)return null;
 return <><PageHeader title="Mi perfil y preferencias" description="Tu cuenta y medio de notificación."/>
 <div className="profile-grid"><Panel><span className="avatar">{user.nombre.slice(0,1)}</span><h2>{user.nombre}</h2><span className="role-tag">{roleLabels[user.rol]}</span><Link className="button secondary" to="/pedidos">Mis pedidos</Link></Panel>
 <div><Panel><h2>Datos de la cuenta</h2><div className="form-grid"><FormField label="Nombre"><input readOnly value={user.nombre}/></FormField><FormField label="Correo"><input readOnly value={user.email}/></FormField></div></Panel>
 <Panel><h2>Preferencias de aviso</h2><QueryState query={q}/><form onSubmit={e=>{e.preventDefault();save.mutate();}} className="form-grid"><FormField label="Medio preferido"><select value={medio} onChange={e=>setMedio(e.target.value)}><option value="correo">Correo</option><option value="whatsapp">WhatsApp (respaldo por correo)</option><option value="ambos">Ambos (WhatsApp pendiente)</option></select></FormField><FormField label="Teléfono (requerido para WhatsApp)"><input type="tel" value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="+54 11 ..."/></FormField><p className="muted">WhatsApp no está conectado; ante falla se utiliza correo cuando es posible.</p><Button type="submit" busy={save.isPending}>Guardar preferencias</Button><FeedbackMessage>{save.error?.message}</FeedbackMessage>{save.isSuccess&&<p role="status" className="success">Preferencias guardadas.</p>}</form></Panel></div></div></>;
}
export function Inventario(){const user=useSessionUser();return user?<InventarioView user={user}/>:null;}
export function InventarioView({user}){
 const q=useQuery({queryKey:['retazos',user.id],queryFn:()=>request('/retazos'),refetchInterval:30000});const [state,setState]=useState('todos'),[search,setSearch]=useState('');
 const rows=(q.data??[]).filter(r=>(state==='todos'||r.estado===state)&&`${r.id} ${r.material} ${r.espesor_mm}`.toLowerCase().includes(search.toLowerCase()));
 const columns=[{key:'id',label:'Retazo',render:r=>`#${r.id}`},{key:'material',label:'Material'},{key:'espesor_mm',label:'Espesor',render:r=>`${r.espesor_mm} mm`},{key:'alto_cm',label:'Medidas',render:r=>`${r.alto_cm} × ${r.ancho_cm} cm`},{key:'precio',label:'Precio',render:r=>money(r.precio)},{key:'estado',label:'Estado',render:r=><StatusBadge state={r.estado}/>},{key:'cargado_en',label:'Cargado',render:r=>date(r.cargado_en)}];
 return <><PageHeader title="Inventario y depósito" description="Registro de los retazos que cargaste. Los permisos y estados son los mismos que en Mis cargas." actions={<Link className="button primary" to="/retazos/nuevo">Cargar retazo</Link>}/><QueryState query={q}/>{q.isSuccess&&<><section className="metrics">{[['Cargas',q.data.length],['Disponibles',q.data.filter(r=>r.estado==='disponible').length],['En control',q.data.filter(r=>r.estado==='pendiente_control').length],['Reservados',q.data.filter(r=>r.estado==='reservado').length],['Retirados',q.data.filter(r=>r.estado==='retirado').length]].map(([label,value])=><Panel key={label}><span>{label}</span><strong>{value}</strong></Panel>)}</section><div className="list-toolbar"><FormField label="Buscar por número o material"><input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></FormField><FormField label="Estado del retazo"><select value={state} onChange={e=>setState(e.target.value)}><option value="todos">Todos los estados</option>{[...new Set(q.data.map(r=>r.estado))].map(x=><option key={x} value={x}>{x.replaceAll('_',' ')}</option>)}</select></FormField></div><DataTable columns={columns} rows={rows}/></>}<Panel className="panel scope-card"><h2><Icon name="shelves"/>Organización física del taller</h2><p className="muted">Estantes, bahías y ubicaciones físicas del diseño son una referencia para una etapa futura. Este prototipo no registra esas ubicaciones ni presenta un inventario global de otros operarios.</p></Panel></>;
}
export function Administracion(){
 const user=useSessionUser(),qc=useQueryClient();
 const q=useQuery({queryKey:['usuarios-admin'],queryFn:()=>request('/usuarios'),enabled:user?.rol==='duenio'});
 const sucursales=useQuery({queryKey:['sucursales-admin'],queryFn:()=>request('/sucursales'),enabled:user?.rol==='duenio'});
 const empty={nombre:'',email:'',password:'',rol:'cliente',sucursal_id:'',estado:'activo'};
 const [form,setForm]=useState(empty),[editing,setEditing]=useState(null),[feedback,setFeedback]=useState('');
 const save=useMutation({mutationFn:()=>request(editing?`/usuarios/${editing}`:'/usuarios',{method:editing?'PATCH':'POST',body:{nombre:form.nombre,email:form.email,...(form.password?{password:form.password}:{}),rol:form.rol,sucursal_id:['operario','encargado'].includes(form.rol)?Number(form.sucursal_id):null,estado:form.estado}}),onSuccess:()=>{qc.invalidateQueries({queryKey:['usuarios-admin']});setForm(empty);setEditing(null);setFeedback('Cambios guardados.');}});
 function edit(r){setEditing(r.id);setForm({nombre:r.nombre,email:r.email,password:'',rol:r.rol,sucursal_id:r.sucursal_id?String(r.sucursal_id):'',estado:r.estado});save.reset();setFeedback('');}
 if(!user)return null;
 return <><PageHeader title="Gestión de usuarios y roles" description="El dueño administra cuentas del sistema, sus permisos y su sucursal."/>
 <Panel><h2>{editing?`Editar usuario #${editing}`:'Crear usuario'}</h2><form onSubmit={e=>{e.preventDefault();save.mutate();}} className="form-grid">
 <FormField label="Nombre"><input required minLength={2} maxLength={80} value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/></FormField>
 <FormField label="Correo"><input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></FormField>
 <FormField label={editing?'Contraseña nueva (opcional)':'Contraseña inicial'}><input type="password" minLength={10} required={!editing} autoComplete="new-password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/></FormField>
 <FormField label="Rol"><select value={form.rol} onChange={e=>setForm(f=>({...f,rol:e.target.value,sucursal_id:''}))}>{['cliente','operario','encargado','duenio'].map(rol=><option key={rol} value={rol}>{roleLabels[rol]}</option>)}</select></FormField>
 {['operario','encargado'].includes(form.rol)&&<FormField label="Sucursal"><select required value={form.sucursal_id} onChange={e=>setForm(f=>({...f,sucursal_id:e.target.value}))}><option value="">Seleccionar sucursal</option>{(sucursales.data??[]).map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}</select></FormField>}
 <FormField label="Estado"><select value={form.estado} onChange={e=>setForm(f=>({...f,estado:e.target.value}))}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></FormField>
 <div className="actions"><Button type="submit" busy={save.isPending}>{editing?'Guardar cambios':'Crear cuenta'}</Button>{editing&&<Button type="button" variant="secondary" onClick={()=>{setEditing(null);setForm(empty);save.reset();}}>Cancelar edición</Button>}</div>
 <FeedbackMessage>{save.error?.message}</FeedbackMessage>{feedback&&<p role="status" className="success">{feedback}</p>}
 </form></Panel>
 <Panel><h2>Usuarios registrados</h2><QueryState query={q}/>{q.data&&<DataTable columns={[
 {key:'nombre',label:'Nombre'},{key:'email',label:'Correo'},{key:'rol',label:'Rol',render:r=>roleLabels[r.rol]},
 {key:'estado',label:'Estado'},{key:'sucursal_id',label:'Sucursal',render:r=>r.sucursal_id?(sucursales.data??[]).find(s=>s.id===r.sucursal_id)?.nombre??r.sucursal_id:'—'},
 {key:'editar',label:'Acción',render:r=><Button type="button" variant="secondary" onClick={()=>edit(r)}>Editar</Button>}
 ]} rows={q.data}/>}</Panel></>;
}
export function Calificacion(){return <><PageHeader title="Calificación y puntos" description="La experiencia después del retiro también forma parte del proyecto."/><div className="profile-grid"><Panel className="panel profile-summary"><Icon name="task_alt"/><h2>Una segunda oportunidad</h2><p className="muted">La calificación se solicitará después de un retiro propio concretado.</p><Link className="button secondary" to="/reservas">Ver mis reservas</Link></Panel><div><Panel><h2><Icon name="rate_review"/>Material y atención</h2><p>Se evaluarán el estado del retazo y el trato recibido. La escala y el formulario de calificación están pendientes; esta pantalla presenta su lugar en el recorrido.</p><span className="scope-tag">RF-27 · Fuera del prototipo 21/10</span></Panel><Panel className="panel scope-card"><h2><Icon name="loyalty"/>Puntos del cliente</h2><p>Las equivalencias y reglas se definen en fase 2. No se muestran saldos, canjes ni puntos inventados.</p><span className="scope-tag">RF-26 · Fase 2</span></Panel></div></div></>;}
