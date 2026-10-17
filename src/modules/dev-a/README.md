> Actualización 17/10: módulos integrados. Ver docs/INTEGRACION_20261017.md para implementación y pendientes; las instrucciones siguientes son antecedentes de cada módulo.

# Dev A — Guido

Pantallas en esta carpeta. Exportarlas e incorporarlas al array `equipoRoutes` de `../equipo-routes.jsx`: `{path:'/retazos',label:'Retazos',roles:['operario'],element:<Retazos/>}`. Importar React y el componente en ese archivo al registrarlo.

Reutilizar `src/components/layout/AppLayout.jsx`, `src/components/ui/index.jsx`, `src/styles.css`, `src/shared/format.js` y `src/api.js`. No agregar otro App/login/QueryClient/BrowserRouter ni una biblioteca visual.

Catálogos: GET `/api/catalogos`; sucursales: GET `/api/sucursales`. Usar TanStack Query con identidad en queryKey de datos propios. La sesión viene de GET `/api/auth/me`; cada endpoint del servidor verifica permisos independientemente del menú.

Mapa: /retazos, /retazos/nuevo, /calidad, /calidad/:id, /registro, /cuenta, /recompensas, /precios. Son rutas propuestas, no endpoints implementados. Registro necesita incorporarse a SessionApp para verse sin sesión; coordinar esa extensión y mantener el mismo login.

Conservar el diseño común del acuerdo y probar a 360/768/1280 px. Crear primero carga/control y conectarlos con B en una integración pequeña; roles completos/recompensas van después.
