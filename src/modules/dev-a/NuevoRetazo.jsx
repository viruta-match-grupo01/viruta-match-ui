import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {request} from '../../api.js';
import {PageHeader,Panel,Button,FormField,StatusBadge,FeedbackMessage,QueryState} from '../../components/ui/index.jsx';
import {money} from '../../shared/format.js';
import {initialRetazoForm,formErrors,quedaraDescartado,buildRetazoPayload,estimateQuery,thicknessLabel,FOTO_EJEMPLO,MEDIDA_MIN_OFRECIBLE_CM} from './retazo-form.js';
import './dev-a.css';

/** /retazos/nuevo · operario · RF-01 a RF-07 y RF-21. */
export function NuevoRetazo({user}) {
  const qc=useQueryClient();const navigate=useNavigate();
  const cats=useQuery({queryKey:['catalogos',user.id],queryFn:()=>request('/catalogos')});
  const branches=useQuery({queryKey:['sucursales',user.id],queryFn:()=>request('/sucursales')});
  const [form,setForm]=useState(initialRetazoForm),[touched,setTouched]=useState(false),[created,setCreated]=useState(null);
  const errors=formErrors(form),query=estimateQuery(form);
  const price=useQuery({queryKey:['retazo-precio',user.id,query],queryFn:()=>request(`/retazos/precio?${query}`),enabled:!!query,retry:false});
  const create=useMutation({
    mutationFn:()=>request('/retazos',{method:'POST',body:buildRetazoPayload(form)}),
    onSuccess:retazo=>{setCreated(retazo);setForm(f=>({...initialRetazoForm,material:f.material,espesor_mm:f.espesor_mm,color:f.color,acabado:f.acabado}));setTouched(false);qc.invalidateQueries({queryKey:['retazos',user.id]});}
  });
  const branch=branches.data?.find(s=>s.id===user.sucursal_id);
  function update(key,value){setForm(f=>({...f,[key]:value}));setCreated(null);create.reset();}
  function submit(e){e.preventDefault();setTouched(true);if(Object.keys(errors).length)return;setCreated(null);create.mutate();}
  const melamina=form.material==='melamina';
  const shown=key=>touched?errors[key]:undefined;
  return <>
    <PageHeader title="Cargar retazo" description="Registrá el material que sobró. Antes de ofrecerse, el encargado de tu sucursal lo controla." actions={<Button variant="secondary" onClick={()=>navigate('/retazos')}>Ver mis cargas</Button>}/>
    {created&&<Panel role="status"><h2>Retazo #{created.id} cargado</h2><p><StatusBadge state={created.estado}/> {created.estado==='descartado'?created.motivo_estado:'El encargado lo va a controlar. Todavía no se ofrece a ningún cliente.'}</p><p>Precio calculado: <strong>{money(created.precio)}</strong></p></Panel>}
    <Panel>
      <QueryState query={cats}/><QueryState query={branches}/>
      {cats.isSuccess&&branches.isSuccess&&<form className="form-grid" noValidate onSubmit={submit}>
        <FormField label="Material"><select value={form.material} onChange={e=>update('material',e.target.value)}>{cats.data.materiales.map(x=><option key={x}>{x}</option>)}</select></FormField>
        <FormField label="Espesor (mm)"><select value={form.espesor_mm} onChange={e=>update('espesor_mm',e.target.value)}>{cats.data.espesores_mm.map(x=><option key={x} value={x}>{thicknessLabel(x)}</option>)}</select></FormField>
        <FormField label="Alto (cm)" hint="Número entero, hasta 120." error={shown('alto_cm')}><input type="number" inputMode="numeric" min="1" max="120" step="1" required value={form.alto_cm} onChange={e=>update('alto_cm',e.target.value)}/></FormField>
        <FormField label="Ancho (cm)" hint="Número entero, hasta 120." error={shown('ancho_cm')}><input type="number" inputMode="numeric" min="1" max="120" step="1" required value={form.ancho_cm} onChange={e=>update('ancho_cm',e.target.value)}/></FormField>
        {melamina&&<>
          <FormField label="Color"><select value={form.color} onChange={e=>update('color',e.target.value)}>{cats.data.colores.map(x=><option key={x}>{x}</option>)}</select></FormField>
          <FormField label="Acabado"><select value={form.acabado} onChange={e=>update('acabado',e.target.value)}>{cats.data.acabados.map(x=><option key={x}>{x}</option>)}</select></FormField>
        </>}
        <FormField label="Sucursal de origen" hint="Es la de tu usuario; no se puede cambiar."><input type="text" readOnly value={branch?.nombre??'Consultando sucursal…'}/></FormField>
        <FormField label="Forma de retiro" error={shown('forma_retiro')}><input type="text" maxLength={120} required value={form.forma_retiro} onChange={e=>update('forma_retiro',e.target.value)}/></FormField>
        <FormField label="Foto" hint="La subida de fotos reales está pendiente de acordar con Román. Por ahora se registra una imagen de ejemplo."><select value={FOTO_EJEMPLO} onChange={()=>{}}><option value={FOTO_EJEMPLO}>Imagen de ejemplo (ficticia)</option></select></FormField>
        {quedaraDescartado(form)&&<p className="warning" role="status">Con una medida menor a {MEDIDA_MIN_OFRECIBLE_CM} cm el retazo se registra como descartado y no se ofrece a ningún cliente.</p>}
        <div className="price-box" aria-live="polite">
          <span>Precio calculado (solo lectura): </span>
          {!query&&<span>completá alto y ancho para calcularlo.</span>}
          {query&&price.isPending&&<span>Calculando…</span>}
          {query&&price.isSuccess&&<><strong>{money(price.data.precio)}</strong><br/><small>{price.data.area_m2.toFixed(2).replace('.',',')} m² × {money(price.data.precio_m2)} por m². Lo fija el dueño; no se puede editar.</small></>}
          {query&&price.isError&&<span className="field-error">{price.error.message}</span>}
        </div>
        <Button type="submit" busy={create.isPending}>{create.isPending?'Guardando…':'Cargar retazo'}</Button>
        <FeedbackMessage>{create.error?.message}</FeedbackMessage>
      </form>}
    </Panel>
  </>;
}
