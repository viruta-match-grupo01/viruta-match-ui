import React,{useState,useEffect,useRef} from 'react';
import {Link,NavLink} from 'react-router-dom';
import {roleLabels} from '../../shared/format.js';
import {Icon} from '../ui/Icon.jsx';
const icons={'/pedidos':'tune','/avisos':'grid_view','/reservas':'timer','/cuenta':'person','/feedback':'reviews','/retazos':'inventory_2','/retazos/nuevo':'add_box','/calidad':'fact_check','/retiros':'point_of_sale','/inventario':'shelves','/incentivos':'savings','/reportes':'monitoring','/precios':'sell','/usuarios':'manage_accounts','/prototipo':'science','/modulos':'space_dashboard'};
export function AppLayout({user,children,moduleRoutes=[]}){
 const [open,setOpen]=useState(false);const menuRef=useRef(null);
 useEffect(()=>{if(!open)return;const escape=e=>{if(e.key==='Escape'){setOpen(false);menuRef.current?.focus();}};window.addEventListener('keydown',escape);return ()=>window.removeEventListener('keydown',escape);},[open]);
 const base=user.rol==='cliente'?[{path:'/pedidos',label:'Mis pedidos'},{path:'/avisos',label:'Coincidencias y avisos'}]:user.rol==='duenio'?[{path:'/reportes',label:'Reportes por sucursal'}]:[{path:'/modulos',label:'Inicio'}];
 const links=[...base,...moduleRoutes.filter(r=>r.label&&r.menu!==false&&r.roles.includes(user.rol))];
 const role=roleLabels[user.rol]??user.rol;
 return <div className={`app-shell role-${user.rol}`}>
  <a href="#contenido" className="skip-link">Ir al contenido</a>
  <header className="app-topbar"><button ref={menuRef} type="button" className="menu-toggle secondary" aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="menu-principal" onClick={()=>setOpen(!open)}><Icon name={open?'close':'menu'}/></button><div className="branch-context"><Icon name={user.sucursal_id?'storefront':'forest'}/><span>{user.sucursal_id?`Sucursal #${user.sucursal_id}`:'Materiales con una segunda oportunidad'}</span></div><span className="role-tag">{role}</span><div className="topbar-user"><strong>{user.nombre}</strong><small>Sesión iniciada</small></div></header>
  {open&&<button type="button" className="nav-scrim" aria-label="Cerrar navegación" onClick={()=>setOpen(false)}/>}
  <aside className={`sidebar ${open?'is-open':''}`}><Link to="/" className="brand" onClick={()=>setOpen(false)}><img src="/viruta-logo.png" alt=""/><span>Viruta Match<small>LA VIRUTA · TALLER DIGITAL</small></span></Link>
   <div className="workspace-card"><span className="eyebrow">ESPACIO DE TRABAJO</span><strong>{role}</strong><span>{user.sucursal_id?`Sucursal de origen #${user.sucursal_id}`:'Red de sucursales'}</span></div>
   <div className="nav-heading">NAVEGACIÓN</div><nav id="menu-principal" aria-label="Principal">{links.map(r=><NavLink key={r.path} to={r.path} end={r.path==='/retazos'} onClick={()=>setOpen(false)}><Icon name={icons[r.path]??'chevron_right'}/><span>{r.label}</span><Icon name="chevron_right" className="nav-chevron"/></NavLink>)}</nav>
   <div className="nav-note"><Icon name="schedule"/><div><strong>Atención 08:00–20:00</strong><small>Pago al retirar en sucursal</small></div></div><div className="sidebar-person"><span className="avatar">{(user.nombre??'?').slice(0,1)}</span><div><strong>{user.nombre}</strong><small>{role}</small></div></div>
  </aside><main id="contenido" className="app-main" tabIndex="-1">{children}<footer className="app-footer"><span>Viruta Match</span><span>Recuperar materiales. Conectar proyectos.</span></footer></main>
 </div>;
}
