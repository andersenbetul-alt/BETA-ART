import { useState, useEffect, useRef } from 'react'
import './index.css'

function scrollTo(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

// ─── Atferdssystem: samtykkebasert, kun i nettleseren, sendes aldri ut ───────

const CONSENT_KEY  = 'nc_consent'
const BEHAVIOR_KEY = 'nc_behavior'
type NCEvent = { t: number; e: string; v: string }

function getConsent(): 'all' | 'necessary' | null {
  try {
    const c = localStorage.getItem(CONSENT_KEY)
    if (c === 'all' || c === 'necessary') return c
    if (localStorage.getItem('nc_cookie') === '1') return 'necessary'
  } catch {}
  return null
}

function track(e: string, v: string) {
  if (getConsent() !== 'all') return
  try {
    const now = Date.now()
    const cutoff = now - 90 * 24 * 3600 * 1000
    const list: NCEvent[] = JSON.parse(localStorage.getItem(BEHAVIOR_KEY) || '[]')
      .filter((x: NCEvent) => x.t > cutoff)
    list.push({ t: now, e, v })
    localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(list.slice(-200)))
  } catch {}
}

// Frekvens x ferskhet: nyere interesse teller mest; alt eldre enn 90 dager slettes
function topCategory(): string | null {
  if (getConsent() !== 'all') return null
  try {
    const list: NCEvent[] = JSON.parse(localStorage.getItem(BEHAVIOR_KEY) || '[]')
    const score: Record<string, number> = {}
    const now = Date.now()
    for (const x of list) {
      if (x.e !== 'cat') continue
      const ageDays = (now - x.t) / 86400000
      score[x.v] = (score[x.v] || 0) + Math.max(0.2, 1 - ageDays / 90)
    }
    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0]
    return best ? best[0] : null
  } catch { return null }
}

// "Neste steg": regelbasert og forklarbar — ingen ML, jf. prosjektplanens
// Build-prinsipp. Leser hendelsene og foreslår ett riktig neste steg.
type NextStep = { label: string; action: 'modal' | 'how'; topic?: string }

function nextStep(): NextStep | null {
  if (getConsent() !== 'all') return null
  try {
    const list: NCEvent[] = JSON.parse(localStorage.getItem(BEHAVIOR_KEY) || '[]')
    if (!list.length) return null
    const last = (e: string) => [...list].reverse().find(x => x.e === e)
    const lastSubmit = last('submit')
    const lastCta = last('cta')

    // Allerede sendt inn, og ikke startet noe nytt siden: ikke mas
    if (lastSubmit && (!lastCta || lastSubmit.t >= lastCta.t)) return null

    // Åpnet skjemaet uten å sende: fullfør der de slapp
    if (lastCta) {
      const topic = lastCta.v !== 'generell' ? lastCta.v : (topCategory() || undefined)
      return {
        label: topic
          ? `Fullføre forespørselen om ${topic.toLowerCase()}?`
          : 'Fullføre forespørselen din? Det tar under ett minutt',
        action: 'modal', topic,
      }
    }

    // Så på priser: klar til å starte
    if (last('plan')) return { label: 'Klar til å starte? Første time uten binding', action: 'modal' }

    // Viste interesse for en kategori
    const top = topCategory()
    if (top) return { label: `Fortsette med ${top.toLowerCase()}?`, action: 'modal', topic: top }

    // Leste bare FAQ: vis hvordan det fungerer
    if (last('faq')) return { label: 'Se hvordan det fungerer — tre enkle steg', action: 'how' }

    return null
  } catch { return null }
}

function clearAllLocalData() {
  try {
    localStorage.removeItem(BEHAVIOR_KEY)
    localStorage.removeItem(CONSENT_KEY)
    localStorage.removeItem('nc_cookie')
  } catch {}
  window.location.reload()
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function NaviarLogo({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  const arc  = dark ? '#d8ef75' : '#173d3a'
  const dot  = dark ? '#fffdf8' : '#d8ef75'
  const name = dark ? '#fffdf8' : '#173d3a'
  const sub  = dark ? '#d8ef75' : '#576b68'
  const gap  = size <= 24 ? 7 : 9
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <path d="M 29.19 10.81 A 13 13 0 1 0 10.81 10.81"
              stroke={arc} strokeWidth="3.6" strokeLinecap="round"/>
        <circle cx="29.19" cy="10.81" r="4.2" fill={dot}/>
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: size <= 24 ? 13 : 15, fontWeight: 700, letterSpacing: '0.04em', color: name }}>NAVIAR</div>
        <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: size <= 24 ? 7 : 8, fontWeight: 500, letterSpacing: '0.16em', color: sub, textTransform: 'uppercase', marginTop: 1 }}>CARE</div>
      </div>
    </div>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const EXPERTS = [
  { code: 'SYK', label: 'Sykepleier',       desc: 'Klinisk vurdering, medisinering og omsorg i hjemmet.' },
  { code: 'SOS', label: 'Sosionom',         desc: 'Rettigheter, trygdeytelser og kommunale tjenester.' },
  { code: 'ERG', label: 'Ergoterapeut',     desc: 'Tilpasning av bolig og daglige aktiviteter.' },
  { code: 'PSY', label: 'Psykolog',         desc: 'Sorg, stress og psykisk helse for pårørende.' },
  { code: 'JUR', label: 'Jurist',           desc: 'Fullmakt, testamente og pasientrettigheter.' },
  { code: 'ØKO', label: 'Økonom',           desc: 'Pleiepengeberegning, arv og økonomi.' },
  { code: 'TEK', label: 'Velferdsteknolog', desc: 'Digitale hjelpemidler, GPS og trygghetsteknologi.' },
  { code: 'ERN', label: 'Ernæringsfysiolog', desc: 'Kosthold, matlyst og ernæringsplan.' },
]

