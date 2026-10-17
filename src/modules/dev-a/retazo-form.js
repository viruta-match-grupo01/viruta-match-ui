/** Lógica pura del formulario de carga. La API valida de nuevo: esto solo orienta al operario. */
export const MEDIDA_MIN_OFRECIBLE_CM=20;
export const MEDIDA_MAX_CM=120;
/** Solo se admite la imagen ficticia hasta que Román y A cierren el contrato de subida de fotos. */
export const FOTO_EJEMPLO='/retazo-demo.svg';

export const initialRetazoForm={material:'MDF',espesor_mm:'18',alto_cm:'',ancho_cm:'',color:'blanco',acabado:'mate',forma_retiro:'Retiro presencial en sucursal'};

export function medidaError(value,label) {
  if(value===''||value===null||value===undefined) return `${label}: indicá la medida`;
  const n=Number(value);
  if(!Number.isInteger(n)) return `${label}: usá un número entero de cm`;
  if(n<1) return `${label}: debe ser mayor que 0`;
  if(n>MEDIDA_MAX_CM) return `${label}: no puede superar ${MEDIDA_MAX_CM} cm`;
  return '';
}

export function formErrors(form) {
  const errors={};
  const alto=medidaError(form.alto_cm,'Alto'),ancho=medidaError(form.ancho_cm,'Ancho');
  if(alto) errors.alto_cm=alto;
  if(ancho) errors.ancho_cm=ancho;
  if(form.forma_retiro.trim().length<3) errors.forma_retiro='Indicá la forma de retiro';
  return errors;
}

export function quedaraDescartado(form) {
  const errors=formErrors(form);
  if(errors.alto_cm||errors.ancho_cm) return false;
  return Number(form.alto_cm)<MEDIDA_MIN_OFRECIBLE_CM||Number(form.ancho_cm)<MEDIDA_MIN_OFRECIBLE_CM;
}

/** Cuerpo exacto del contrato POST /api/retazos. Sucursal y operario los pone el servidor. */
export function buildRetazoPayload(form) {
  const melamina=form.material==='melamina';
  return {material:form.material,espesor_mm:Number(form.espesor_mm),alto_cm:Number(form.alto_cm),ancho_cm:Number(form.ancho_cm),color:melamina?form.color:null,acabado:melamina?form.acabado:null,foto_url:FOTO_EJEMPLO,forma_retiro:form.forma_retiro.trim()};
}

/** Query de GET /api/retazos/precio, o null mientras las medidas no sean válidas. */
export function estimateQuery(form) {
  const errors=formErrors(form);
  if(errors.alto_cm||errors.ancho_cm) return null;
  const params=new URLSearchParams({material:form.material,espesor_mm:form.espesor_mm,alto_cm:form.alto_cm,ancho_cm:form.ancho_cm});
  if(form.material==='melamina') params.set('color',form.color);
  return params.toString();
}

export const thicknessLabel=value=>String(value).replace('.',',');
