# Diseño de Román + prototipo integrado — 17/10/2026

## Fuente y alcance

Referencia visual: ZIP `stitch_system_ui_design_generator.zip` aportado por Román. Se usaron sus once referencias de pantalla y `viruta_match_workshop_ui/DESIGN.md`. Se adaptó a componentes React; no se ejecutan los HTML exportados como aplicación ni sus scripts/CDN. Siete `screen.png` del ZIP contienen el texto `<FIFE Image failed to fetch>` en vez de una imagen: para esos casos se utilizó el HTML y DESIGN.md. El logo sí es una imagen válida y se incorpora.

Base de GitHub: desarrollo UI `fa941471165b6f06c11b4a6fcfc8fb6b9baadf91`, API `d1656ffb9870951d31fe482c14cbf825b4353175`. Ambas ya contienen A/B/C. Esta actualización cambia la UI; conserva la API existente y sus contratos, estados y permisos. No requiere un PR API ni fusionar otra vez las ramas originales de los desarrolladores.

Fuentes funcionales leídas el 17/10:
- Requerimientos v3.3: https://docs.google.com/spreadsheets/d/1v6TGpySinttehK652J7tncf-JTN29yr850ihzBi7bc0/edit
- Criterios y alcance del prototipo 21/10: https://docs.google.com/spreadsheets/d/12tUVQzNGQ-Ar0THXJ0mCN277sSdLEEVTRogZ0CCgzFc/edit

La matriz separa 12 casos completos, 8 parciales y 11 fuera del prototipo. Los requisitos completos del producto no se reducen por esa priorización. El código ya tiene algunas funciones adicionales a ese mínimo (reportes, incentivos, vencimientos, corrección); eso no acredita aceptación de usuario ni 100 % del proyecto. No se modificaron Drive, MS Project ni sus estados de prueba.

## Sistema visual aplicado

- Plus Jakarta Sans para interfaz; JetBrains Mono para medidas/importes/datos; Material Symbols Outlined para iconografía. Logo ámbar de la referencia.
- Paleta industrial cálida: ámbar, pizarra, superficies blancas y fondo abedul; estados diferenciados por texto y color. Se priorizan los core swatches y superficies de DESIGN.md ante diferencias de su tabla YAML.
- Sidebar de escritorio, barra superior con usuario/rol real, navegación móvil desplegable, Escape para cerrar y devolver foco al botón, enlace para saltar al contenido.
- Tarjetas de retazos con foto, medidas/área/precio/origen; formulario de carga por pasos; listas/tablas con desplazamiento interno; gráficos de reportes derivados de los datos consultados.
- Formularios, confirmaciones, errores y sesión conservan componentes y cliente HTTP compartidos. No se incorporan Tailwind/CDN ni otro framework.
- Fuentes servidas desde public/fonts, incluidas licencias SIL OFL 1.1. Assets obtenidos de Fontsource Variable: Plus Jakarta Sans 5.3.0, JetBrains Mono 5.3.0 y Material Symbols Outlined 5.3.9. No cambian package.json/package-lock.json.

## Mapeo de las referencias recibidas

| Diseño recibido | Pantalla integrada | Estado real |
|---|---|---|
| Carga de retazo operario | /retazos/nuevo y /retazos | Carga, precio y controles existentes conectados; foto de ejemplo explícita |
| Control de calidad encargado | /calidad y /calidad/:id | Aprobar, rechazar y solicitar corrección de medidas |
| Entrega y cobro mostrador | /retiros y /retiros/:id | Pago manual y retiro; MercadoPago pendiente |
| Catálogo y matches cliente | /pedidos, /avisos y /avisos/:id | Pedidos y matching de B; filtro de resultados y vistas lista/tarjetas operativos |
| Mi reserva tiempo restante 2 h | /reservas | Confirmación de C; plazo de retiro corregido a 12 h de atención; muestra fecha límite real, sin cronómetro ficticio |
| Calificación y puntos post retiro | /feedback | Referencia informativa de próxima etapa; no guarda calificaciones ni muestra puntos inventados |
| Dashboard métricas/reportes dueño | /reportes | Totales y gráfico de retiros desde la API, por sucursal; sin cifras ambientales inventadas |
| Perfil y preferencias cliente | /cuenta | Datos de sesión en lectura; edición/registro/medio de aviso fuera del prototipo según RF-08 parcial |
| Inventario y depósito taller | /inventario | Lectura y filtros de las cargas del operario, reutilizando /api/retazos; ubicaciones físicas/globales no implementadas |
| Logo Viruta Match | Identidad, favicon, login, navegación | Logo válido del ZIP aplicado |
| Gestión usuarios/roles administración | /usuarios | Consulta de capacidades por rol para el dueño; no hay ABM ni elevación de permisos, pendientes de definición |

