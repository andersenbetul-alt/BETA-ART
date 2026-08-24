var pptxgen = require('pptxgenjs');
var p = new pptxgen();
p.layout = 'LAYOUT_WIDE';                 // 13.3 x 7.5
p.author = 'Naviar Care';
p.title  = 'Naviar Care – konseptet';

/* Paletten er prosjektets egne tokens. To grønner, ikke én: den ene er
   lesbar på lyst, den andre på blekket. */
var INK='101A2E', BLEKK_MYK='2A3A55', GRONN='1F6F5C', GRONN_MORK='4CB99B',
    SAND='FBF6EE', LYS='FFFFFF', GRA='4A5568', GRA_LYS='9AA6BB', OKER='A9591C';
var SERIF='Cambria', SANS='Calibri';

/* pptxgenjs setter anchor="ctr" på hver tekstboks som ikke sier noe annet.
   To bokser med ulik høyde i samme rad får da tekst på hver sin høyde. Derfor
   toppstiller vi alt som ikke uttrykkelig ber om midtstilling. */
function ark(farge) {
  var sl = p.addSlide(); sl.background = { color: farge };
  var opprinnelig = sl.addText.bind(sl);
  sl.addText = function (t, o) { o = o || {}; if (!o.valign) o.valign = 'top'; return opprinnelig(t, o); };
  return sl;
}
function motiv(s, x, y, b, farge) {          // to punkter og avstanden mellom dem
  s.addShape(p.ShapeType.line, { x:x, y:y, w:b, h:0, line:{ color:farge, width:1.25 } });
  s.addShape(p.ShapeType.ellipse, { x:x-0.05, y:y-0.05, w:0.1, h:0.1, fill:{ color:farge } });
  s.addShape(p.ShapeType.ellipse, { x:x+b-0.05, y:y-0.05, w:0.1, h:0.1,
    fill:{ type:'none' }, line:{ color:farge, width:1.25 } });
}
function tittel(s, t, farge) {
  s.addText(t, { x:0.9, y:0.55, w:11.5, h:1.0, fontFace:SERIF, fontSize:38, bold:true,
                 color:farge||INK, margin:0, valign:'top' });
}
function merke(s, farge) {
  s.addText([{ text:'NAVIAR ', options:{ bold:true, charSpacing:2 } },
              { text:'CARE', options:{ charSpacing:2 } }],
    { x:0.9, y:6.75, w:3.0, h:0.3, fontFace:SANS, fontSize:10,
      color:farge||GRA_LYS, valign:'top', margin:0 });
}

/* 1 — tittel */
var s1 = ark(INK);
s1.addText('Tjenesten er definert\nav det den nekter å lagre',
  { x:0.9, y:2.0, w:9.5, h:2.2, fontFace:SERIF, fontSize:46, bold:true, color:LYS,
    lineSpacing:52, margin:0 });
s1.addText('Naviar Care · hvordan konseptet ble til, og hva det er til for',
  { x:0.9, y:4.4, w:9.5, h:0.4, fontFace:SANS, fontSize:15, color:GRONN_MORK, margin:0 });
motiv(s1, 0.9, 5.35, 4.2, GRA_LYS);
s1.addText('Deg', { x:0.9, y:5.5, w:1, h:0.3, fontFace:SANS, fontSize:11, color:GRA_LYS, margin:0 });
s1.addText('Mamma', { x:3.9, y:5.5, w:1.2, h:0.3, align:'right', fontFace:SANS, fontSize:11, color:GRA_LYS, margin:0 });
s1.addNotes('Naviar Care er programvare for tjenesteleverandører som gjør praktiske besøk hos eldre hjemme. Denne presentasjonen forteller hvordan konseptet ble formet – og at det ble formet av en grense, ikke av en funksjonsliste.');

