import type { HomeDict } from "./home.en";

export const uiPt: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Proveniência",
  "ui.prov.heading": "Registo de verificação",
  "ui.prov.intro": "Este registo ainda não está verificado. Uma chapa só é descrita como Human Verified quando o original RAW e o registo de captura constam do arquivo.",
  "ui.prov.footer": "A documentação de proveniência pode ser solicitada antes do licenciamento. Peça o número de catálogo e receberá o registo que existir para esse ficheiro.",
  "ui.prov.r.status": "Estado de verificação",
  "ui.prov.r.raw": "Original RAW arquivado",
  "ui.prov.r.capture": "Registo de captura preservado",
  "ui.prov.r.signed": "Licença assinada pelo fotógrafo",
  "ui.prov.r.cat": "Número de catálogo",
  "ui.prov.r.c2pa": "Credenciais de conteúdo C2PA",

  // Capture metadata table
  "ui.cap.heading": "Metadados de captura",
  "ui.cap.date": "Data de captura",
  "ui.cap.location": "Localização",
  "ui.cap.camera": "Câmara",
  "ui.cap.lens": "Objetiva",
  "ui.cap.exposure": "Exposição",

  // Shared placeholder value
  "ui.cap.placeholder": "Imagem provisória",
  "ui.val.tbd": "A fornecer",

  // Recommendation strip
  "ui.foryou.default": "Continuar no arquivo",
  "ui.foryou.next": "Talvez queira licenciar a seguir",
  "ui.foryou.note": "Com base no que abriu aqui. Guardado apenas no seu dispositivo — nada é enviado nem rastreado.",

  // Breadcrumbs
  "ui.crumb.home": "Início",
  "ui.crumb.collection": "Coleção",

  // Plate detail page chrome
  "ui.skip": "Saltar para o conteúdo",
  "ui.detail.priceNote": "Preços preliminares — apenas indicativos, não são condições de licença confirmadas.",
  "ui.detail.licHeading": "Opções de licenciamento",
  "ui.detail.licIntro": "Escolha o âmbito que corresponde à sua utilização. O resumo abaixo está em linguagem simples; o acordo assinado é o documento vinculativo.",
  "ui.detail.selectLic": "Selecione uma licença",
  "ui.detail.draftPrice": "Preço preliminar — apenas indicativo",
  "ui.detail.mayDo": "o que pode fazer",
  "ui.detail.notIncluded": "Não incluído",
  "ui.detail.delivery": "Entrega",
  "ui.detail.orderHeading": "Como funciona a encomenda",

  // Licence request form
  "ui.form.label": "Pedido de licença",
  "ui.form.heading": "Solicitar condições para uma chapa",
  "ui.form.intro": "Por agora apenas front-end — a integração de submissão e entrega tem de ser ligada antes do lançamento. Nada do que introduzir aqui é transmitido ou armazenado.",
  "ui.form.plate": "Chapa",
  "ui.form.selectPlate": "Selecione uma chapa",
  "ui.form.licenceType": "Tipo de licença",
  "ui.form.selectLicence": "Selecione uma licença",
  "ui.form.name": "Nome",
  "ui.form.email": "E-mail",
  "ui.form.company": "Empresa",
  "ui.form.territory": "Território",
  "ui.form.duration": "Duração",
  "ui.form.use": "Utilização prevista",
  "ui.form.notes": "Notas",
  "ui.form.optional": "(opcional)",
  "ui.form.submit": "Preparar pedido",

  // Form — recorded state
  "ui.form.rec.label": "Pedido registado neste navegador",
  "ui.form.rec.heading": "O seu pedido foi preparado",
  "ui.form.rec.body": "Ainda não foi enviado nada. Este site não tem nenhum backend de submissão ligado, pelo que os dados que introduziu permanecem apenas nesta sessão do navegador. O envio e a entrega têm de ser ligados antes do lançamento.",
  "ui.form.rec.plate": "Chapa",
  "ui.form.rec.licence": "Licença",
  "ui.form.rec.again": "Iniciar outro pedido",

  // Form — validation
  "ui.form.v.plate": "Selecione uma chapa.",
  "ui.form.v.licence": "Selecione um tipo de licença.",
  "ui.form.v.name": "Introduza o seu nome.",
  "ui.form.v.nameLong": "O nome deve ter menos de 100 caracteres.",
  "ui.form.v.email": "Introduza o seu endereço de e-mail.",
  "ui.form.v.emailBad": "Introduza um endereço de e-mail válido.",
  "ui.form.v.company": "A empresa deve ter menos de 120 caracteres.",
  "ui.form.v.use": "Descreva como a imagem será utilizada.",
  "ui.form.v.useLong": "A utilização prevista deve ter menos de 1000 caracteres.",
  "ui.form.v.notes": "As notas devem ter menos de 1000 caracteres.",
};
