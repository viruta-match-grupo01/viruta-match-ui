import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {DevBApp} from './App.jsx';
import {SessionApp} from './SessionApp.jsx';
import './styles.css';
const client=new QueryClient({defaultOptions:{queries:{retry:1,refetchOnWindowFocus:true}}});
createRoot(document.getElementById('root')).render(<React.StrictMode><QueryClientProvider client={client}><BrowserRouter><SessionApp Application={DevBApp}/></BrowserRouter></QueryClientProvider></React.StrictMode>);
