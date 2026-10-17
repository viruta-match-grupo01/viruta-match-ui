import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {request} from '../../api.js';
import {PageHeader,Panel,Button,FormField,FeedbackMessage,QueryState,DataTable} from '../../components/ui/index.jsx';
import {money} from '../../shared/format.js';
import {thicknessLabel} from './retazo-form.js';
import './dev-a.css';

/** /precios · dueño · precio por m² según material, espesor y color (RF-21). */
export function Precios({user}) {
  const qc=useQueryClient();
  const q=useQuery({queryKey:['precios',user.id],queryFn:()=>request('/precios')});
  const cats=useQuery({queryKey:['catalogos',user.id],queryFn:()=>request('/catalogos')});
  const [form,setForm]=useState({material:'MDF',espesor_mm:'18',color:'blanco',precio_m2:''}),[notice,setNotice]=useState('');
  const melamina=form.material==='melamina';
  const save=useMutation({
    mutationFn:()=>request('/precios',{method:'PUT',body:{material:form.material,espesor_mm:Number(form.espesor_mm),color:melamina?form.color:null,precio_m2:Number(form.precio_m2)}}),
    onSuccess:()=>{setNotice('Precio guardado. Los retazos que se carguen desde ahora usan este valor.');setForm(f=>({...f,precio_m2:''}));qc.invalidateQueries({queryKey:['precios',user.id]});}
  });
  function update(key,value){setForm(f=>({...f,[key]:value}));setNotice('');save.reset();}
  const columns=[
    {key:'material',label:'Material'},
    {key:'espesor_mm',label:'Espesor (mm)',render:r=>thicknessLabel(r.espesor_mm)},
    {key:'color',label:'Color',render:r=>r.color??'—'},
    {key:'precio_m2',label:'Precio por m²',render:r=>money(r.precio_m2)}
  ];
  return <>
    <PageHeader title="Precios por m²" description="El sistema calcula el precio de cada retazo con estos valores. El operario no puede modificarlo."/>
    <FeedbackMessage kind="success">{notice}</FeedbackMessage>
    <Panel>
      <h2>Fijar o cambiar un precio</h2>
      <QueryState query={cats}/>
      {cats.isSuccess&&<form className="form-grid" onSubmit={e=>{e.preventDefault();setNotice('');save.mutate();}}>
        <FormField label="Material"><select value={form.material} onChange={e=>update('material',e.target.value)}>{cats.data.materiales.map(x=><option key={x}>{x}</option>)}</select></FormField>
        <FormField label="Espesor (mm)"><select value={form.espesor_mm} onChange={e=>update('espesor_mm',e.target.value)}>{cats.data.espesores_mm.map(x=><option key={x} value={x}>{thicknessLabel(x)}</option>)}</select></FormField>
        {melamina&&<FormField label="Color" hint="El color solo cuenta para la melamina."><select value={form.color} onChange={e=>update('color',e.target.value)}>{cats.data.colores.map(x=><option key={x}>{x}</option>)}</select></FormField>}
        <FormField label="Precio por m² (ARS)"><input type="number" inputMode="decimal" min="0" step="0.01" required value={form.precio_m2} onChange={e=>update('precio_m2',e.target.value)}/></FormField>
        <p className="form-note">Un cambio de precio solo afecta a los retazos que se carguen después. Si debe repreciar los ya cargados, está pendiente de confirmar con el dueño.</p>
        <Button type="submit" busy={save.isPending}>{save.isPending?'Guardando…':'Guardar precio'}</Button>
        <FeedbackMessage>{save.error?.message}</FeedbackMessage>
      </form>}
    </Panel>
    <QueryState query={q}/>
    {q.isSuccess&&<DataTable columns={columns} rows={q.data} emptyMessage="Todavía no hay precios cargados"/>}
  </>;
}