/* 2 — problemet */
var s2 = ark(SAND);
tittel(s2, 'Problemet er en avstand');
s2.addText([
  { text:'Hun vil bo hjemme. ', options:{ bold:true } },
  { text:'Du bor et annet sted, og du kan ikke være der hver gang noe praktisk må ordnes.' }
], { x:0.9, y:1.9, w:6.0, h:1.2, fontFace:SANS, fontSize:17, color:INK, lineSpacing:26, margin:0 });
s2.addText('Det finnes hjelp. Problemet er ikke mangel på tjenester – det er at ingen vet hva som faktisk skjedde, når, og av hvem.',
  { x:0.9, y:3.2, w:6.0, h:1.2, fontFace:SANS, fontSize:15, color:GRA, lineSpacing:24, margin:0 });
s2.addShape(p.ShapeType.roundRect, { x:7.6, y:1.9, w:4.8, h:3.3, rectRadius:0.12,
  fill:{ color:LYS }, line:{ color:'E4DCCF', width:1 }, shadow:{ type:'outer', angle:90, blur:14, offset:3, opacity:0.10, color:'101A2E' } });
s2.addText('Handle dagligvarer', { x:8.0, y:2.25, w:4.0, h:0.4, fontFace:SERIF, fontSize:20, bold:true, color:INK, margin:0 });
[['Tirsdag 18.00', GRONN],['Sagene', GRONN],['Venter på svar', GRA_LYS]].forEach(function (r, i) {
  s2.addShape(p.ShapeType.ellipse, { x:8.05, y:2.92+i*0.5, w:0.13, h:0.13, fill:{ color:r[1] } });
  s2.addText(r[0], { x:8.35, y:2.82+i*0.5, w:3.6, h:0.35, fontFace:SANS, fontSize:14, color:GRA, margin:0 });
});
s2.addText('Familien kan ordne. Den eldre bestemmer.',
  { x:8.0, y:4.55, w:4.2, h:0.4, fontFace:SANS, fontSize:13, italic:true, color:GRONN, margin:0 });
merke(s2);
s2.addNotes('Utgangspunktet er ikke en app-idé. Det er en avstand mellom to mennesker, og et informasjonshull i midten.');

/* 3 — setningen */
var s3 = ark(LYS);
tittel(s3, 'Setningen alt annet henger på');
s3.addShape(p.ShapeType.roundRect, { x:0.9, y:1.85, w:11.5, h:1.85, rectRadius:0.12,
  fill:{ color:SAND }, line:{ color:'E4DCCF', width:1 } });
s3.addText('Naviar Care er en programvaretjeneste som hjelper verifiserte tjenesteleverandører med å planlegge, dokumentere og varsle om praktiske besøk utført av leverandørens egne ansatte.',
  { x:1.3, y:1.85, w:10.7, h:1.85, fontFace:SERIF, fontSize:20, color:INK, lineSpacing:30, valign:'middle', margin:0 });
s3.addText('Hver funksjon prøves mot den setningen. Naviar er ikke:',
  { x:0.9, y:4.1, w:11.5, h:0.35, fontFace:SANS, fontSize:15, color:GRA, margin:0 });
['arbeidsgiver','leverandør av helsehjelp','nødtjeneste','faglig ansvarlig for medarbeiderne'].forEach(function (t, i) {
  var x = 0.9 + i*2.95;
  s3.addShape(p.ShapeType.roundRect, { x:x, y:4.65, w:2.7, h:0.62, rectRadius:0.3,
    fill:{ color:LYS }, line:{ color:'DDE2EA', width:1 } });
  s3.addText(t, { x:x+0.12, y:4.65, w:2.46, h:0.62, fontFace:SANS, fontSize:11.5,
    color:GRA, align:'center', valign:'middle', margin:0 });
});
merke(s3);
s3.addNotes('Setningen er ikke markedsføring. Den er testen: kommer et forslag i konflikt med den, blir det ikke bygget.');

/* 4 — modellbyttet */
var s4 = ark(LYS);
tittel(s4, 'Konseptet ble formet av en grense');
s4.addShape(p.ShapeType.roundRect, { x:0.9, y:1.85, w:5.3, h:2.5, rectRadius:0.12,
  fill:{ color:'F4F6FA' }, line:{ color:'DDE2EA', width:1 } });
