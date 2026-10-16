# Viruta Match UI

Entrega del 16/10/2026 para `viruta-match-grupo01/viruta-match-ui`. React + Vite del starter actual, con los módulos B y diseño común del acuerdo.

## Ejecutar

Primero iniciar la API con su migración y seed. En otra terminal, dentro de UI:

```bash
npm ci
cp .env.example .env
npm run dev
```

Abrir http://127.0.0.1:5173. El puerto es fijo; si está ocupado, cerrar la instancia anterior. Vite hace proxy de `/api` a `127.0.0.1:3001`; no se conecta con SQLite.

Prueba de cliente: `usuario1@example.invalid`, contraseña `demo-local`. Crear pedido MDF, 18 mm, 40 × 60 cm, Palermo Hollywood. Hay retazos ficticios compatibles. Los avisos salen en el siguiente tick del minuto dentro de 08–20 de Buenos Aires (captura local, sin correo real). Fuera de horario quedan en cola. Dueño: `usuario3@example.invalid` con la misma contraseña, para reportes/reconciliación.

Pantallas implementadas: login, pedidos, avisos/detalle y reportes. La reserva depende de C; un 501 se informa como error y no simula éxito. Operario/encargado ven inicio hasta que A/C registren sus pantallas.

Guido agrega su UI en `src/modules/dev-a/`, C en `src/modules/dev-c/`. Registrar rutas en `src/modules/equipo-routes.jsx`. Componentes comunes en `src/components/ui/`, layout en `src/components/layout/`; reutilizar el mismo CSS, catálogo API, cliente HTTP y sesión.

```bash
npm run check
```

Incluye oxlint, pruebas y build. En producción, Nginx debe servir `dist` con fallback de rutas SPA y proxy de `/api`; cualquier `VITE_*` es público. No colocar secretos en UI.
