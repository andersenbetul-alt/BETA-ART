import { useState, useEffect } from 'react'
import './index.css'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function NaviarLogo({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  const arc   = dark ? '#d8ef75' : '#173d3a'
  const dot   = dark ? '#fffdf8' : '#d8ef75'
  const name  = dark ? '#fffdf8' : '#173d3a'
  const sub   = dark ? '#d8ef75' : '#637774'
  const gap   = size <= 24 ? 7 : 9

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <path d="M 29.19 10.81 A 13 13 0 1 0 10.81 10.81"
              stroke={arc} strokeWidth="3.6" strokeLinecap="round"/>
        <circle cx="29.19" cy="10.81" r="4.2" fill={dot}/>
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: size <= 24 ? 13 : 15,
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: name,
        }}>NAVIAR</div>
        <div style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: size <= 24 ? 7 : 8,
          fontWeight: 500,
          letterSpacing: '0.16em',
          color: sub,
          textTransform: 'uppercase',
          marginTop: 1,
        }}>CARE</div>
      </div>
    </div>
  )
}

// ─── Expert data ─────────────────────────────────────────────────────────────

const EXPERTS = [
  { code: 'SYK', label: 'Sykepleier',      desc: 'Klinisk vurdering, medisinering og omsorg i hjemmet.' },
  { code: 'SOS', label: 'Sosionom',        desc: 'Rettigheter, trygdeytelser og kommunale tjenester.' },
  { code: 'ERG', label: 'Ergoterapeut',    desc: 'Tilpasning av bolig og daglige aktiviteter.' },
  { code: 'PSY', label: 'Psykolog',        desc: 'Sorg, stress og psykisk helse for pårørende.' },
  { code: 'JUR', label: 'Jurist',          desc: 'Fullmakt, testamente og pasientrettigheter.' },
  { code: 'ØKO', label: 'Økonom',          desc: 'Pleiepengeberegning, arv og økonomi.' },
  { code: 'TEK', label: 'Velferdsteknolog', desc: 'Digitale hjelpemidler, GPS og trygghetsteknologi.' },
  { code: 'ERN', label: 'Ernæringsfysiolog', desc: 'Kosthold, matlyst og ernæringsplan.' },
]