s4.addText('Først: markedsplass', { x:1.25, y:2.1, w:4.6, h:0.4, fontFace:SERIF, fontSize:19, bold:true, color:GRA, margin:0 });
s4.addText('Privatpersoner registrerer seg som hjelper. Naviar velger person, setter pris, fordeler oppdrag.',
  { x:1.25, y:2.6, w:4.6, h:1.1, fontFace:SANS, fontSize:14, color:GRA, lineSpacing:22, margin:0 });
s4.addText('Forkastet', { x:1.25, y:3.75, w:4.6, h:0.35, fontFace:SANS, fontSize:13, bold:true, color:OKER, margin:0 });

s4.addShape(p.ShapeType.roundRect, { x:7.1, y:1.85, w:5.3, h:2.5, rectRadius:0.12,
  fill:{ color:'E6F1ED' }, line:{ color:GRONN, width:1 } });
s4.addText('Nå: programvare til leverandøren', { x:7.45, y:2.1, w:4.6, h:0.4, fontFace:SERIF, fontSize:19, bold:true, color:GRONN, margin:0 });
s4.addText('Leverandøren er arbeidsgiver og legger inn sine egne ansatte. Naviar velger ingen og setter ingen lønn.',
  { x:7.45, y:2.6, w:4.6, h:1.1, fontFace:SANS, fontSize:14, color:INK, lineSpacing:22, margin:0 });
s4.addText('I drift som pilot', { x:7.45, y:3.75, w:4.6, h:0.35, fontFace:SANS, fontSize:13, bold:true, color:GRONN, margin:0 });

s4.addText([{ text:'«Grunnen er ikke smak.» ', options:{ bold:true, color:INK } },
  { text:'Om noen er arbeidstaker eller oppdragstaker avgjøres av det reelle forholdet, ikke av hva avtalen kalles. En plattform som velger person, setter pris og styrer utførelsen, argumenterer mot seg selv.', options:{ color:GRA } }],
  { x:0.9, y:5.15, w:11.5, h:1.3, fontFace:SANS, fontSize:14, lineSpacing:23, margin:0 });
merke(s4);
s4.addNotes('Dette er kjernen i hvordan konseptet ble til: en juridisk analyse av arbeidsgiveransvar fjernet en hel produktretning, og det som ble igjen er skarpere.');

/* 5 — tre dører */
var s5 = ark(LYS);
tittel(s5, 'Tre mennesker, tre ulike dører');
s5.addText('Den enkeltbeslutningen som er lettest å rive ned uten å merke det.',
  { x:0.9, y:1.65, w:11.5, h:0.35, fontFace:SANS, fontSize:15, color:GRA, margin:0 });
[['Kontoret','E-postinnlogging','Én konto, én arbeidsdag, mange besøk', GRONN],
 ['Hjelperen som søker','Telefon + engangskode','Bekrefter at nummeret er hennes. Én gang', GRONN],
 ['Arbeideren på oppdrag','Lenke per besøk. Ingen konto','Tilgang til ett besøk, ikke til et forhold', OKER]
].forEach(function (r, i) {
  var y = 2.25 + i*1.35;
  s5.addShape(p.ShapeType.ellipse, { x:0.9, y:y+0.12, w:0.62, h:0.62, fill:{ color: i===2 ? 'FBEEE0' : 'E6F1ED' } });
  s5.addText(String(i+1), { x:0.9, y:y+0.12, w:0.62, h:0.62, fontFace:SERIF, fontSize:20,
    bold:true, color:r[3], align:'center', valign:'middle', margin:0 });
  s5.addText(r[0], { x:1.75, y:y+0.12, w:3.4, h:0.62, fontFace:SERIF, fontSize:18, bold:true, color:INK, valign:'middle', margin:0 });
  s5.addText(r[1], { x:5.3, y:y+0.12, w:3.1, h:0.62, fontFace:SANS, fontSize:14, bold:true, color:r[3], valign:'middle', margin:0 });
  s5.addText(r[2], { x:8.6, y:y+0.12, w:3.8, h:0.62, fontFace:SANS, fontSize:13, color:GRA, lineSpacing:20, valign:'middle', margin:0 });
});
s5.addText('Arbeiderlenken dør etter tolv timer. Gir vi henne en konto, blir tilgangen varig, og et oppdrag blir en relasjon systemet må vedlikeholde.',
  { x:0.9, y:6.15, w:11.5, h:0.5, fontFace:SANS, fontSize:13.5, italic:true, color:GRA, margin:0 });
