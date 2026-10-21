> Actualización 17/10: módulos integrados. Ver docs/INTEGRACION_20261017.md para implementación y pendientes; las instrucciones siguientes son antecedentes de cada módulo.

# Dev C

Agregar pantallas aquí y registrarlas en `../equipo-routes.jsx`. Reutilizar layout/componentes, request y calendario del servidor. No crear otra sesión.

La tarjeta B llama `POST /api/reservas` con `{aviso_id}`. Luego de confirmar, invalidar avisos/reservas/pedidos.

## Implementado: reservas y pago/retiro manual

| Ruta UI | Rol | Archivo | API consumida |
|---|---|---|---|
| /reservas (Mi reserva) | cliente | Reservas.jsx | GET /api/reservas, DELETE /api/reservas/:id |
| /retiros (Pago y retiro) | encargado | Retiros.jsx | GET /api/retiros |
| /retiros/:id (sin entrada de menú) | encargado | Retiros.jsx | GET /api/retiros/:id, POST /api/pagos, POST /api/retiros/:id/concretar |

- Mi reserva: comprobante (número de reserva), sucursal de origen, plazo de 12 h de atención con `vence_en` del servidor, estado de pago. Sin pago anticipado. Cancelar pide confirmación y no se ofrece si hay pago aprobado.
- Pago y retiro: búsqueda por número de reserva y listado de activas de la sucursal. Registrar pago (efectivo/transferencia + comprobante) envía `monto=monto_a_pagar` para que la API rechace si el precio cambió. Registrar retiro está separado, pide confirmación y solo se habilita con pago aprobado; si no, explica por qué.
- `rules.js` solo explica bloqueos en pantalla; las reglas decisivas están en la API.
- `session.js` lee la sesión de SessionApp (`['session']`); queryKeys `['reservas',user.id]` y `['retiros',user.id,...]`.

Pendiente: MercadoPago (link/QR y verificación), /feedback/:reservaId, escala de feedback.