También se adaptan precios, incentivos, inicio de operarios/encargados, errores, diálogos y herramientas de demostración. La existencia de una referencia visual no cambia el alcance funcional de Drive.

## Diferencias corregidas frente al HTML exportado

1. Materiales: únicamente MDF, aglomerado y melamina. Se eliminan opciones de terciado, enchapado y otros materiales no admitidos; espesores del catálogo canónico completo.
2. Medidas: dimensiones de cada retazo 20 a 120 cm para ofrecerlo (menores quedan descartadas), espesor en mm. No se copian tamaños de placas enteras ni se confunden cm con mm.
3. Estados: carga pendiente de control, aprobación disponible, reserva reservado, retiro retirado. No se cambian por enums nuevos de la maqueta.
4. Dos horas de atención son para CONFIRMAR el aviso; doce horas de atención desde la confirmación para PAGAR Y RETIRAR. No se usa el título de retiro 2 h de las maquetas.
5. Se conservan el orden del pedido más antiguo, una reserva activa, precio calculado y obligación de pago aprobado para el retiro.
6. No hay botón para cambiar de operario a encargado sin autenticar. Usuario, rol, sucursal y registros corresponden a la sesión/API, no a Carlos/Lucía/San Telmo de las maquetas.
7. No se presentan como reales WhatsApp, QR/MercadoPago, webhook, impresora, geolocalización, stock por estante, puntos, canjes ni escalas de feedback sin contrato.
8. No se incorporan kilos recuperados, CO2, ingresos diarios o porcentajes de stock sin registros y definición. El tablero comercial no es SPI/CPI ni porcentaje de avance del proyecto.

## Pruebas efectivamente realizadas

- npm ci reproducible en API y UI. API: lint + 99 pruebas; UI: lint + 42 pruebas + build de producción.
- Chromium: flujo conectado con sesión, SQLite y HTTP reales: pedido, carga, corrección, aprobación, correo capturado, reserva, pago manual, retiro, pedido cumplido, incentivos y reportes.
- Búsqueda en coincidencias y cambio de vista lista/tarjetas; aislamiento al cambiar de cliente.
- 18 rutas revisadas a 360, 390, 768, 1024, 1280 y 1440 px (108 combinaciones) sin desbordamiento de la página. Las tablas pueden desplazarse dentro de su contenedor.
- Menú móvil abrible/cerrable y Escape devuelve foco. Fuentes e íconos locales; sin errores JavaScript en el recorrido.
- Flujo completo repetido a 390 px, desde ingreso hasta pago/retiro e incentivos. Login adicional verificado en los mismos seis tamaños (114 combinaciones en total incluyendo login).
- Revisión visual de carga desktop/móvil, reserva y dashboard.
- publicar-diseno.sh probado con remotos Git locales: publicación, reintento y bloqueo si desarrollo cambia. Verificados historial, contenido final y ramas permanentes sin cambios. No se escribió en GitHub desde esta sesión.

Límites: Chromium es la validación automatizada; Safari y dispositivos físicos pendientes. No se acreditan rendimiento de producción, 10 usuarios simultáneos, aceptación final por Franco ni actualización de Project. Correos capturados y pagos ficticios; no se enviaron mensajes ni realizaron cobros reales.

## Para defenderlo ante la profesora

Mostrar un recorrido conectado con datos de ensayo y sus transiciones persistidas. Identificar las simulaciones y las referencias de próximas etapas. Mostrar Project actualizado por el equipo y evidencias de avance según una misma fecha de corte; no confundir métricas comerciales con EV/PV/AC ni inventar SPI/CPI. La aceptación corresponde al Usuario Clave y a las pruebas cruzadas del equipo.