merke(s5);
s5.addNotes('Arbeideren har ikke konto. Det er et bevisst valg, ikke en mangel.');

/* 6 — grensen */
var s6 = ark(SAND);
tittel(s6, 'Fire ting bygges aldri');
s6.addText('Uansett hvordan de blir bedt om.',
  { x:0.9, y:1.65, w:11.5, h:0.35, fontFace:SANS, fontSize:15, color:GRA, margin:0 });
[['Helsehjelp','Medisinering, stell, sårbehandling, vurdering av helsetilstand'],
 ['Penger','PIN, BankID, kontonummer eller verdisaker'],
 ['Overvåking','Løpende posisjon, bilder fra hjemmet, lydopptak'],
 ['Automatikk uten menneske','Avgjørelser med store følger som ingen ser på']
].forEach(function (r, i) {
  var x = 0.9 + (i%2)*5.85, y = 2.3 + Math.floor(i/2)*1.75;
  s6.addShape(p.ShapeType.roundRect, { x:x, y:y, w:5.55, h:1.45, rectRadius:0.12,
    fill:{ color:LYS }, line:{ color:'E4DCCF', width:1 } });
  s6.addText(r[0], { x:x+0.35, y:y+0.2, w:5.0, h:0.4, fontFace:SERIF, fontSize:18, bold:true, color:OKER, margin:0 });
  s6.addText(r[1], { x:x+0.35, y:y+0.68, w:5.0, h:0.6, fontFace:SANS, fontSize:13.5, color:GRA, lineSpacing:20, margin:0 });
});
s6.addText('Et flagg er en policy. Fravær av kode er en grense.',
  { x:0.9, y:6.05, w:11.5, h:0.5, fontFace:SERIF, fontSize:19, bold:true, color:INK, margin:0 });
merke(s6);
s6.addNotes('Blir noe av dette bedt om, sier vi hva grensen er og hva som kan gjøres i stedet. Vi bygger det ikke bak et flagg.');

/* 7 — sletting */
var s7 = ark(LYS);
tittel(s7, 'Opplysningene faller bort i fire trinn');
s7.addText('Slettingen kjører ved hver lesning, ikke som en nattjobb. En sletterutine som ikke kjører, er ikke en sletterutine.',
  { x:0.9, y:1.6, w:11.5, h:0.4, fontFace:SANS, fontSize:15, color:GRA, margin:0 });
[['12 timer','Arbeiderlenken','token'],
 ['7 dager','Friteksten','notat · rapport.kommentar'],
 ['30 dager','Navn og kontaktpunkt','kunde · pårørende · ansattnavn'],
 ['1 år','Resten','id · oppgaver · tid · status']
].forEach(function (r, i) {
  var y = 2.3 + i*0.92;
  s7.addText(r[0], { x:0.9, y:y, w:1.5, h:0.4, fontFace:SANS, fontSize:14, bold:true,
    color:GRONN, align:'right', margin:0 });
  s7.addShape(p.ShapeType.ellipse, { x:2.65, y:y+0.11, w:0.16, h:0.16, fill:{ color:GRONN } });
  if (i < 3) s7.addShape(p.ShapeType.line, { x:2.73, y:y+0.27, w:0, h:0.76, line:{ color:'DDE2EA', width:1.5 } });
  s7.addText(r[1], { x:3.1, y:y-0.03, w:3.2, h:0.4, fontFace:SERIF, fontSize:17, bold:true, color:INK, margin:0 });
  s7.addText(r[2], { x:6.4, y:y+0.02, w:6.0, h:0.4, fontFace:'Courier New', fontSize:12,
    color:GRA, strike:'sngStrike', margin:0 });
});
s7.addShape(p.ShapeType.roundRect, { x:0.9, y:6.0, w:11.5, h:0.72, rectRadius:0.1, fill:{ color:INK } });
s7.addText('DET SOM STÅR IGJEN', { x:1.25, y:6.0, w:2.1, h:0.72, fontFace:SANS,
  fontSize:11, charSpacing:1.5, color:GRA_LYS, valign:'middle', margin:0 });
