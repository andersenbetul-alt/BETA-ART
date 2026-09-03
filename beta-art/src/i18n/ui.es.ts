import type { HomeDict } from "./home.en";

export const uiEs: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Procedencia",
  "ui.prov.heading": "Registro de verificación",
  "ui.prov.intro": "Este registro aún no está verificado. Una placa solo se describe como Human Verified cuando el original RAW y el registro de captura constan en archivo.",
  "ui.prov.footer": "Se puede solicitar la documentación de procedencia antes de licenciar. Pida el número de catálogo y recibirá el registro que exista para ese archivo.",
  "ui.prov.r.status": "Estado de verificación",
  "ui.prov.r.raw": "Original RAW archivado",
  "ui.prov.r.capture": "Registro de captura conservado",
  "ui.prov.r.signed": "Licencia firmada por el fotógrafo",
  "ui.prov.r.cat": "Número de catálogo",
  "ui.prov.r.c2pa": "Credenciales de contenido C2PA",

  // Capture metadata table
  "ui.cap.heading": "Metadatos de captura",
  "ui.cap.date": "Fecha de captura",
  "ui.cap.location": "Ubicación",
  "ui.cap.camera": "Cámara",
  "ui.cap.lens": "Objetivo",
  "ui.cap.exposure": "Exposición",

  // Shared placeholder value
  "ui.cap.placeholder": "Imagen provisional",
  "ui.val.tbd": "Por facilitar",

  // Recommendation strip
  "ui.foryou.default": "Continuar en el archivo",
  "ui.foryou.next": "Quizá quiera licenciar a continuación",
  "ui.foryou.note": "Según lo que abrió aquí. Se guarda solo en su dispositivo — no se envía ni se rastrea nada.",

  // Breadcrumbs
  "ui.crumb.home": "Inicio",
  "ui.crumb.collection": "Colección",

  // Plate detail page chrome
  "ui.skip": "Saltar al contenido",
  "ui.detail.priceNote": "Precios provisionales — solo orientativos, no son condiciones de licencia confirmadas.",
  "ui.detail.licHeading": "Opciones de licencia",
  "ui.detail.licIntro": "Elija el alcance que corresponda a su uso. El resumen siguiente está en lenguaje claro; el acuerdo firmado es el documento vinculante.",
  "ui.detail.selectLic": "Seleccione una licencia",
  "ui.detail.draftPrice": "Precio provisional — solo orientativo",
  "ui.detail.mayDo": "lo que puede hacer",
  "ui.detail.notIncluded": "No incluido",
  "ui.detail.delivery": "Entrega",
  "ui.detail.orderHeading": "Cómo funciona el pedido",

  // Licence request form
  "ui.form.label": "Solicitud de licencia",
  "ui.form.heading": "Solicitar condiciones para una placa",
  "ui.form.intro": "Por ahora solo front-end — la integración de envío y entrega debe conectarse antes del lanzamiento. Nada de lo que introduzca aquí se transmite ni se almacena.",
  "ui.form.plate": "Placa",
  "ui.form.selectPlate": "Seleccione una placa",
  "ui.form.licenceType": "Tipo de licencia",
  "ui.form.selectLicence": "Seleccione una licencia",
  "ui.form.name": "Nombre",
  "ui.form.email": "Correo electrónico",
  "ui.form.company": "Empresa",
  "ui.form.territory": "Territorio",
  "ui.form.duration": "Duración",
  "ui.form.use": "Uso previsto",
  "ui.form.notes": "Notas",
  "ui.form.optional": "(opcional)",
  "ui.form.submit": "Preparar solicitud",

  // Form — recorded state
  "ui.form.rec.label": "Solicitud registrada en este navegador",
  "ui.form.rec.heading": "Su solicitud se ha preparado",
  "ui.form.rec.body": "Todavía no se ha enviado nada. Este sitio no tiene conectado ningún backend de envío, por lo que los datos que introdujo permanecen solo en esta sesión del navegador. El envío y la entrega deben conectarse antes del lanzamiento.",
  "ui.form.rec.plate": "Placa",
  "ui.form.rec.licence": "Licencia",
  "ui.form.rec.again": "Iniciar otra solicitud",

  // Form — validation
  "ui.form.v.plate": "Seleccione una placa.",
  "ui.form.v.licence": "Seleccione un tipo de licencia.",
  "ui.form.v.name": "Introduzca su nombre.",
  "ui.form.v.nameLong": "El nombre debe tener menos de 100 caracteres.",
  "ui.form.v.email": "Introduzca su dirección de correo electrónico.",
  "ui.form.v.emailBad": "Introduzca una dirección de correo electrónico válida.",
  "ui.form.v.company": "La empresa debe tener menos de 120 caracteres.",
  "ui.form.v.use": "Describa cómo se utilizará la imagen.",
  "ui.form.v.useLong": "El uso previsto debe tener menos de 1000 caracteres.",
  "ui.form.v.notes": "Las notas deben tener menos de 1000 caracteres.",
};
