'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/content/locales';
import { localeCodes, localeData } from '@/content/locales';

const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU';
const INSTAGRAM = 'https://www.instagram.com/prod.hxi/';
const YOUTUBE = 'https://www.youtube.com/@hximusic';
const NCS_ARTIST = 'https://ncs.io/artist/1169/hxi';
const BREAKTHROUGH_TRACK = 'https://open.spotify.com/track/54ggxbEopZwQ20zurJiHSD';
const SPOTIFY_EMBED_ID = '54ggxbEopZwQ20zurJiHSD';
const PROOF_LINKS = [
  'https://open.spotify.com/track/1gJVcN44jO425kU8Wt8oqH',
  'https://open.spotify.com/album/5QlIkL0n8DCBq785usYFrM',
  'https://ncs.io/LockNLoad',
  'https://ncs.io/roundaround',
];
const MARQUEE_ITEMS = [
  'HELP URSELF · 43M+*',
  'FAST & FURIOUS / REMIX',
  'BODYCAM / SOUNDTRACK',
  "NCS · LOCK N' LOAD",
  'NCS · ROUND AROUND',
  'OSLO · NORWAY',
];
const NAV_IDS = ['music', 'credits', 'nordic', 'creators', 'work', 'social', 'contact'];
const EMAIL = 'booking@hxi.no';
const SOCIALS = [
  { platform: 'Spotify', handle: 'HXI', href: SPOTIFY_ARTIST },
  { platform: 'Instagram', handle: '@prod.hxi', href: INSTAGRAM },
  { platform: 'YouTube', handle: '@hximusic', href: YOUTUBE },
  { platform: 'NCS', handle: 'ncs.io/hxi', href: NCS_ARTIST },
];