s7.addText('Måned og utfall. Raden handler ikke om noen lenger.', { x:3.75, y:6.0, w:8.3, h:0.72,
  fontFace:SANS, fontSize:15, color:LYS, valign:'middle', margin:0 });
s7.addNotes('Dette er ikke sletting av rader – felter faller bort etter tur. Etter fjerde trinn er raden anonym statistikk.');

/* 8 — måltall */
var s8 = ark(LYS);
tittel(s8, 'Tallene er utledet, ikke valgt');
s8.addText('Brukerne er eldre og pårørende. Det avgjør målene.',
  { x:0.9, y:1.65, w:11.5, h:0.35, fontFace:SANS, fontSize:15, color:GRA, margin:0 });
[['7:1','Kontrast internt','Kravet i WCAG AA på 4,5:1 er utledet som 3:1 × 1,5 for synsstyrken til en åttiåring – altså null margin for våre brukere'],
 ['96 px','Trykkflate','WCAG krever 24. Førtifire treffes ikke av en hånd som skjelver'],
 ['200 %','Skrift uten å flyte','Norsk brekker der engelsk ikke gjør det. «Funksjonsnedsettelse» får ikke plass på en telefon']
].forEach(function (r, i) {
  var x = 0.9 + i*3.9;
  s8.addText(r[0], { x:x, y:2.35, w:3.5, h:1.0, fontFace:SERIF, fontSize:54, bold:true, color:GRONN, margin:0 });
  s8.addText(r[1], { x:x, y:3.45, w:3.5, h:0.35, fontFace:SANS, fontSize:15, bold:true, color:INK, margin:0 });
  s8.addText(r[2], { x:x, y:3.95, w:3.5, h:1.3, fontFace:SANS, fontSize:13, color:GRA, lineSpacing:20, margin:0 });
});
s8.addText('Alle 40 feilmeldinger er role="alert". En sperre uten alternativ blir omgått – og for den som ikke ser skjermen, fantes alternativet aldri.',
  { x:0.9, y:6.0, w:11.5, h:0.5, fontFace:SANS, fontSize:13.5, italic:true, color:GRA, margin:0 });
merke(s8);
s8.addNotes('AA-kravet er avledet fra synsstyrken til en åttiåring. Derfor har AA null margin for nettopp våre brukere, og AAA er den ansvarlige interne grensa.');

/* 9 — to tjenester */
var s9 = ark(LYS);
tittel(s9, 'To tjenester under ett merke');
s9.addShape(p.ShapeType.roundRect, { x:0.9, y:1.85, w:5.55, h:4.1, rectRadius:0.12,
  fill:{ color:'E6F1ED' }, line:{ color:GRONN, width:1 } });
s9.addText('Besøksbekreftelse', { x:1.3, y:2.15, w:4.8, h:0.45, fontFace:SERIF, fontSize:22, bold:true, color:GRONN, margin:0 });
s9.addText('«Ett besøk. Én bekreftelse. Alle vet det.»', { x:1.3, y:2.68, w:4.8, h:0.4, fontFace:SANS, fontSize:14, italic:true, color:INK, margin:0 });
[['Betaler','Leverandøren'],['Selges som','Programvare per leverandør'],['Status','I drift som pilot']].forEach(function (r, i) {
  s9.addText(r[0], { x:1.3, y:3.35+i*0.72, w:1.7, h:0.3, fontFace:SANS, fontSize:11.5, color:GRA, margin:0 });
  s9.addText(r[1], { x:1.3, y:3.62+i*0.72, w:4.8, h:0.35, fontFace:SANS, fontSize:14.5, bold:true, color:INK, margin:0 });
});
s9.addShape(p.ShapeType.roundRect, { x:6.85, y:1.85, w:5.55, h:4.1, rectRadius:0.12,
  fill:{ color:SAND }, line:{ color:'E4DCCF', width:1 } });