const STEPS = [
  {
    n: '1',
    title: 'Beskriv situasjonen',
    body: 'Fortell kort hva du trenger hjelp med. Ingen journaler, ingen skjemaer — bare skriv som til et medmenneske.',
  },
  {
    n: '2',
    title: 'Match med riktig ekspert',
    body: 'Vi kobler deg til en fagperson med erfaring fra nettopp din situasjon — innen én time på dagtid.',
  },
  {
    n: '3',
    title: 'Få klar, handlingsrettet hjelp',
    body: 'Eksperten svarer direkte, konkret og uten viderehenvisning. Du sitter igjen med neste steg — ikke nye spørsmål.',
  },
]

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#fffdf8',
      borderBottom: '1px solid #cbd8d0',
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NaviarLogo size={30} />

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {[
            { label: 'Slik fungerer det', id: 'how' },
            { label: 'Eksperter',         id: 'experts' },
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
          <a href="#" style={{ fontSize: 14, fontWeight: 500, color: '#637774', textDecoration: 'none' }}>Logg inn</a>
          <a href="#cta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 20px',
            background: '#d8ef75', color: '#173d3a',
            fontSize: 14, fontWeight: 700,
            borderRadius: 6, textDecoration: 'none',
          }}>Kom i gang →</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, color: '#173d3a',
          }}
        >
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
        <div style={{
          background: '#fffdf8', borderTop: '1px solid #cbd8d0',
          padding: '20px 24px 28px',
        }}>
          {[
            { label: 'Slik fungerer det', id: 'how' },
            { label: 'Eksperter',         id: 'experts' },
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
          <a href="#cta" onClick={() => setMenuOpen(false)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 20, padding: '14px',
            background: '#d8ef75', color: '#173d3a',
            fontSize: 15, fontWeight: 700,
            borderRadius: 6, textDecoration: 'none',
          }}>Kom i gang →</a>
        </div>
      )}
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ background: '#f7f5ef', padding: '80px 24px 72px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Badge */}
        <div style={{ marginBottom: 32 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px 5px 10px',
            background: '#d9ebe2', borderRadius: 100,
          }}>
            <span style={{ width: 6, height: 6, background: '#0a7d72', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 11, letterSpacing: '0.1em',
              color: '#173d3a', textTransform: 'uppercase',
            }}>Pilotprogram — aktiv nå</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Left: text */}
          <div style={{ flex: '1 1 480px', maxWidth: 620 }}>
            <h1 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.08,
              color: '#173d3a',
              marginBottom: 24,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}>
              Faglig hjelp<br/>til pårørende —<br/>tilgjengelig nå
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.65,
              color: '#637774', maxWidth: 480, marginBottom: 40,
            }}>
              Koble deg til erfarne rådgivere innen helse, jus og økonomi.
              Svar innen én time — uten venteliste, uten viderehenvisning.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <a href="#cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                background: '#173d3a', color: '#fffdf8',
                fontSize: 15, fontWeight: 600,
                borderRadius: 6, textDecoration: 'none',
              }}>
                Start gratis — ingen binding
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#how" style={{
                fontSize: 15, fontWeight: 500,
                color: '#173d3a', opacity: 0.65,
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}>Se demo</a>
            </div>

            {/* Trust stats */}
            <div style={{
              display: 'flex', alignItems: 'stretch',
              marginTop: 52, paddingTop: 40,
              borderTop: '1px solid #cbd8d0',
            }}>
              {[
                { val: '89%', label: 'fikk svar\ninnen 60 min' },
                { val: '8',   label: 'fagområder\npå plattformen' },
                { val: '4.8', label: 'snittkarakter\nfra brukerne' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                  {i > 0 && <div style={{ width: 1, background: '#cbd8d0', margin: '0 24px', flexShrink: 0 }} />}
                  <div style={{ paddingRight: i < 2 ? 0 : 0 }}>
                    <div style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: 30, fontWeight: 700, color: '#173d3a',
                    }}>{s.val}</div>
                    <div style={{
                      fontSize: 13, color: '#637774',
                      marginTop: 2, lineHeight: 1.4,
                      whiteSpace: 'pre-line',
                    }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#637774', marginTop: 10, opacity: 0.7 }}>
              * Eksempeltall fra pilotperioden
            </p>
          </div>

          {/* Right: visual card */}
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{
              background: '#fffdf8',
              border: '1px solid #cbd8d0',
              borderRadius: 12,
              padding: 28,
              boxShadow: '0 4px 24px rgba(23,61,58,0.06)',
            }}>
              {/* Chat preview */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#d9ebe2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a7d72" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#173d3a' }}>Anita Johansen</div>
                    <div style={{ fontSize: 11, color: '#637774' }}>Sykepleier · Svarer nå</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 8px',
                      background: '#d9ebe2', borderRadius: 100,
                    }}>
                      <span style={{ width: 5, height: 5, background: '#0a7d72', borderRadius: '50%' }} />
                      <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: '#173d3a' }}>SYK</span>
                    </span>
                  </div>
                </div>

                <div style={{
                  background: '#173d3a', color: '#fffdf8',
                  borderRadius: '12px 12px 2px 12px',
                  padding: '10px 14px',
                  fontSize: 13.5, lineHeight: 1.55,
                  marginBottom: 10,
                }}>
                  Basert på det du beskriver ser det ut til at mamma har klassiske tegn på UTI. Her er tre konkrete tiltak du kan gjøre akkurat nå...
                </div>

                <div style={{ fontSize: 11, color: '#637774', textAlign: 'right' }}>
                  Mottatt · 4 min etter forespørsel
                </div>
              </div>

              <div style={{ borderTop: '1px solid #cbd8d0', paddingTop: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px',
                  background: '#f7f5ef', borderRadius: 8,
                  border: '1px solid #cbd8d0',
                }}>
                  <span style={{ fontSize: 13, color: '#637774', flex: 1 }}>Skriv til en ekspert...</span>
                  <div style={{
                    width: 30, height: 30,
                    background: '#d8ef75', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#173d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
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
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 11, letterSpacing: '0.1em',
            color: '#637774', textTransform: 'uppercase',
          }}>Slik fungerer det</span>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 700, color: '#173d3a',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>Tre steg. Klar hjelp.</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
        }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: 20, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 44, height: 44, flexShrink: 0,
                background: '#d8ef75', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 18, fontWeight: 700, color: '#173d3a',
                }}>{s.n}</span>
              </div>
              <div>
                <h3 style={{
                  fontSize: 17, fontWeight: 700,
                  color: '#173d3a', marginBottom: 8,
                }}>{s.title}</h3>
                <p style={{
                  fontSize: 15, lineHeight: 1.65,
                  color: '#637774',
                }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Experts ─────────────────────────────────────────────────────────────────

function Experts() {
  return (
    <section id="experts" style={{ background: '#f7f5ef', padding: '80px 24px', scrollMarginTop: 68 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 11, letterSpacing: '0.1em',
            color: '#637774', textTransform: 'uppercase',
          }}>Fagområder</span>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 700, color: '#173d3a',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>8 fagområder på én plattform</h2>
          <p style={{
            fontSize: 16, color: '#637774', marginTop: 12, maxWidth: 480,
          }}>
            Pårørendeomsorg krysser mange faggrenser. Naviar samler dem på ett sted.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {EXPERTS.map(ex => (
            <div key={ex.code} style={{
              background: '#fffdf8',
              border: '1px solid #cbd8d0',
              borderRadius: 10,
              padding: '20px 22px',
              cursor: 'pointer',
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
                <span style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 10, letterSpacing: '0.06em',
                  padding: '2px 7px',
                  background: '#d9ebe2', color: '#173d3a', borderRadius: 4,
                }}>{ex.code}</span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#637774' }}>{ex.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── For / For ───────────────────────────────────────────────────────────────

function ForSection() {
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 2,
        border: '1px solid #cbd8d0', borderRadius: 12, overflow: 'hidden',
      }}>

        {/* Pårørende */}
        <div style={{ background: '#f7f5ef', padding: '52px 48px' }}>
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 10, letterSpacing: '0.1em',
            color: '#637774', textTransform: 'uppercase',
          }}>For pårørende</span>
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(22px, 2.5vw, 30px)',
            fontWeight: 700, color: '#173d3a',
            marginTop: 10, marginBottom: 28,
            letterSpacing: '-0.01em',
          }}>Du skal ikke stå alene<br/>med dette</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {paroerende.map((p, i) => (
              <li key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                marginBottom: 14,
              }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{check}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#637774' }}>{p}</span>
              </li>
            ))}
          </ul>
          <a href="#cta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: '#173d3a', color: '#fffdf8',
            fontSize: 14, fontWeight: 600,
            borderRadius: 6, textDecoration: 'none',
          }}>
            Start gratis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Fagperson */}
        <div style={{ background: '#d9ebe2', padding: '52px 48px' }}>
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 10, letterSpacing: '0.1em',
            color: '#637774', textTransform: 'uppercase',
          }}>For fagpersoner</span>
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(22px, 2.5vw, 30px)',
            fontWeight: 700, color: '#173d3a',
            marginTop: 10, marginBottom: 28,
            letterSpacing: '-0.01em',
          }}>Bruk kompetansen din<br/>der den trengs mest</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px' }}>
            {fagperson.map((p, i) => (
              <li key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                marginBottom: 14,
              }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{check}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#637774' }}>{p}</span>
              </li>
            ))}
          </ul>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: '#fffdf8', color: '#173d3a',
            fontSize: 14, fontWeight: 600,
            borderRadius: 6, textDecoration: 'none',
            border: '1px solid #cbd8d0',
          }}>
            Søk som fagperson
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section id="cta" style={{ background: '#173d3a', padding: '96px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Logo dark variant */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <NaviarLogo size={32} dark />
        </div>

        <h2 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 700, color: '#fffdf8',
          marginBottom: 20,
          letterSpacing: '-0.02em',
          textWrap: 'balance',
        }}>Ikke la usikkerheten<br/>vente til i morgen</h2>

        <p style={{
          fontSize: 18, color: '#7db5ad',
          maxWidth: 400, margin: '0 auto 44px',
          lineHeight: 1.6,
        }}>
          Registrer deg i dag og få tilgang til faglig hjelp — når du trenger det, ikke når systemet passer det.
        </p>

        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '16px 36px',
          background: '#d8ef75', color: '#173d3a',
          fontSize: 16, fontWeight: 700,
          borderRadius: 6, textDecoration: 'none',
        }}>
          Start gratis prøveperiode
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#173d3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>

        <p style={{ fontSize: 13, color: '#4a7a75', marginTop: 16 }}>
          Ingen binding · Avbryt når som helst · Trygg betaling
        </p>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: '#0f2a28', padding: '40px 24px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        {/* Logo subdued */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden>
            <path d="M 29.19 10.81 A 13 13 0 1 0 10.81 10.81"
                  stroke="#637774" strokeWidth="3.6" strokeLinecap="round"/>
            <circle cx="29.19" cy="10.81" r="4.2" fill="#637774"/>
          </svg>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', color: '#3d5553' }}>NAVIAR</div>
            <div style={{ fontSize: 7, fontWeight: 500, letterSpacing: '0.16em', color: '#2e4f4d', textTransform: 'uppercase', marginTop: 1 }}>CARE</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {['Om oss', 'Personvern', 'Vilkår', 'Kontakt'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: '#4a7a75', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>

        <p style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 11, color: '#2e4f4d', margin: 0,
        }}>© 2026 NAVIAR CARE · Oslo, Norge</p>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Smooth scroll for hash links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <HowItWorks />
        <Experts />
        <ForSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
