import {useQuery} from '@tanstack/react-query';
import {request} from '../../api.js';
/** Las pantallas C leen la misma sesión que SessionApp (queryKey ['session']); no crean otra. */
export function useSessionUser(){return useQuery({queryKey:['session'],queryFn:()=>request('/auth/me'),retry:false}).data;}