function Ext({
  href, children, className,
}: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export function SitePage({ locale }: { locale: Locale }) {
  const d = localeData[locale];
  const [playerLoaded, setPlayerLoaded] = useState(false);

  return (
    <>
      <a className="skip" href="#main">{d.skip}</a>
      <div className="topline" aria-hidden="true" />

      {/* ─── NAV ─── */}
      <header className="nav">
        <Link className="brand" href={`/${locale}/`} aria-label="HXI home">
          <b>X</b> HXI
        </Link>
        <nav aria-label={`Site navigation — ${d.localeName}`}>
          {NAV_IDS.map((id, i) => (
            <a key={id} href={`#${id}`}>{d.nav[i]}</a>
          ))}
        </nav>
        <Ext href={SPOTIFY_ARTIST} className="nav-cta">{d.listen}</Ext>
        <details className="language">
          <summary>{d.languageSummary ?? `Language · ${d.localeName} ▾`}</summary>
          <div className="langmenu">
            {localeCodes.map((code) => {
              const ld = localeData[code];
              return (
                <Link key={code} href={`/${code}/`} lang={ld.lang} hrefLang={ld.hreflang}
                  className={code === locale ? 'active' : undefined}
                  onClick={() => { try { localStorage.setItem('hxi-lang', code); } catch { /* kapalı olabilir */ } }}>
                  {ld.localeName}
                </Link>
              );
            })}
          </div>
        </details>
        <details className="mobile-nav">
          <summary aria-label="Menu">Menu</summary>
          <div className="mobile-nav-panel">
            {NAV_IDS.map((id, i) => (
              <a key={id} href={`#${id}`}>{d.nav[i]}</a>
            ))}
          </div>
        </details>
      </header>

      <Ext href={SPOTIFY_ARTIST} className="mobile-listen">{d.listen}</Ext>

      <main id="main">
        {/* ─── HERO ─── */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-art" src="/assets/hero.webp" alt="" aria-hidden="true" />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-copy">
            <p className="kicker">{d.hero.kicker}</p>
            <h1 id="hero-title">H<span>X</span>I</h1>
            <p className="hero-line">
              {d.hero.line.includes(' — ') ? (
                <>
                  {d.hero.line.split(' — ')[0]} — <span>{d.hero.line.split(' — ')[1]}</span>
                </>
              ) : d.hero.line}
            </p>
            <p className="hero-desc">{d.hero.desc}</p>
            <div className="actions">
              <Ext href={SPOTIFY_ARTIST} className="btn primary">{d.hero.actions[0]}</Ext>
              <a className="btn ghost" href="#music">{d.hero.actions[1]}</a>
            </div>
          </div>
          <aside className="signal" aria-label={d.hero.signalTitle}>
            <p className="signal-title micro">{d.hero.signalTitle}</p>
            {d.hero.stats.map((stat, i) => (
              <div className="stat" key={i}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <b>{stat.value}</b>
                <small>{stat.label}</small>
              </div>
            ))}
            <p className="signal-note">{d.hero.note}</p>
          </aside>
        </section>

        {/* ─── MARQUEE ─── */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i}>{item}<i> × </i></span>
            ))}
          </div>
        </div>

        {/* ─── MUSIC ─── */}
        <section className="section music-section" id="music" aria-labelledby="music-title">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.music.eyebrow}</p>
              <h2 id="music-title">{d.music.title}</h2>
              <p>{d.music.intro}</p>
            </div>

            <article className="latest">
              <div className="cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cover-image" src="/assets/mark.webp" alt="" aria-hidden="true" />
                <span className="cover-label">{d.music.latestLabel}</span>
              </div>
              <div className="latest-body">
                <p className="eyebrow">{d.music.breakthroughLabel}</p>
                <p className="release-meta">2022</p>
                <h3>help<br />urself</h3>
                <p>{d.music.breakthroughDesc}</p>
                <div className="actions">
                  <Ext href={BREAKTHROUGH_TRACK} className="btn primary">{d.music.listen}</Ext>
                  <Ext href={SPOTIFY_ARTIST} className="btn ghost">{d.music.fullCatalog}</Ext>
                </div>
                {!playerLoaded ? (
                  <div className="player-gate">
                    <p className="eyebrow">SPOTIFY</p>
                    <button type="button" className="btn ghost" onClick={() => setPlayerLoaded(true)}>
                      {d.music.loadPlayer}
                    </button>
                    <p className="player-note">{d.music.playerNote}</p>
                  </div>
                ) : (
                  <div className="player-slot" aria-live="polite">
                    <iframe
                      title="Spotify — help urself by HXI"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      src={`https://open.spotify.com/embed/track/${SPOTIFY_EMBED_ID}?utm_source=generator`}
                    />
                  </div>
                )}
              </div>
            </article>

            {/* Facts */}
            <div className="facts" aria-label={d.hero.signalTitle}>
              {d.hero.stats.map((stat, i) => (
                <div className="fact" key={i}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
              <div className="fact">
                <strong>OSLO</strong>
                <span>{d.nordic.footer[0]}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-wrap">
              <p className="eyebrow">{d.timeline.label}</p>
              <div className="timeline" aria-label={d.timeline.label}>
                {d.timeline.entries.map((entry) => (
                  <div className="timeline-row" key={entry.year}>
                    <span>{entry.year}</span>
                    <p>{entry.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Release catalog */}
            <p className="eyebrow mt52">{d.music.selectedWorks}</p>
            <div className="release-grid">
              {d.releases.map((release, i) => (
                <Ext href={release.href} className="release-card" key={i}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{release.name}</h3>
                  <small>{release.yearLabel}</small>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </Ext>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CREDITS ─── */}
        <section className="section credits-section" id="credits" aria-labelledby="credits-title">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.credits.eyebrow}</p>
              <h2 id="credits-title">{d.credits.title}</h2>
              <p>{d.credits.intro}</p>
            </div>
            <div className="proof-grid">
              {d.credits.proofs.map((proof, i) => (
                <article className="proof-card" key={i}>
                  <span className="tag">{proof.tag}</span>
                  <h3>{proof.title}</h3>
                  <p>{proof.body}</p>
                  <Ext href={PROOF_LINKS[i]}>{proof.cta}</Ext>
                </article>
              ))}
            </div>
            <div className="actions mt24 proof-actions">
              <Ext href={NCS_ARTIST} className="btn ghost">{d.credits.ncsCta}</Ext>
              <Ext href={YOUTUBE} className="btn ghost">YouTube ↗</Ext>
              <Ext href={INSTAGRAM} className="btn ghost">Instagram ↗</Ext>
            </div>
          </div>
        </section>

        {/* ─── NORDIC ─── */}
        <section className="section nordic" id="nordic" aria-labelledby="nordic-title">
          <div className="section-inner nordic-grid">
            <div className="nordic-copy">
              <p className="eyebrow">{d.nordic.eyebrow}</p>
              <h2 id="nordic-title">{d.nordic.title}</h2>
              <p>{d.nordic.body}</p>
              <div className="impact-copy">
                <h3>{d.impact.title}</h3>
                <p>{d.impact.body}</p>
              </div>
              <div className="identity-copy">
                <p className="eyebrow">{d.about.eyebrow}</p>
                <h3>{d.about.title}</h3>
                <p>{d.about.body}</p>
              </div>
            </div>
            <div className="coordinate">
              <span className="micro"><bdi>{d.nordic.issue}</bdi></span>
              <strong><bdi>{d.nordic.coord}</bdi></strong>
              <div className="coordinate-footer">
                {d.nordic.footer.map((item, i) => (
                  <span key={i}><bdi>{item}</bdi></span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CREATORS ─── */}
        <section className="section creators-section" id="creators" aria-labelledby="creators-title">
          <div className="section-inner creator-grid">
            <div>
              <p className="eyebrow">{d.creators.eyebrow}</p>
              <h2 id="creators-title">{d.creators.title}</h2>
              <p className="hero-desc mt20">{d.creators.body}</p>
              <p className="creator-note">{d.creators.clear}</p>
            </div>
            <div className="creator-list">
              <Ext href="https://ncs.io/LockNLoad" className="creator-link">
                <strong>Lock n&apos; Load — NCS</strong>
                <span>{d.creators.checkTerms}</span>
              </Ext>
              <Ext href="https://ncs.io/roundaround" className="creator-link">
                <strong>Round Around — NCS</strong>
                <span>{d.creators.checkTerms}</span>
              </Ext>
            </div>
          </div>
        </section>

        {/* ─── WORK ─── */}
        <section className="section work-section" id="work" aria-labelledby="work-title">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.work.eyebrow}</p>
              <h2 id="work-title">{d.work.title}</h2>
              <p>{d.work.intro}</p>
            </div>
            <div className="work-grid">
              {d.work.cards.map((card) => (
                <article className="work-card" key={card.label}>
                  <span>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <Ext href={INSTAGRAM}>{card.cta}</Ext>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SOCIAL & PODCAST ─── */}
        <section className="section social-section" id="social" aria-labelledby="social-title">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.social.eyebrow}</p>
              <h2 id="social-title">{d.social.title}</h2>
              <p>{d.social.intro}</p>
            </div>
            <div className="social-grid">
              {SOCIALS.map((s) => (
                <Ext href={s.href} className="social-card" key={s.platform}>
                  <span className="platform">{s.platform}</span>
                  <span className="handle">{s.handle}</span>
                  <span className="social-arrow" aria-hidden="true">↗</span>
                </Ext>
              ))}
            </div>
            <div className="podcast-box">
              <div>
                <p className="eyebrow">Podcast</p>
                <h3>HXI FREQUENCY</h3>
                <p>{d.social.podcastDesc}</p>
              </div>
              <a className="btn" href={`mailto:${EMAIL}?subject=Podcast`}>{d.social.podcastCta}</a>
            </div>
          </div>
        </section>

        {/* ─── FREQUENCY ─── */}
        <section className="section frequency" id="frequency" aria-labelledby="frequency-title">
          <div className="section-inner frequency-grid">
            <div>
              <p className="eyebrow">{d.frequency.eyebrow}</p>
              <h2 id="frequency-title">
                {d.frequency.title.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
            </div>
            <div>
              <p className="frequency-intro">{d.frequency.intro}</p>
              {/* Bülten altyapısı kurulana dek gerçek "ilk erişim" kanalı Spotify takibi */}
              <div className="actions">
                <Ext href={SPOTIFY_ARTIST} className="btn primary">{d.listen}</Ext>
                <Ext href={YOUTUBE} className="btn">YouTube ↗</Ext>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <div className="section-inner contact-grid">
            <div>
              <p className="eyebrow">{d.contact.eyebrow}</p>
              <h2 id="contact-title">{d.contact.title}</h2>
            </div>
            <div className="align-end">
              <p className="contact-copy">{d.contact.body}</p>
              <div className="actions">
                <Ext href={INSTAGRAM} className="btn primary">{d.contact.actions[0]}</Ext>
                <Ext href={YOUTUBE} className="btn">{d.contact.actions[1]}</Ext>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div>
          {d.footer.identity}
          <div className="privacy-strip">{d.footer.privacyStrip}</div>
        </div>
        <div className="mark">X</div>
        <div>
          <Ext href={SPOTIFY_ARTIST}>Spotify</Ext>
          {' · '}
          <Ext href={INSTAGRAM}>Instagram</Ext>
          {' · '}
          <Ext href={NCS_ARTIST}>NCS</Ext>
          {' · '}
          <Link href={`/${locale}/privacy/`}>{d.footer.privacyLabel}</Link>
        </div>
      </footer>
    </>
  );
}
