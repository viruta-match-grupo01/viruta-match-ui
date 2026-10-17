import React from 'react';
import {Link,NavLink} from 'react-router-dom';
import {roleLabels} from '../../shared/format.js';
export function AppLayout({user,children,moduleRoutes=[]}){
 const base=user.rol==='cliente'?[{path:'/pedidos',label:'Mis pedidos'},{path:'/avisos',label:'Coincidencias y avisos'}]:user.rol==='duenio'?[{path:'/reportes',label:'Reportes por sucursal'}]:[{path:'/modulos',label:'Inicio'}];
 const links=[...base,...moduleRoutes.filter(r=>r.label&&r.menu!==false&&r.roles.includes(user.rol))];
 return <><header><Link to="/" className="brand"><span className="brand-icon">V</span><span>Viruta <b>Match</b><small>Materiales con una segunda oportunidad</small></span></Link><span>{user.nombre} · {roleLabels[user.rol]??user.rol}</span></header><div className="layout"><nav aria-label="Principal">{links.map(r=><NavLink key={r.path} to={r.path}>{r.label}</NavLink>)}<div className="nav-note">Atención<br/><strong>08:00–20:00</strong><br/>Pago al retirar en sucursal</div></nav><main>{children}</main></div></>;
}