s9.addText('Klarhet 45', { x:7.25, y:2.15, w:4.8, h:0.45, fontFace:SERIF, fontSize:22, bold:true, color:INK, margin:0 });
s9.addText('«Én samtale. Tre tydelige neste steg.»', { x:7.25, y:2.68, w:4.8, h:0.4, fontFace:SANS, fontSize:14, italic:true, color:INK, margin:0 });
[['Betaler','Familien eller den eldre'],['Selges som','599 kr for 45 minutter'],['Status','Betaling sperret til fire punkter er avklart']].forEach(function (r, i) {
  s9.addText(r[0], { x:7.25, y:3.35+i*0.72, w:1.7, h:0.3, fontFace:SANS, fontSize:11.5, color:GRA, margin:0 });
  s9.addText(r[1], { x:7.25, y:3.62+i*0.72, w:4.8, h:0.35, fontFace:SANS, fontSize:14.5, bold:true, color:INK, margin:0 });
});
s9.addText('Legekonsultasjon er tegnet, beskrevet og bevisst ikke bygget: vurdering av symptomer er helsehjelp.',
  { x:0.9, y:6.35, w:11.5, h:0.4, fontFace:SANS, fontSize:13.5, italic:true, color:OKER, margin:0 });
s9.addNotes('Klarhet åpner to betalingsstrømmer koden holder stengt. Derfor står den som «avklares», ikke som «kommer snart».');

/* 10 — status */
var s10 = ark(INK);
s10.addText('Hvor det står', { x:0.9, y:0.75, w:11.5, h:0.8, fontFace:SERIF, fontSize:38, bold:true, color:LYS, margin:0 });
[['324','enhetstester'],['153','nettlesertester'],['0','feilende']].forEach(function (r, i) {
  var x = 0.9 + i*3.9;
  s10.addText(r[0], { x:x, y:1.9, w:3.5, h:0.9, fontFace:SERIF, fontSize:44, bold:true, color:GRONN_MORK, margin:0 });
  s10.addText(r[1], { x:x, y:2.85, w:3.5, h:0.35, fontFace:SANS, fontSize:13, color:GRA_LYS, margin:0 });
});
s10.addText('Personvernsperra er prøvd mot en ekte PostgreSQL: 79 tekster gjennom både nettleseren og databasen, null uenigheter. Krympingen i fire trinn er kjørt for ekte.',
  { x:0.9, y:3.6, w:11.5, h:0.9, fontFace:SANS, fontSize:15, color:'C8D0DE', lineSpacing:24, margin:0 });
s10.addText('Neste', { x:0.9, y:4.75, w:3, h:0.35, fontFace:SANS, fontSize:11, bold:true, charSpacing:2, color:GRONN_MORK, margin:0 });
['Varemerket er ikke søkt opp – navnet er ikke bekreftet ledig',
 'Tre avgjørelser om innlogging står åpne',
 'Betaling for Klarhet krever fire juridiske avklaringer'].forEach(function (t, i) {
  s10.addText(t, { x:0.9, y:5.15+i*0.42, w:11.5, h:0.38, fontFace:SANS, fontSize:14,
    color:LYS, bullet:true, margin:0 });
});
motiv(s10, 0.9, 6.85, 4.2, GRONN_MORK);
s10.addNotes('Det som gjenstår er ikke kode. Det er tre avgjørelser og et varemerkesøk.');

p.writeFile({ fileName: 'naviar-konsept.pptx' }).then(function (f) { console.log('skrev', f); });
