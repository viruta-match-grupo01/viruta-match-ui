# Viruta Match UI — diseño de Román responsive

Estado actual: docs/DISENO_ROMAN_20261017.md. Se conserva la integración A/B/C y se aplica la referencia visual aportada por Román. El alcance del prototipo del 21/10 y las funciones futuras están diferenciados.

# Viruta Match UI — prototipo integrado A/B/C

Estado y pendientes: docs/INTEGRACION_20261017.md. React/Vite, una sesión y diseño/componentes comunes para los tres módulos. Node 24 (.nvmrc), instalar desde lockfile.

Iniciar primero API (migrar y seed local). En otra terminal:

```bash
npm ci
cp .env.example .env
npm run dev
```

Abrir http://127.0.0.1:5173. Proxy /api hacia 127.0.0.1:3001; UI no accede directamente a SQLite. Nunca poner secretos en VITE_*.

Cliente: pedidos, avisos, reserva. Operario: cargas/correcciones e incentivos. Encargado: calidad, pagos/retiros e incentivos. Dueño: precios, reportes y herramientas de ensayo opt-in. Los permisos se vuelven a validar en servidor.

Datos de ejemplo: usuario1@example.invalid a usuario5@example.invalid, contraseña demo-local (roles en README de API). En la demostración utilizar aglomerado 18 mm, sucursal Palermo Hollywood, mínimo 40×60 y retazo 40×60 para un cruce nuevo sin mezclar fixtures MDF.

```bash
npm run check
```

Incluye lint, 42 pruebas y build. Falta feedback, cuentas públicas, fotos reales e integración MercadoPago. UI estática en producción requiere fallback SPA/proxy/HTTPS; esta entrega no despliega infraestructura.
