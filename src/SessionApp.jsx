import React,{useState} from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {request} from './api.js';
import {useNavigate,useLocation} from 'react-router-dom';
import {destinationAfterLogin} from './shared/navigation.js';
import {equipoRoutes} from './modules/equipo-routes.jsx';
import {Button,FormField,FeedbackMessage,LoadingState,Panel} from './components/ui/index.jsx';
import {date} from './shared/format.js';
export function SessionApp({Application}){
 const qc=useQueryClient();const navigate=useNavigate();const location=useLocation();const [email,setEmail]=useState(''),[password,setPassword]=useState('');
 const session=useQuery({queryKey:['session'],queryFn:()=>request('/auth/me'),retry:false});
 const environment=useQuery({queryKey:['entorno'],queryFn:()=>request('/entorno'),enabled:!!session.data,refetchInterval:30000,retry:false});
 const login=useMutation({mutationFn:()=>request('/auth/login',{method:'POST',body:{email,password}}),onSuccess:u=>{qc.clear();qc.setQueryData(['session'],u);setPassword('');navigate(destinationAfterLogin(u,location.pathname),{replace:true});}});
 const logout=useMutation({mutationFn:()=>request('/auth/logout',{method:'POST',body:{}}),onSuccess:()=>{qc.clear();qc.setQueryData(['session'],null);login.reset();}});
 if(session.isPending)return <main><LoadingState/></main>;
 if(session.error&&session.error.status!==401)return <main><FeedbackMessage>{session.error.message}</FeedbackMessage><Button onClick={()=>session.refetch()}>Reintentar conexión</Button></main>;
 if(!session.data)return <main className="login"><section className="login-story"><div className="login-brand"><img src="/viruta-logo.png" alt=""/>Viruta Match</div><h1>La madera sigue.<br/><span>Tu proyecto empieza.</span></h1><p>Conectamos los retazos de La Viruta con ideas que merecen una segunda oportunidad.</p><span className="eyebrow">MATERIALES · PERSONAS · NUEVOS PROYECTOS</span></section><div className="login-form-wrap"><Panel><div className="brand"><img src="/viruta-logo.png" alt=""/>Viruta Match</div><h2>Iniciar sesión</h2><p>Ingresá a tu espacio de trabajo.</p><form onSubmit={e=>{e.preventDefault();login.mutate();}}><FormField label="Correo electrónico"><input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></FormField><FormField label="Contraseña"><input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></FormField><Button type="submit" busy={login.isPending}>{login.isPending?'Ingresando…':'Ingresar'}</Button><FeedbackMessage>{login.error?.message}</FeedbackMessage></form><p className="muted">Usá la cuenta asignada por el equipo para probar el prototipo.</p></Panel></div></main>;
 return <>{environment.data?.demo&&<div className="demo-banner">Prototipo local · Hora simulada: {date(environment.data.ahora)} · {environment.data.avisos==='capture'?'Correos capturados, sin envío real':'Canal SMTP configurado'}</div>}<div className="session-bar"><Button variant="secondary" busy={logout.isPending} onClick={()=>logout.mutate()}>Cerrar sesión</Button><FeedbackMessage>{logout.error?.message}</FeedbackMessage></div><Application user={session.data} moduleRoutes={equipoRoutes}/></>;
}
