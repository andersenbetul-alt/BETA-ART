import type { HomeDict } from "./home.en";

export const uiFr: HomeDict = {
  // Provenance panel
  "ui.prov.label": "Provenance",
  "ui.prov.heading": "Registre de vérification",
  "ui.prov.intro": "Ce registre n'est pas encore vérifié. Une planche n'est décrite comme vérifiée par un humain qu'une fois l'original RAW et le registre de prise de vue archivés.",
  "ui.prov.footer": "La documentation de provenance peut être demandée avant l'octroi de licence. Demandez le numéro de catalogue et vous recevrez le registre existant pour ce fichier.",
  "ui.prov.r.status": "Statut de vérification",
  "ui.prov.r.raw": "Original RAW archivé",
  "ui.prov.r.capture": "Registre de prise de vue conservé",
  "ui.prov.r.signed": "Licence signée par le photographe",
  "ui.prov.r.cat": "Numéro de catalogue",
  "ui.prov.r.c2pa": "Justificatifs de contenu C2PA",

  // Capture metadata table
  "ui.cap.heading": "Métadonnées de prise de vue",
  "ui.cap.date": "Date de prise de vue",
  "ui.cap.location": "Lieu",
  "ui.cap.camera": "Appareil",
  "ui.cap.lens": "Objectif",
  "ui.cap.exposure": "Exposition",

  // Shared placeholder value
  "ui.cap.placeholder": "Image provisoire",
  "ui.val.tbd": "À fournir",

  // Recommendation strip
  "ui.foryou.default": "Continuer dans les archives",
  "ui.foryou.next": "Vous pourriez vouloir obtenir une licence ensuite",
  "ui.foryou.note": "D'après ce que vous avez ouvert ici. Conservé uniquement sur votre appareil — rien n'est envoyé ni suivi.",

  // Breadcrumbs
  "ui.crumb.home": "Accueil",
  "ui.crumb.collection": "Collection",

  // Plate detail page chrome
  "ui.skip": "Aller au contenu",
  "ui.detail.priceNote": "Tarifs provisoires — à titre indicatif uniquement, conditions de licence non confirmées.",
  "ui.detail.licHeading": "Options de licence",
  "ui.detail.licIntro": "Choisissez la portée qui correspond à votre usage. Le résumé ci-dessous est en langage clair ; l'accord signé est le document contraignant.",
  "ui.detail.selectLic": "Sélectionnez une licence",
  "ui.detail.draftPrice": "Prix provisoire — à titre indicatif uniquement",
  "ui.detail.mayDo": "ce que vous pouvez faire",
  "ui.detail.notIncluded": "Non inclus",
  "ui.detail.delivery": "Livraison",
  "ui.detail.orderHeading": "Comment fonctionne la commande",

  // Licence request form
  "ui.form.label": "Demande de licence",
  "ui.form.heading": "Demander des conditions pour une planche",
  "ui.form.intro": "Front-end uniquement pour l'instant — l'intégration de l'envoi et de la livraison doit être connectée avant le lancement. Rien de ce que vous saisissez ici n'est transmis ni stocké.",
  "ui.form.plate": "Planche",
  "ui.form.selectPlate": "Sélectionnez une planche",
  "ui.form.licenceType": "Type de licence",
  "ui.form.selectLicence": "Sélectionnez une licence",
  "ui.form.name": "Nom",
  "ui.form.email": "E-mail",
  "ui.form.company": "Société",
  "ui.form.territory": "Territoire",
  "ui.form.duration": "Durée",
  "ui.form.use": "Utilisation prévue",
  "ui.form.notes": "Remarques",
  "ui.form.optional": "(facultatif)",
  "ui.form.submit": "Préparer la demande",

  // Form — recorded state
  "ui.form.rec.label": "Demande enregistrée dans ce navigateur",
  "ui.form.rec.heading": "Votre demande a été préparée",
  "ui.form.rec.body": "Rien n'a encore été envoyé. Ce site n'a aucun backend d'envoi connecté, de sorte que les informations que vous avez saisies restent uniquement dans cette session de navigateur. L'envoi et la livraison doivent être connectés avant le lancement.",
  "ui.form.rec.plate": "Planche",
  "ui.form.rec.licence": "Licence",
  "ui.form.rec.again": "Démarrer une nouvelle demande",

  // Form — validation
  "ui.form.v.plate": "Sélectionnez une planche.",
  "ui.form.v.licence": "Sélectionnez un type de licence.",
  "ui.form.v.name": "Saisissez votre nom.",
  "ui.form.v.nameLong": "Le nom doit comporter moins de 100 caractères.",
  "ui.form.v.email": "Saisissez votre adresse e-mail.",
  "ui.form.v.emailBad": "Saisissez une adresse e-mail valide.",
  "ui.form.v.company": "La société doit comporter moins de 120 caractères.",
  "ui.form.v.use": "Décrivez comment l'image sera utilisée.",
  "ui.form.v.useLong": "L'utilisation prévue doit comporter moins de 1000 caractères.",
  "ui.form.v.notes": "Les remarques doivent comporter moins de 1000 caractères.",
};
