import { useState, useEffect, useRef } from 'react'
import './index.css'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function NaviarLogo({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  const arc  = dark ? '#d8ef75' : '#173d3a'
  const dot  = dark ? '#fffdf8' : '#d8ef75'
  const name = dark ? '#fffdf8' : '#173d3a'
  const sub  = dark ? '#d8ef75' : '#637774'
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

const STEPS = [
  { n: '1', title: 'Beskriv situasjonen', body: 'Fortell kort hva du trenger hjelp med. Ingen journaler, ingen skjemaer — bare skriv som til et medmenneske.' },
  { n: '2', title: 'Match med riktig ekspert', body: 'Vi kobler deg til en fagperson med erfaring fra nettopp din situasjon — innen én time på dagtid.' },
  { n: '3', title: 'Få klar, handlingsrettet hjelp', body: 'Eksperten svarer direkte, konkret og uten viderehenvisning. Du sitter igjen med neste steg — ikke nye spørsmål.' },
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
    name: 'Enkeltspørsmål',
    price: '249',
    unit: 'per konsultasjon',
    desc: 'Én fagsamtale med én ekspert. Betaler per gang — ingen binding.',
    items: ['Svar innen én time', 'Velg fagområde selv', 'Skriftlig oppsummering inkludert'],
    cta: 'Start her',
    highlight: false,
  },
  {
    name: 'Månedlig',
    price: '799',
    unit: 'per måned',
    desc: 'Ubegrenset tilgang for hele familien. Avbryt når som helst.',
    items: ['Ubegrensede spørsmål', 'Alle 8 fagområder', 'Prioritert responstid', 'Familiedeling (opptil 4 pers.)'],
    cta: 'Prøv gratis i 14 dager',
    highlight: true,
  },
  {
    name: 'Bedrift / Arbeidsgiver',
    price: 'Avtale',
    unit: '',
    desc: 'For HR og bedrifter som ønsker å støtte ansatte med pårørendeansvar.',
    items: ['Volumrabatt fra 10 ansatte', 'Dedikert kontaktperson', 'Brukerrapport månedlig', 'SLA og faktura'],
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
    q: 'Kan jeg avbryte abonnementet når som helst?',
    a: 'Ja, uten begrunnelse og uten ekstra kostnad. Abonnementet løper til slutten av inneværende periode og fornyes ikke. Du kan avbryte direkte i kontopanelet eller ved å sende oss en e-post.',
  },
]

// ─── Cookie banner ────────────────────────────────────────────────────────────

function CookieBanner({ onAccept }: { onAccept: () => void }) {
  return (
    <div style={{
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
          Vi bruker informasjonskapsler for å huske innstillingene dine og forbedre tjenesten.
          {' '}<a href="#" style={{ color: '#d8ef75', textDecoration: 'underline' }}>Les personvernerklæringen</a>.
        </p>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={onAccept}
            style={{
              padding: '9px 22px',
              background: '#d8ef75', color: '#173d3a',
              fontSize: 13.5, fontWeight: 700,
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}
          >Godta alle</button>
          <button
            onClick={onAccept}
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

function ContactModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [situation, setSit]   = useState('')
  const [topic, setTopic]     = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !situation) return
    // Pilot: mailto-based — open email client as submission mechanism
    const body = encodeURIComponent(
      `Navn: ${name}\nE-post: ${email}\nTelefon: ${phone || '—'}\nFagområde: ${topic || '—'}\n\nSituasjon:\n${situation}`
    )
    window.open(`mailto:hei@naviar.no?subject=Forespørsel fra ${encodeURIComponent(name)}&body=${body}`)
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
          onClick={onClose}
          aria-label="Lukk"
          style={{
            position: 'absolute', top: 18, right: 18,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#637774', padding: 4,
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
            <p style={{ fontSize: 15, color: '#637774', lineHeight: 1.6, marginBottom: 28 }}>
              Vi har mottatt forespørselen din og tar kontakt på <strong>{email}</strong> innen 24 timer for å koble deg med riktig ekspert.
            </p>
            <p style={{ fontSize: 12, color: '#9bb8b4' }}>Dette er et pilotprogram. Responsene kan variere fra produksjonstid.</p>
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
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>Kom i gang</span>
              <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, fontWeight: 700, color: '#173d3a', marginTop: 8 }}>Fortell oss om situasjonen</h3>
              <p style={{ fontSize: 14, color: '#637774', marginTop: 6 }}>Vi kobler deg med riktig ekspert innen én arbeidsdag.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Navn *</label>
                  <input required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ditt navn" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>E-post *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="din@epost.no" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Telefon (valgfritt)</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+47 000 00 000" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Fagområde</label>
                  <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="">Velg fagområde...</option>
                    {EXPERTS.map(ex => <option key={ex.code} value={ex.label}>{ex.label}</option>)}
                    <option value="Vet ikke">Vet ikke ennå</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#173d3a', display: 'block', marginBottom: 6 }}>Beskriv situasjonen *</label>
                <textarea required value={situation} onChange={e => setSit(e.target.value)}
                  placeholder="Fortell kort hva du trenger hjelp med. Jo mer du beskriver, jo bedre kan vi matche deg med riktig ekspert."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
                />
              </div>

              <div style={{ background: '#d9ebe2', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                </svg>
                <p style={{ fontSize: 12.5, color: '#173d3a', margin: 0, lineHeight: 1.5 }}>
                  Vi lagrer ikke helseopplysninger om tredjepersoner uten samtykke. Din henvendelse behandles konfidensielt i henhold til GDPR.
                </p>
              </div>

              <button type="submit" style={{
                marginTop: 4,
                padding: '14px',
                background: '#173d3a', color: '#fffdf8',
                fontSize: 15, fontWeight: 700,
                border: 'none', borderRadius: 6, cursor: 'pointer',
              }}>
                Send forespørsel →
              </button>
              <p style={{ fontSize: 11.5, color: '#9bb8b4', textAlign: 'center', margin: 0 }}>
                Ingen binding. Avbryt når som helst.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
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
            { label: 'Slik fungerer det', id: 'how' },
            { label: 'Eksperter',         id: 'experts' },
            { label: 'Priser',            id: 'priser' },
            { label: 'For fagpersoner',   id: 'for-section' },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#637774', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#173d3a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#637774')}
            >{label}</button>
          ))}
        </div>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16 }}>
          <button onClick={() => {}} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#637774' }}>Logg inn</button>
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
            { label: 'Slik fungerer det', id: 'how' },
            { label: 'Eksperter',         id: 'experts' },
            { label: 'Priser',            id: 'priser' },
            { label: 'For fagpersoner',   id: 'for-section' },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 0',
                background: 'none', border: 'none', borderBottom: '1px solid #cbd8d0',
                fontSize: 16, fontWeight: 500, color: '#637774', cursor: 'pointer',
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

function Hero({ onCta }: { onCta: () => void }) {
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
              Faglig hjelp<br/>til pårørende —<br/>tilgjengelig nå
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#637774', maxWidth: 480, marginBottom: 40 }}>
              Koble deg til erfarne rådgivere innen helse, jus og økonomi.
              Svar innen én time — uten venteliste, uten viderehenvisning.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={onCta} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                background: '#173d3a', color: '#fffdf8',
                fontSize: 15, fontWeight: 600,
                borderRadius: 6, border: 'none', cursor: 'pointer',
              }}>
                Start gratis — ingen binding
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button onClick={() => scrollTo('how')} style={{
                fontSize: 15, fontWeight: 500,
                color: '#173d3a', background: 'none', border: 'none', cursor: 'pointer',
                opacity: 0.65, textDecoration: 'underline', textUnderlineOffset: 3,
              }}>Se hvordan det fungerer</button>
            </div>

            {/* GDPR trust line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 16 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: 12.5, color: '#637774' }}>Vi lagrer aldri helseopplysninger uten ditt eksplisitte samtykke · GDPR-sikker</span>
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
                    <div style={{ fontSize: 13, color: '#637774', marginTop: 2, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#637774', marginTop: 10, opacity: 0.7 }}>* Eksempeltall fra pilotperioden</p>
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
                    <div style={{ fontSize: 11, color: '#637774' }}>Sykepleier · Svarer nå</div>
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
                <div style={{ fontSize: 11, color: '#637774', textAlign: 'right' }}>Mottatt · 4 min etter forespørsel</div>
              </div>

              <div style={{ borderTop: '1px solid #cbd8d0', paddingTop: 16 }}>
                <button onClick={onCta} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '10px 14px',
                  background: '#f7f5ef', borderRadius: 8,
                  border: '1px solid #cbd8d0', cursor: 'pointer',
                  textAlign: 'left',
                }}>
                  <span style={{ fontSize: 13, color: '#637774', flex: 1 }}>Skriv til en ekspert...</span>
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
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>Slik fungerer det</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Tre steg. Klar hjelp.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, background: '#d8ef75', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 18, fontWeight: 700, color: '#173d3a' }}>{s.n}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#173d3a', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#637774' }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
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
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>Fra pilotbrukerne</span>
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
                <div style={{ fontSize: 12.5, color: '#637774', marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#9bb8b4', marginTop: 20 }}>* Sitater fra pilotbrukere. Navn og detaljer er anonymisert etter samtykke.</p>
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
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>Fagområder</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>8 fagområder på én plattform</h2>
          <p style={{ fontSize: 16, color: '#637774', marginTop: 12, maxWidth: 480 }}>Pårørendeomsorg krysser mange faggrenser. Naviar samler dem på ett sted.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {EXPERTS.map(ex => (
            <button key={ex.code} onClick={onCta} style={{
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
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#637774', margin: 0 }}>{ex.desc}</p>
            </button>
          ))}
        </div>
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
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>Priser</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Enkel, forutsigbar prising</h2>
          <p style={{ fontSize: 16, color: '#637774', marginTop: 12, lineHeight: 1.6 }}>Start gratis i pilotperioden. Ingen kredittkort nødvendig.</p>
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
                }}>Mest populær</div>
              )}

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.highlight ? '#7db5ad' : '#637774' }}>{p.name}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 10, marginBottom: 4 }}>
                  {p.price === 'Avtale' ? (
                    <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 32, fontWeight: 700, color: p.highlight ? '#fffdf8' : '#173d3a' }}>Avtale</span>
                  ) : (
                    <>
                      <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 36, fontWeight: 700, color: p.highlight ? '#fffdf8' : '#173d3a' }}>kr {p.price}</span>
                      <span style={{ fontSize: 14, color: p.highlight ? '#7db5ad' : '#637774' }}>{p.unit}</span>
                    </>
                  )}
                </div>
                <p style={{ fontSize: 13.5, color: p.highlight ? '#7db5ad' : '#637774', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.highlight ? '#d8ef75' : '#0a7d72'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 14, color: p.highlight ? '#a8c9c5' : '#637774', lineHeight: 1.4 }}>{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={onCta} style={{
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

        <p style={{ fontSize: 12, color: '#9bb8b4', marginTop: 24 }}>
          * Priser er eksempeltall fra pilotperioden og kan endres. Alle priser inkl. mva. Stripe-behandlingsgebyr tilkommer ved kortbetaling.
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
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>For pårørende</span>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 700, color: '#173d3a', marginTop: 10, marginBottom: 28, letterSpacing: '-0.01em' }}>Du skal ikke stå alene<br/>med dette</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {paroerende.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{check}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#637774' }}>{p}</span>
              </li>
            ))}
          </ul>
          <button onClick={onCta} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: '#173d3a', color: '#fffdf8',
            fontSize: 14, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer',
          }}>Start gratis <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
        </div>

        <div style={{ background: '#d9ebe2', padding: '52px 48px' }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>For fagpersoner</span>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 700, color: '#173d3a', marginTop: 10, marginBottom: 28, letterSpacing: '-0.01em' }}>Bruk kompetansen din<br/>der den trengs mest</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {fagperson.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{check}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#637774' }}>{p}</span>
              </li>
            ))}
          </ul>
          <button onClick={onCta} style={{
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
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', color: '#637774', textTransform: 'uppercase' }}>Spørsmål og svar</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, color: '#173d3a', marginTop: 12, letterSpacing: '-0.02em' }}>Det du lurer på</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderTop: i === 0 ? '1px solid #cbd8d0' : 'none' }}>
                <div style={{ borderBottom: '1px solid #cbd8d0' }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '20px 0',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#173d3a', lineHeight: 1.4 }}>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#637774" strokeWidth="1.7" strokeLinecap="round" style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: '#637774', paddingBottom: 20, margin: 0 }}>{faq.a}</p>
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
          Registrer deg i dag og få tilgang til faglig hjelp — når du trenger det, ikke når systemet passer det.
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

            <p style={{ fontSize: 13, color: '#4a7a75', marginTop: 16 }}>Ingen binding · Avbryt når som helst</p>

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
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#3d5553' }}>NAVIAR</div>
                <div style={{ fontSize: 7, fontWeight: 500, letterSpacing: '0.16em', color: '#2e4f4d', textTransform: 'uppercase', marginTop: 1 }}>CARE</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#3d5553', lineHeight: 1.55, margin: 0 }}>Faglig hjelp til pårørende — tilgjengelig nå, uten venteliste.</p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 52, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.08em', color: '#2e4f4d', textTransform: 'uppercase', marginBottom: 12 }}>Tjenesten</div>
              {['Slik fungerer det', 'Fagområder', 'Priser', 'For fagpersoner'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 13.5, color: '#4a7a75', textDecoration: 'none' }}>{l}</a></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.08em', color: '#2e4f4d', textTransform: 'uppercase', marginBottom: 12 }}>Selskapet</div>
              {['Om oss', 'Personvern', 'Vilkår for bruk', 'Kontakt'].map(l => (
                <div key={l} style={{ marginBottom: 8 }}><a href="#" style={{ fontSize: 13.5, color: '#4a7a75', textDecoration: 'none' }}>{l}</a></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1a3d3a', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#2e4f4d', margin: 0 }}>© 2026 NAVIAR CARE AS · Oslo, Norge</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e4f4d" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ fontSize: 12, color: '#2e4f4d' }}>GDPR-konform · Databehandling i EU</span>
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
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    try { return localStorage.getItem('nc_cookie') === '1' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  function handleCookieAccept() {
    try { localStorage.setItem('nc_cookie', '1') } catch {}
    setCookieAccepted(true)
  }

  function openModal() {
    setModalOpen(true)
    setMenuOpen(false)
  }

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} onCta={openModal} />
      <main>
        <Hero onCta={openModal} />
        <HowItWorks />
        <Testimonials />
        <Experts onCta={openModal} />
        <Pricing onCta={openModal} />
        <ForSection onCta={openModal} />
        <FAQ />
        <FinalCTA onCta={openModal} />
      </main>
      <Footer />
      {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
      {!cookieAccepted && <CookieBanner onAccept={handleCookieAccept} />}
    </div>
  )
}
