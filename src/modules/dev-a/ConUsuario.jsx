import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {request} from '../../api.js';
import {LoadingState} from '../../components/ui/index.jsx';

/**
 * DevBApp renderiza `element` sin props, así que cada pantalla de A lee la sesión de la caché
 * compartida (['session'], la misma que llena SessionApp). No crea otro login ni otra sesión.
 */
export function ConUsuario({Screen}) {
  const session=useQuery({queryKey:['session'],queryFn:()=>request('/auth/me'),retry:false});
  if(session.isPending) return <LoadingState/>;
  return session.data?<Screen user={session.data}/>:null;
}