const CATEGORIES = [
  { code: 'SOS', label: 'Sosial følge',            desc: 'Besøk, samtale og selskap i hverdagen.' },
  { code: 'TUR', label: 'Tur og aktivitet',        desc: 'Gåturer og aktiviteter i nærmiljøet.' },
  { code: 'ÆRE', label: 'Handling og ærend',       desc: 'Dagligvarer, apotek, post og småærend.' },
  { code: 'HUS', label: 'Enkelt husarbeid',        desc: 'Lette oppgaver hjemme — bæring, rydding, småfiks.' },
  { code: 'TRA', label: 'Transport og avtaler',    desc: 'Følge til lege, frisør eller andre avtaler.' },
  { code: 'TRE', label: 'Trening og aktivitetsfølge', desc: 'Følge til svømming, trim og organisert aktivitet.' },
  { code: 'KOO', label: 'Pårørendekoordinering',   desc: 'Én plan for familien: hvem gjør hva, når.' },
  { code: 'ANN', label: 'Annet — beskriv oppgaven', desc: 'Alle andre lavrisiko-oppgaver i hverdagen. Grensen er risiko, ikke listen.' },
]

const STEPS = [
  { n: '1', title: 'Kartlegging', body: 'Vi kartlegger behov, ønsker og hverdagsrutiner — strukturert, uten søknad og uten helsejournal.' },
  { n: '2', title: 'Behovsavklaring', body: 'Sammen avklarer vi målet bak behovet: aktivitet, mestring og sosial deltakelse — ikke bare oppgaven.' },
  { n: '3', title: 'Hverdagsplan', body: 'Dere mottar en konkret plan: aktiviteter, støttetimer, transport og familiekoordinering.' },
  { n: '4', title: 'Kvalitetssikret match', body: 'En koordinator matcher hjelper på kompetanse, egnethet, interesser og tilgjengelighet — dere godkjenner før oppstart.' },
  { n: '5', title: 'Gjennomføring og oppfølging', body: 'Tjenesten gjennomføres til avtalt tid med full prisoversikt. Vi følger opp kvalitet, trygghet og videre behov.' },
]

const TESTIMONIALS = [
  {
    quote: 'Jeg hadde prøvd å nå fastlegen i tre dager. Her fikk jeg svar fra en sykepleier innen 40 minutter. Det var det jeg trengte.',
    name: 'Marianne L.',
    role: 'Datter til omsorgstrengende forelder, Oslo',
  },
  {
    quote: 'Trygdereglene er et mareritt å navigere alene. Sosionomen forklarte alt på én time — og vi fikk godkjent pleiepenger samme uke.',
    name: 'Bjørn E.',
    role: 'Pårørende, Bergen',
  },
  {
    quote: 'Visste ikke at fullmakt og testamente var to vidt forskjellige ting. Juristen ryddet opp i all forvirringen på en halvtime.',
    name: 'Kari og Tor S.',
    role: 'Ektepar med foreldre i institusjon, Trondheim',
  },
]

const PLANS = [
  {
    name: 'NAVIAR CARE Start',
    price: 'Fast pris',
    unit: '',
    desc: 'Pilotpakken: kartlegging og en personlig plan for hverdagen.',
    items: ['Strukturert behovskartlegging', 'Behovssammendrag + personlig hverdagsplan', 'Henvisning til riktig støtte', 'Systematisk oppfølging etter 14 dager'],
    cta: 'Book behovskartlegging',
    highlight: true,
  },
  {
    name: 'NAVIAR CARE Assist',
    price: '250',
    unit: 'per time',
    desc: 'Alle typer lavrisiko-oppgaver — betal kun for timene du bruker.',
    items: ['Alle lavrisiko-oppgaver, også utenfor kategoriene', 'Gebyr 15–25 % — vises før, trekkes ved fullført hjelp', 'Kontrollert hjelper, godkjent av deg', 'Ingen binding'],
    cta: 'Be om hjelper',
    highlight: false,
  },
  {
    name: 'NAVIAR CARE Partner',
    price: 'Avtale',
    unit: '',
    desc: 'For kommuner, BPA-leverandører og omsorgsvirksomheter.',
    items: ['Behovsanalyse og tjenestedesign', 'Pilotledelse og koordinering', 'Kvalitets- og brukerrapport', 'Plattformlisens, SLA og faktura'],
    cta: 'Ta kontakt',
    highlight: false,
  },
]

const FAQS = [
  {
    q: 'Hvem er ekspertene og hvordan godkjenner dere dem?',
    a: 'Alle rådgivere har godkjent norsk autorisasjon innen sitt fagfelt. Vi verifiserer legitimasjon, arbeidserfaring (minimum 5 år klinisk) og referanser før de tas opp på plattformen. Under piloten gjennomfører vi i tillegg en testsamtale.',
  },
  {
    q: 'Hvor raskt svarer ekspertene?',
    a: 'Målet er under én time på hverdager 08–20. I pilotperioden er gjennomsnittlig responstid 34 minutter (eksempeltall). Kveld og helg har lengre ventetid — vi viser alltid forventet tilgjengelighet før du sender spørsmål.',
  },
  {
    q: 'Hva skjer med informasjonen jeg deler?',
    a: 'Vi lagrer aldri helseopplysninger knyttet til identifiserbar tredjeperson uten eksplisitt samtykke. Samtaler er kryptert og slettes på forespørsel. Naviar AS behandler data i henhold til GDPR og norsk personopplysningslov. Les hele personvernerklæringen vår.',
  },
  {
    q: 'Er dette det samme som å konsultere lege eller advokat?',
    a: 'Nei — Naviar gir faglig veiledning, ikke juridisk rådgivning eller medisinsk behandling. Ekspertene hjelper deg å forstå situasjonen, kjenne rettighetene dine og ta informerte valg. Ved akutte helseproblemer ring alltid 113.',
  },
  {
    q: 'Hva er en fritidskontakt, og hvordan kvalitetssikres de?',
    a: 'En fritidskontakt følger den eldre til kultur- og fritidsaktiviteter — individuelt eller i gruppe, i snitt 3–5 timer per uke. Fritidskontakter er 18 år eller eldre, viser politiattest før oppdrag (vi lagrer den aldri, kun at den er fremvist), og matches på felles interesser og personlighet. Hver match godkjennes av et menneske, aldri av en algoritme alene.',
  },
  {
    q: 'Kan jeg avbryte abonnementet når som helst?',
    a: 'Ja, uten begrunnelse og uten ekstra kostnad. Abonnementet løper til slutten av inneværende periode og fornyes ikke. Du kan avbryte direkte i kontopanelet eller ved å sende oss en e-post.',
  },
]

// ─── Cookie banner ────────────────────────────────────────────────────────────

