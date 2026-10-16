# Dev C

Agregar pantallas aquí y registrarlas en `../equipo-routes.jsx`. Reutilizar layout/componentes, request y calendario del servidor. No crear otra sesión.

La tarjeta B llama `POST /api/reservas` con `{aviso_id}`. Hasta integrar C, API devuelve 501 y UI muestra error, sin declarar confirmación ni cobrar. Luego de confirmar, invalidar avisos/reservas/pedidos.

Rutas propuestas: /reservas (cliente), /retiros y /retiros/:id (encargado), /feedback/:reservaId (cliente). Separar Registrar pago y Registrar retiro; el segundo exige pago aprobado. Mostrar vencimiento obtenido del servidor, no calcular otro plazo en navegador.