function CookieBanner({ onAccept }: { onAccept: (level: 'all' | 'necessary') => void }) {
  return (
    <div role="region" aria-label="Informasjonskapsler" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#173d3a',
      borderTop: '1px solid #2a5551',
      padding: '16px 24px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        gap: 20, flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: 13.5, color: '#a8c9c5', margin: 0, flex: '1 1 320px', lineHeight: 1.5 }}>
          Vi lagrer valgene dine kun i din nettleser. Sier du ja til alle, husker
          siden også hva du så på sist — så neste besøk starter der du slapp.
          Ingenting sendes ut av nettleseren, og du kan slette alt når som helst.
        </p>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => onAccept('all')}
            style={{
              padding: '9px 22px',
              background: '#d8ef75', color: '#173d3a',
              fontSize: 13.5, fontWeight: 700,
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}
          >Godta alle</button>
          <button
            onClick={() => onAccept('necessary')}
            style={{
              padding: '9px 22px',
              background: 'transparent', color: '#a8c9c5',
              fontSize: 13.5, fontWeight: 500,
              border: '1px solid #2a5551', borderRadius: 6, cursor: 'pointer',
            }}
          >Kun nødvendige</button>
        </div>
      </div>
    </div>
  )
}

// ─── Contact modal ────────────────────────────────────────────────────────────

function ContactModal({ onClose, initialTopic }: { onClose: () => void; initialTopic?: string }) {
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [situation, setSit]   = useState('')
  const [topic, setTopic]     = useState(initialTopic || '')
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !situation) return
    // Pilot: mailto-based — open email client as submission mechanism
    const body = encodeURIComponent(
      `Navn: ${name}\nE-post: ${email}\nTelefon: ${phone || '—'}\nFagområde: ${topic || '—'}\n\nSituasjon:\n${situation}`
    )
    window.open(`mailto:hei@naviar.no?subject=Forespørsel fra ${encodeURIComponent(name)}&body=${body}`)
    track('submit', topic || 'skjema')
    setStep('done')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #cbd8d0', borderRadius: 6,
    fontSize: 15, color: '#173d3a', background: '#fff',
    outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif',
    boxSizing: 'border-box',
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nc-modal-title"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(23,61,58,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        background: '#fffdf8',
        borderRadius: 12,
        maxWidth: 520, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        padding: '36px 36px 40px',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(23,61,58,0.2)',
      }}>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Lukk"
          style={{
            position: 'absolute', top: 18, right: 18,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#576b68', padding: 4,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {step === 'done' ? (
          <div style={{ textAlign: 'center', paddingTop: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#d8ef75', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#173d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 26, fontWeight: 700, color: '#173d3a', marginBottom: 12 }}>Takk, {name.split(' ')[0]}!</h3>
            <p style={{ fontSize: 15, color: '#576b68', lineHeight: 1.6, marginBottom: 28 }}>
              Henvendelsen er registrert. Vi kontakter deg på <strong>{email}</strong> innen 24 timer for behovsavklaring og videre prosess.
            </p>
            <p style={{ fontSize: 12, color: '#576b68' }}>Dette er et pilotprogram. Responsene kan variere fra produksjonstid.</p>
            <button onClick={onClose} style={{
              marginTop: 20, padding: '12px 28px',
              background: '#173d3a', color: '#fffdf8',
              fontSize: 14, fontWeight: 600,
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}>Lukk</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Behovskartlegging</span>
              <h3 id="nc-modal-title" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, fontWeight: 700, color: '#173d3a', marginTop: 8 }}>Meld inn behov</h3>
              <p style={{ fontSize: 14, color: '#576b68', marginTop: 6 }}>Vi kartlegger behovet og matcher riktig hjelper innen én virkedag.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label htmlFor="nc-name" style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Navn *</label>
                  <input id="nc-name" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ditt navn" autoComplete="name" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="nc-email" style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>E-post *</label>
                  <input id="nc-email" required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="din@epost.no" autoComplete="email" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label htmlFor="nc-phone" style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Telefon (valgfritt)</label>
                  <input id="nc-phone" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+47 000 00 000" autoComplete="tel" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="nc-topic" style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Tjeneste</label>
                  <select id="nc-topic" value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="">Velg tjeneste...</option>
                    {CATEGORIES.map(c => <option key={c.code} value={c.label}>{c.label}</option>)}
                    <option value="Faglig rådgivning">Faglig rådgivning (helse, jus, økonomi)</option>
                    <option value="Bli hjelper">Jeg vil bli hjelper</option>
                    <option value="Vet ikke">Vet ikke ennå</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="nc-situation" style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Beskriv behovet *</label>
                <textarea id="nc-situation" required value={situation} onChange={e => setSit(e.target.value)}
                  placeholder="Beskriv behovet — ikke diagnosen. F.eks.: «Mor trenger hjelp til å søke hjemmetjenester i Bergen.»"
                  rows={4}
                  aria-describedby="nc-situation-hint"
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
                />
                <p id="nc-situation-hint" style={{ fontSize: 12, color: '#576b68', margin: '6px 0 0', lineHeight: 1.5 }}>
                  Ikke skriv diagnoser, medisinlister eller andre helseopplysninger her — eksperten spør om det som trengs, når det trengs.
                </p>
              </div>

              <div style={{ background: '#d9ebe2', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                </svg>
                <p style={{ fontSize: 12.5, color: '#173d3a', margin: 0, lineHeight: 1.5 }}>
                  Vi ber ikke om diagnoser og samler ikke inn mer enn det som trengs for å koble deg til riktig ekspert. Henvendelsen behandles konfidensielt i henhold til GDPR, og du kan be om sletting når som helst.
                </p>
              </div>

              <button type="submit" style={{
                marginTop: 4,
                padding: '14px',
                background: '#173d3a', color: '#fffdf8',
                fontSize: 15, fontWeight: 700,
                border: 'none', borderRadius: 6, cursor: 'pointer',
              }}>
                Send henvendelse →
              </button>
              <p style={{ fontSize: 11.5, color: '#576b68', textAlign: 'center', margin: 0 }}>
                Uforpliktende henvendelse — ingen binding.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Navi: skriptet chatassistent (ingen KI ennå, ingen data ut) ─────────────
// Avataren er en midlertidig SVG. Bytt til ekte bilde ved å legge
// naviar-care/assets/navi.jpg i repoet og erstatte <NaviAvatar/> med <img>.

function NaviAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden style={{ display: 'block', borderRadius: '50%' }}>
      <circle cx="32" cy="32" r="32" fill="#d9ebe2"/>
      <path d="M14 34 a18 18 0 0 1 36 0 v10 a4 4 0 0 1 -8 0 v-8 a14 14 0 0 0 -20 0 v8 a4 4 0 0 1 -8 0 z" fill="#173d3a"/>
      <circle cx="32" cy="34" r="13" fill="#f2d5bd"/>
      <path d="M19 32 a13 13 0 0 1 26 0 c-4 -6 -9 -8 -13 -8 s-9 2 -13 8 z" fill="#173d3a"/>
      <circle cx="27" cy="35" r="1.8" fill="#173d3a"/>
      <circle cx="37" cy="35" r="1.8" fill="#173d3a"/>
      <path d="M28 42 q4 3 8 0" stroke="#173d3a" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <rect x="10" y="30" width="6" height="12" rx="3" fill="#0a7d72"/>
      <rect x="48" y="30" width="6" height="12" rx="3" fill="#0a7d72"/>
      <path d="M50 42 q0 8 -10 9" stroke="#0a7d72" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <circle cx="39" cy="52" r="2.4" fill="#d8ef75"/>
    </svg>
  )
}

type ChatMsg = { from: 'navi' | 'meg'; text: string }

const NAVI_ANSWERS: { keys: RegExp; text: string; topic?: string }[] = [
  { keys: /pris|koste|kr|betal|gebyr/i,
    text: 'NAVIAR CARE Start er pilotpakken til fast pris: behovssamtale, personlig plan og oppfølging etter 14 dager. NAVIAR CARE Assist koster fra 250 kr per time (eksempelpris), pluss plattformgebyr på 15–25 % som alltid vises før du betaler. Vil du booke en behovskartlegging?' },
  { keys: /fungerer|hvordan|steg|virker|metode/i,
    text: 'Vi arbeider i fem steg: kartlegging av behovet, behovsavklaring, en konkret hverdagsplan, kvalitetssikret match (alltid godkjent av et menneske) og oppfølging etter gjennomført tjeneste. Skal jeg åpne behovskartleggingen?' },
  { keys: /hjelper|jobb|søk|arbeid|bli/i,
    text: 'Så fint at du vil bli hjelper! Du må være 18+, vise politiattest (vi lagrer den aldri) og sette dine egne tilgjengelighetstider. Jeg kan åpne søknadsskjemaet for deg.', topic: 'Bli hjelper' },
  { keys: /fritid|tur|aktivitet|følge|svøm/i,
    text: 'Fritidskontakt følger dine nærmeste til aktiviteter — i snitt 3–5 timer i uken, individuelt eller i gruppe, matchet på interesser. Vil du sende en forespørsel?', topic: 'Tur og aktivitet' },
  { keys: /handl|ærend|butikk|apotek|post/i,
    text: 'Vi hjelper med dagligvarer, apotek, post og småærend — betalt per time. Skal jeg åpne forespørselen med riktig tjeneste valgt?', topic: 'Handling og ærend' },
  { keys: /annet|andre ting|noe annet|spesiell/i,
    text: 'Vi hjelper med alt som er lavrisiko — grensen er risiko, ikke en liste. Beskriv oppgaven, så vurderer en koordinator den. Utenfor: medisinsk pleie, pengehåndtering, juridiske råd og alt som krever autorisasjon.', topic: 'Annet — beskriv oppgaven' },
  { keys: /trygg|sikker|attest|personvern|gdpr|data/i,
    text: 'Alle hjelpere viser politiattest før oppdrag (vi lagrer den aldri), matching godkjennes av et menneske, og vi ber aldri om diagnoser eller helseopplysninger. Alt du skriver her blir i nettleseren din.' },
  { keys: /menneske|person|ringe|kontakt|snakke/i,
    text: 'Selvsagt — send inn skjemaet, så tar et ekte menneske kontakt innen 24 timer. Jeg åpner det for deg.' },
]

function NaviChat({ onCta, lifted }: { onCta: (topic?: string) => void; lifted: boolean }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: 'navi', text: 'Hei! Jeg er Navi — en automatisk assistent, ikke et menneske. Jeg svarer på det vanligste og setter deg videre til teamet. Ikke skriv helseopplysninger her. Hva lurer du på?' },
  ])
  const [input, setInput] = useState('')

  function say(text: string) {
    const q = text.trim()
    if (!q) return
    const hit = NAVI_ANSWERS.find(a => a.keys.test(q))
    const reply: ChatMsg = hit
      ? { from: 'navi', text: hit.text }
      : { from: 'navi', text: 'Det kan jeg ikke svare godt på ennå. Vil du sende spørsmålet til teamet? Et menneske svarer innen 24 timer — trykk «Snakk med et menneske».' }
    track('chat', hit ? hit.keys.source.slice(0, 20) : 'ukjent')
    setMsgs(m => [...m, { from: 'meg', text: q }, reply])
    setInput('')
    if (hit?.topic) setTimeout(() => onCta(hit.topic), 900)
  }

  const quick = ['Hva koster det?', 'Hvordan fungerer det?', 'Bli hjelper', 'Snakk med et menneske']

  return (
    <>
      <button
        onClick={() => { setOpen(!open); track('chat', open ? 'lukk' : 'åpne') }}
        aria-label={open ? 'Lukk chat' : 'Åpne chat med Navi, automatisk assistent'}
        style={{
          position: 'fixed', insetInlineEnd: 20, bottom: lifted ? 96 : 20, zIndex: 90,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 16px 8px 8px',
          background: '#173d3a', border: 'none', borderRadius: 100,
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(23,61,58,0.3)',
        }}>
        <NaviAvatar size={36} />
        <span style={{ color: '#fffdf8', fontSize: 14, fontWeight: 700 }}>{open ? 'Lukk' : 'Spør Navi'}</span>
      </button>

      {open && (
        <div role="region" aria-label="Chat med Navi, automatisk assistent" style={{
          position: 'fixed', insetInlineEnd: 20, bottom: lifted ? 156 : 80, zIndex: 90,
          width: 'min(360px, calc(100vw - 40px))',
          background: '#fffdf8', border: '1px solid #cbd8d0', borderRadius: 14,
          boxShadow: '0 12px 40px rgba(23,61,58,0.22)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#173d3a' }}>
            <NaviAvatar size={34} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ color: '#fffdf8', fontSize: 14, fontWeight: 700 }}>Navi</div>
              <div style={{ color: '#7db5ad', fontSize: 11 }}>Automatisk assistent — ikke et menneske</div>
            </div>
          </div>

          <div aria-live="polite" style={{ padding: 14, maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map((m, i) => (
              <p key={i} style={{
                alignSelf: m.from === 'navi' ? 'flex-start' : 'flex-end',
                background: m.from === 'navi' ? '#d9ebe2' : '#173d3a',
                color: m.from === 'navi' ? '#173d3a' : '#fffdf8',
                borderRadius: m.from === 'navi' ? '12px 12px 12px 3px' : '12px 12px 3px 12px',
                padding: '9px 13px', fontSize: 13.5, lineHeight: 1.5, maxWidth: '85%',
              }}>{m.text}</p>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 14px 10px' }}>
            {quick.map(q => (
              <button key={q} onClick={() => q === 'Snakk med et menneske' ? (track('chat', 'menneske'), onCta()) : say(q)} style={{
                fontSize: 12, fontWeight: 600, color: '#173d3a',
                background: '#f7f5ef', border: '1px solid #cbd8d0',
                borderRadius: 100, padding: '5px 12px', cursor: 'pointer',
              }}>{q}</button>
            ))}
          </div>

          <form onSubmit={e => { e.preventDefault(); say(input) }} style={{ display: 'flex', gap: 8, padding: '10px 14px', borderTop: '1px solid #cbd8d0' }}>
            <label htmlFor="navi-input" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Skriv til Navi</label>
            <input id="navi-input" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Skriv et spørsmål..." autoComplete="off"
              style={{ flex: 1, padding: '9px 12px', border: '1px solid #cbd8d0', borderRadius: 6, fontSize: 13.5, fontFamily: 'inherit', color: '#173d3a', background: '#fff' }} />
            <button type="submit" aria-label="Send" style={{
              width: 38, height: 38, background: '#d8ef75', border: 'none', borderRadius: 6,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#173d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({
  menuOpen, setMenuOpen, onCta
}: {
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  onCta: () => void
}) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fffdf8', borderBottom: '1px solid #cbd8d0' }}>
      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <NaviarLogo size={30} />

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {[
            { label: 'Tjenester',         id: 'tjenester' },
            { label: 'Slik fungerer det', id: 'how' },
            { label: 'Fritidskontakt',    id: 'fritid' },
            { label: 'Priser',            id: 'priser' },
            { label: 'For fagpersoner',   id: 'for-section' },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#576b68', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#173d3a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#576b68')}
            >{label}</button>
          ))}
        </div>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16 }}>
          <button onClick={() => {}} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#576b68' }}>Logg inn</button>
          <button onClick={onCta} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 20px',
            background: '#d8ef75', color: '#173d3a',
            fontSize: 14, fontWeight: 700,
            borderRadius: 6, border: 'none', cursor: 'pointer',
          }}>Kom i gang →</button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Meny"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#173d3a' }}>
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#fffdf8', borderTop: '1px solid #cbd8d0', padding: '20px 24px 28px' }}>
          {[
            { label: 'Tjenester',         id: 'tjenester' },
            { label: 'Slik fungerer det', id: 'how' },
            { label: 'Fritidskontakt',    id: 'fritid' },
            { label: 'Priser',            id: 'priser' },
            { label: 'For fagpersoner',   id: 'for-section' },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 0',
                background: 'none', border: 'none', borderBottom: '1px solid #cbd8d0',
                fontSize: 16, fontWeight: 500, color: '#576b68', cursor: 'pointer',
              }}
            >{label}</button>
          ))}
          <button onClick={() => { onCta(); setMenuOpen(false) }} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
            marginTop: 20, padding: '14px',
            background: '#d8ef75', color: '#173d3a',
            fontSize: 15, fontWeight: 700,
            borderRadius: 6, border: 'none', cursor: 'pointer',
          }}>Kom i gang →</button>
        </div>
      )}
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ onCta, next }: { onCta: (topic?: string) => void; next: NextStep | null }) {
  return (
    <section style={{ background: '#f7f5ef', padding: '80px 24px 72px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 10px', background: '#d9ebe2', borderRadius: 100 }}>
            <span style={{ width: 6, height: 6, background: '#0a7d72', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#173d3a', textTransform: 'uppercase' }}>Pilotprogram — aktiv nå</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Left */}
          <div style={{ flex: '1 1 480px', maxWidth: 620 }}>
            <h1 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700, lineHeight: 1.08, color: '#173d3a',
              marginBottom: 24, letterSpacing: '-0.02em', textWrap: 'balance',
            }}>
              Eldreomsorgen,<br/>koordinert —<br/>på ett sted
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#576b68', maxWidth: 480, marginBottom: 40 }}>
              NAVIAR CARE kartlegger behovet, matcher en kvalitetssikret
              hjelper og følger opp gjennomføringen — time for time, med full
              prisoversikt før bestilling. Fagfolk, tjenester og familie samlet
              rundt én plan.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={onCta} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                background: '#173d3a', color: '#fffdf8',
                fontSize: 15, fontWeight: 600,
                borderRadius: 6, border: 'none', cursor: 'pointer',
              }}>
                Book behovskartlegging
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button onClick={() => scrollTo('how')} style={{
                fontSize: 15, fontWeight: 500,
                color: '#173d3a', background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}>Slik arbeider vi</button>
            </div>

            {next && (
              <button
                onClick={() => next.action === 'how' ? scrollTo('how') : onCta(next.topic)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  marginTop: 16, padding: '8px 16px',
                  background: '#d9ebe2', border: '1px solid #cbd8d0',
                  borderRadius: 100, cursor: 'pointer',
                  fontSize: 13.5, fontWeight: 600, color: '#173d3a',
                }}>
                Velkommen tilbake — {next.label} →
              </button>
            )}

            {/* GDPR trust line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 16 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: 12.5, color: '#576b68' }}>Vi lagrer aldri helseopplysninger uten ditt eksplisitte samtykke · GDPR-sikker</span>
            </div>

            {/* Trust stats */}
            <div style={{ display: 'flex', alignItems: 'stretch', marginTop: 52, paddingTop: 40, borderTop: '1px solid #cbd8d0' }}>
              {[
                { val: '89%', label: 'fikk svar\ninnen 60 min' },
                { val: '8',   label: 'fagområder\npå plattformen' },
                { val: '4.8', label: 'snittkarakter\nfra brukerne' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                  {i > 0 && <div style={{ width: 1, background: '#cbd8d0', margin: '0 24px', flexShrink: 0 }} />}
                  <div>
                    <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 30, fontWeight: 700, color: '#173d3a' }}>{s.val}</div>
                    <div style={{ fontSize: 13, color: '#576b68', marginTop: 2, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#576b68', marginTop: 10 }}>* Eksempeltall fra pilotperioden</p>
          </div>

          {/* Right: chat preview card */}
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{
              background: '#fffdf8', border: '1px solid #cbd8d0',
              borderRadius: 12, padding: 28,
              boxShadow: '0 4px 24px rgba(23,61,58,0.06)',
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d9ebe2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#173d3a' }}>Anita Johansen</div>
                    <div style={{ fontSize: 11, color: '#576b68' }}>Sykepleier · Svarer nå</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: '#d9ebe2', borderRadius: 100 }}>
                      <span style={{ width: 5, height: 5, background: '#0a7d72', borderRadius: '50%' }} />
                      <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: '#173d3a' }}>SYK</span>
                    </span>
                  </div>
                </div>

                <div style={{
                  background: '#173d3a', color: '#fffdf8',
                  borderRadius: '12px 12px 2px 12px',
                  padding: '10px 14px',
                  fontSize: 13.5, lineHeight: 1.55, marginBottom: 10,
                }}>
                  Basert på det du beskriver ser det ut til at mamma har klassiske tegn på UTI. Her er tre konkrete tiltak du kan gjøre akkurat nå...
                </div>
                <div style={{ fontSize: 11, color: '#576b68', textAlign: 'right' }}>Mottatt · 4 min etter forespørsel</div>
              </div>

              <div style={{ borderTop: '1px solid #cbd8d0', paddingTop: 16 }}>
                <button onClick={onCta} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '10px 14px',
                  background: '#f7f5ef', borderRadius: 8,
                  border: '1px solid #cbd8d0', cursor: 'pointer',
                  textAlign: 'left',
                }}>
                  <span style={{ fontSize: 13, color: '#576b68', flex: 1 }}>Skriv til en ekspert...</span>
                  <div style={{ width: 30, height: 30, background: '#d8ef75', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#173d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how" style={{ background: '#fffdf8', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Slik fungerer det</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Fra behov til oppfølging — i fem steg</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, background: '#d8ef75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 18, fontWeight: 700, color: '#173d3a' }}>{s.n}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#173d3a', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#576b68' }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Categories (primary service) ────────────────────────────────────────────

function Categories({ onCta, top }: { onCta: (topic?: string) => void; top: string | null }) {
  const ordered = top
    ? [...CATEGORIES].sort((a, b) => (a.label === top ? -1 : b.label === top ? 1 : 0))
    : CATEGORIES
  return (
    <section id="tjenester" style={{ background: '#f7f5ef', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Hjelp time for time</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>All lavrisiko hjelp — time for time</h2>
          <p style={{ fontSize: 16, color: '#576b68', marginTop: 12, maxWidth: 520 }}>
            Lavterskel bistand i hverdagen, levert av kvalitetssikrede
            hjelpere. Omfanget avgrenses av risiko — oppgaver utenfor
            kategoriene vurderes individuelt av en koordinator. Gebyret
            fremgår før bekreftelse og belastes ved fullført tjeneste.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {ordered.map(c => (
            <button key={c.code} onClick={() => { track('cat', c.label); onCta(c.label) }} style={{
              background: '#fffdf8', border: '1px solid #cbd8d0',
              borderRadius: 10, padding: '20px 22px',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#173d3a'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(23,61,58,0.08)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#cbd8d0'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#173d3a' }}>{c.label}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.06em', padding: '2px 7px', background: c.label === top ? '#d8ef75' : '#d9ebe2', color: '#173d3a', borderRadius: 4 }}>{c.label === top ? 'SIST SETT' : c.code}</span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#576b68', margin: 0 }}>{c.desc}</p>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#576b68', marginTop: 20 }}>
          Utenfor tjenesten: medisinsk pleie, pengehåndtering, juridisk rådgivning og alt som krever autorisasjon — det hører til fagteamet eller det offentlige.
        </p>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section style={{ background: '#f7f5ef', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Fra pilotbrukerne</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Hva sier de som har prøvd</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: '#fffdf8', border: '1px solid #cbd8d0',
              borderRadius: 10, padding: '28px 28px 24px',
            }}>
              {/* Quote mark */}
              <svg width="24" height="18" viewBox="0 0 24 18" fill="#d8ef75" aria-hidden style={{ marginBottom: 16 }}>
                <path d="M0 18V10.2C0 4.56 3.36.84 10.08 0l1.68 2.52C8.28 3.24 6.48 5.16 6 8.4h4.08V18H0zm13.92 0V10.2c0-5.64 3.36-9.36 10.08-10.2L25.68 2.52C22.2 3.24 20.4 5.16 19.92 8.4H24V18H13.92z"/>
              </svg>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: '#3a5553', marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ borderTop: '1px solid #cbd8d0', paddingTop: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#173d3a' }}>{t.name}</div>
                <div style={{ fontSize: 12.5, color: '#576b68', marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#576b68', marginTop: 20 }}>* Sitater fra pilotbrukere. Navn og detaljer er anonymisert etter samtykke.</p>
      </div>
    </section>
  )
}

// ─── Experts ─────────────────────────────────────────────────────────────────

function Experts({ onCta }: { onCta: () => void }) {
  return (
    <section id="experts" style={{ background: '#fffdf8', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Faglig støttelag</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>8 fagområder bak tjenesten</h2>
          <p style={{ fontSize: 16, color: '#576b68', marginTop: 12, maxWidth: 480 }}>Når behovet krever autorisert kompetanse, står fagteamet klart — samme plattform, samme plan.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {EXPERTS.map(ex => (
            <button key={ex.code} onClick={() => { track('exp', ex.label); onCta('Faglig rådgivning') }} style={{
              background: '#fffdf8', border: '1px solid #cbd8d0',
              borderRadius: 10, padding: '20px 22px',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#173d3a'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(23,61,58,0.08)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#cbd8d0'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#173d3a' }}>{ex.label}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.06em', padding: '2px 7px', background: '#d9ebe2', color: '#173d3a', borderRadius: 4 }}>{ex.code}</span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#576b68', margin: 0 }}>{ex.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Fritidskontakt ──────────────────────────────────────────────────────────

function Fritidskontakt({ onCta }: { onCta: () => void }) {
  const points = [
    'Match basert på interesser, egnethet og kommunikasjonsstil — godkjent av koordinator',
    'Gjennomsnittlig 3–5 timer per uke, etter avtalt aktivitetsplan',
    'Individuelt eller i gruppe: kultur, aktivitet, trening og sosial deltakelse',
    'Politiattest fremvises før oppdrag — attesten lagres ikke',
  ]
  return (
    <section id="fritid" style={{ background: '#d9ebe2', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 56, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 420px', maxWidth: 560 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Aktivitet og fellesskap</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Fritidskontakt for eldre</h2>
          <p style={{ fontSize: 16, color: '#576b68', marginTop: 14, lineHeight: 1.65 }}>
            Tilrettelagt fritid er en etablert kommunal tjenesteform. NAVIAR
            CARE leverer tilsvarende aktivitets- og deltakelsesstøtte:
            strukturert matching, kvalitetssikring og systematisk oppfølging —
            individuelt eller i gruppe.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <button onClick={() => { track('cat', 'Tur og aktivitet'); onCta('Tur og aktivitet') }} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', background: '#173d3a', color: '#fffdf8',
              fontSize: 14, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer',
            }}>Få en fritidskontakt <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            <button onClick={() => onCta('Bli hjelper')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', background: '#fffdf8', color: '#173d3a',
              fontSize: 14, fontWeight: 600, borderRadius: 6,
              border: '1px solid #cbd8d0', cursor: 'pointer',
            }}>Bli fritidskontakt</button>
          </div>
        </div>
        <ul style={{ flex: '1 1 320px', maxWidth: 480, listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {points.map((p, i) => (
            <li key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              background: '#fffdf8', border: '1px solid #cbd8d0',
              borderRadius: 10, padding: '16px 18px',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#576b68' }}>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing({ onCta }: { onCta: () => void }) {
  return (
    <section id="priser" style={{ background: '#f7f5ef', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 52, maxWidth: 540 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Priser</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Enkel, forutsigbar prising</h2>
          <p style={{ fontSize: 16, color: '#576b68', marginTop: 12, lineHeight: 1.6 }}>Start gratis i pilotperioden. Ingen kredittkort nødvendig.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'start' }}>
          {PLANS.map((p) => (
            <div key={p.name} style={{
              background: p.highlight ? '#173d3a' : '#fffdf8',
              border: `1px solid ${p.highlight ? 'transparent' : '#cbd8d0'}`,
              borderRadius: 12, padding: '32px 28px',
              position: 'relative',
            }}>
              {p.highlight && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#d8ef75', color: '#173d3a',
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 10, letterSpacing: '0.08em',
                  padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>Pårørendepiloten</div>
              )}

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.highlight ? '#7db5ad' : '#576b68' }}>{p.name}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 10, marginBottom: 4 }}>
                  {!/^\d/.test(p.price) ? (
                    <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 32, fontWeight: 700, color: p.highlight ? '#fffdf8' : '#173d3a' }}>{p.price}</span>
                  ) : (
                    <>
                      <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 36, fontWeight: 700, color: p.highlight ? '#fffdf8' : '#173d3a' }}>kr {p.price}</span>
                      <span style={{ fontSize: 14, color: p.highlight ? '#7db5ad' : '#576b68' }}>{p.unit}</span>
                    </>
                  )}
                </div>
                <p style={{ fontSize: 13.5, color: p.highlight ? '#7db5ad' : '#576b68', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.highlight ? '#d8ef75' : '#0a7d72'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 14, color: p.highlight ? '#a8c9c5' : '#576b68', lineHeight: 1.4 }}>{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => { track('plan', p.name); onCta(undefined) }} style={{
                width: '100%', padding: '12px',
                background: p.highlight ? '#d8ef75' : 'transparent',
                color: p.highlight ? '#173d3a' : '#173d3a',
                fontSize: 14, fontWeight: 700,
                border: p.highlight ? 'none' : '1.5px solid #cbd8d0',
                borderRadius: 6, cursor: 'pointer',
              }}>{p.cta} →</button>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#576b68', marginTop: 24 }}>
          * Priser er eksempeltall fra pilotperioden og kan endres. Hjelperens timepris og plattformgebyret vises alltid hver for seg før du betaler. NAVIAR CARE Match — verifisert matching på sted, tid og interesser — inngår i både Start og Assist. Alle priser inkl. mva.
        </p>
      </div>
    </section>
  )
}

// ─── For / For ───────────────────────────────────────────────────────────────

function ForSection({ onCta }: { onCta: () => void }) {
  const paroerende = [
    'Svar fra riktig fagperson — ikke en generell liste',
    'Tilgjengelig hverdager 08–20, responstid under én time',
    'Ingen viderehenvisning. Ekspert svarer direkte.',
    'Trygt og konfidensielt — GDPR-sertifisert',
  ]
  const fagperson = [
    'Fleksibelt arbeid på egne vilkår og tider',
    'Direkte kontakt med pårørende som virkelig trenger deg',
    'Ryddig plattform — bare fagsamtaler, ingen admin',
    'Konkurransedyktig honorar og ukentlig utbetaling',
  ]
  const check = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
  return (
    <section id="for-section" style={{ background: '#fffdf8', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 2, border: '1px solid #cbd8d0', borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{ background: '#f7f5ef', padding: '52px 48px' }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>For pårørende</span>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 700, color: '#173d3a', marginTop: 10, marginBottom: 28, letterSpacing: '-0.01em' }}>Du skal ikke stå alene<br/>med dette</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {paroerende.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{check}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#576b68' }}>{p}</span>
              </li>
            ))}
          </ul>
          <button onClick={onCta} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: '#173d3a', color: '#fffdf8',
            fontSize: 14, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer',
          }}>Meld inn behov <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>

        <div style={{ background: '#d9ebe2', padding: '52px 48px' }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>For fagpersoner</span>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 700, color: '#173d3a', marginTop: 10, marginBottom: 28, letterSpacing: '-0.01em' }}>Bruk kompetansen din<br/>der den trengs mest</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {fagperson.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{check}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#576b68' }}>{p}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => onCta('Bli hjelper')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: '#fffdf8', color: '#173d3a',
            fontSize: 14, fontWeight: 600, borderRadius: 6,
            border: '1px solid #cbd8d0', cursor: 'pointer',
          }}>Søk som fagperson <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" style={{ background: '#f7f5ef', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#576b68', textTransform: 'uppercase' }}>Spørsmål og svar</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Det du lurer på</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderTop: i === 0 ? '1px solid #cbd8d0' : 'none' }}>
                <div style={{ borderBottom: '1px solid #cbd8d0' }}>
                  <button
                    onClick={() => { if (!isOpen) track('faq', faq.q); setOpen(isOpen ? null : i) }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '20px 0',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#173d3a', lineHeight: 1.4 }}>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#576b68" strokeWidth="1.7" strokeLinecap="round" style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <p id={`faq-panel-${i}`} style={{ fontSize: 15, lineHeight: 1.7, color: '#576b68', paddingBottom: 20, margin: 0 }}>{faq.a}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA({ onCta }: { onCta: () => void }) {
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Pilot: open mail client
    window.open(`mailto:hei@naviar.no?subject=Ventliste-påmelding&body=E-post: ${encodeURIComponent(email)}`)
    track('submit', 'venteliste')
    setDone(true)
  }

  return (
    <section id="cta" style={{ background: '#173d3a', padding: '96px 24px', textAlign: 'center', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <NaviarLogo size={32} dark />
        </div>

        <h2 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 700, color: '#fffdf8',
          marginBottom: 20, letterSpacing: '-0.02em', textWrap: 'balance',
        }}>Ikke la usikkerheten<br/>vente til i morgen</h2>

        <p style={{ fontSize: 17, color: '#7db5ad', maxWidth: 400, margin: '0 auto 44px', lineHeight: 1.6 }}>
          Meld inn behovet i dag — vi kartlegger, matcher og følger opp, når det passer dere.
        </p>

        {done ? (
          <div style={{ padding: '20px 28px', background: 'rgba(216,239,117,0.12)', borderRadius: 10, border: '1px solid rgba(216,239,117,0.25)', maxWidth: 380, margin: '0 auto' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#d8ef75', marginBottom: 6 }}>Takk — du er registrert!</div>
            <p style={{ fontSize: 14, color: '#7db5ad', margin: 0 }}>Vi sender deg en e-post så snart du kan ta i bruk Naviar Care.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="din@epost.no"
                style={{
                  flex: '1 1 200px', padding: '13px 18px',
                  fontSize: 15, borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.07)', color: '#fffdf8',
                  outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              />
              <button type="submit" style={{
                padding: '13px 24px',
                background: '#d8ef75', color: '#173d3a',
                fontSize: 15, fontWeight: 700,
                borderRadius: 6, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>Meld meg på →</button>
            </form>

            <p style={{ fontSize: 13, color: '#7db5ad', marginTop: 16 }}>Ingen binding · Avbryt når som helst</p>

            <div style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={onCta} style={{
                fontSize: 14, fontWeight: 500, color: '#7db5ad',
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}>Eller start med et spørsmål med én gang →</button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: '#0f2a28', padding: '40px 24px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
          {/* Logo + tagline */}
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden>
                <path d="M 29.19 10.81 A 13 13 0 1 0 10.81 10.81" stroke="#637774" strokeWidth="3.6" strokeLinecap="round"/>
                <circle cx="29.19" cy="10.81" r="4.2" fill="#637774"/>
              </svg>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#7fa8a2' }}>NAVIAR</div>
                <div style={{ fontSize: 7, fontWeight: 500, letterSpacing: '0.16em', color: '#7fa8a2', textTransform: 'uppercase', marginTop: 1 }}>CARE</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#7fa8a2', lineHeight: 1.55, margin: 0 }}>Koordinering av eldreomsorg i Norge — fagfolk, tjenester og familie på ett sted.</p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 52, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.08em', color: '#7fa8a2', textTransform: 'uppercase', marginBottom: 12 }}>Tjenesten</div>
              {['Slik fungerer det', 'Fagområder', 'Priser', 'For fagpersoner'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 13.5, color: '#7db5ad', textDecoration: 'none' }}>{l}</a></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.08em', color: '#7fa8a2', textTransform: 'uppercase', marginBottom: 12 }}>Selskapet</div>
              {['Om oss', 'Personvern', 'Vilkår for bruk', 'Kontakt'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 13.5, color: '#7db5ad', textDecoration: 'none' }}>{l}</a></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1a3d3a', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#7fa8a2', margin: 0 }}>© 2026 NAVIAR CARE AS · Oslo, Norge</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button onClick={clearAllLocalData} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#7fa8a2', textDecoration: 'underline', textUnderlineOffset: 2, padding: 0,
            }}>Slett lagrede data</button>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7fa8a2" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: 12, color: '#7fa8a2' }}>GDPR-konform · Databehandling i EU</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [modalOpen, setModalOpen]     = useState(false)
  const [initialTopic, setInitialTopic] = useState<string | undefined>(undefined)
  const [consent, setConsent] = useState<'all' | 'necessary' | null>(() => getConsent())
  const top  = consent === 'all' ? topCategory() : null
  const next = consent === 'all' ? nextStep() : null

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.scrollBehavior = 'smooth'
    }
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  function handleCookieAccept(level: 'all' | 'necessary') {
    try { localStorage.setItem(CONSENT_KEY, level) } catch {}
    setConsent(level)
  }

  function openModal(topic?: unknown) {
    const t = typeof topic === 'string' ? topic : undefined
    setInitialTopic(t)
    track('cta', t || 'generell')
    setModalOpen(true)
    setMenuOpen(false)
  }

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} onCta={openModal} />
      <main>
        <Hero onCta={openModal} next={next} />
        <HowItWorks />
        <Categories onCta={openModal} top={top} />
        <Testimonials />
        <Experts onCta={openModal} />
        <Fritidskontakt onCta={openModal} />
        <Pricing onCta={openModal} />
        <ForSection onCta={openModal} />
        <FAQ />
        <FinalCTA onCta={openModal} />
      </main>
      <Footer />
      <NaviChat onCta={openModal} lifted={!consent} />
      {modalOpen && <ContactModal onClose={() => setModalOpen(false)} initialTopic={initialTopic} />}
      {!consent && <CookieBanner onAccept={handleCookieAccept} />}
    </div>
  )
}
