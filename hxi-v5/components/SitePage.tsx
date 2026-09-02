import Image from 'next/image';
import Link from 'next/link';
import { localeCodes, localeData, siteUrl, type Locale } from '@/content/locales';

interface Props {
  locale: Locale;
}

export function SitePage({ locale }: Props) {
  const d = localeData[locale];
  const n = d.nav;

  return (
    <>
      <a className="skip" href="#main">{d.skip}</a>
      <div className="topline" aria-hidden="true" />

      {/* ── Navigation ── */}
      <header className="nav">
        <Link className="brand" href={`/${locale}/`} aria-label="HXI">
          <b>X</b> HXI
        </Link>

        <nav aria-label="Primary">
          <a href={`/${locale}/#music`}>{n.music}</a>
          <a href={`/${locale}/#catalog`}>{n.catalog}</a>
          <a href={`/${locale}/#about`}>{n.about}</a>
          <a href={`/${locale}/#stems`}>{n.stems}</a>
          <a href={`/${locale}/#contact`}>{n.contact}</a>
        </nav>

        {/* Language picker */}
        <details className="language">
          <summary aria-label="Change language">{locale.toUpperCase()}</summary>
          <div className="langmenu" role="listbox">
            {localeCodes.map((code) => (
              <Link
                key={code}
                href={`/${code}/`}
                aria-current={code === locale ? 'page' : undefined}
              >
                {localeData[code].lang.toUpperCase()}
                <small>{localeData[code].hreflang}</small>
              </Link>
            ))}
          </div>
        </details>

        <a className="nav-cta" href="https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU" rel="noopener noreferrer">
          {n.listen}
        </a>

        {/* Mobile nav */}
        <details className="mobile-nav">
          <summary aria-label="Open menu">MENU</summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            <a href={`/${locale}/#music`}>{n.music}</a>
            <a href={`/${locale}/#catalog`}>{n.catalog}</a>
            <a href={`/${locale}/#about`}>{n.about}</a>
            <a href={`/${locale}/#stems`}>{n.stems}</a>
            <a href={`/${locale}/#contact`}>{n.contact}</a>
          </nav>
        </details>
      </header>

      {/* ── Mobile listen CTA (fixed bar) ── */}
      <a
        className="mobile-listen"
        href="https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU"
        rel="noopener noreferrer"
      >
        {n.listen}
      </a>

      <main id="main">
        {/* ── Hero ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <Image
            className="hero-art"
            src="/assets/hero.jpg"
            alt="HXI — The Same Speed, Colder"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-scrim" aria-hidden="true" />

          <div className="hero-copy">
            <p className="kicker">{d.hero.kicker}</p>
            <h1 id="hero-heading">H<span>X</span>I</h1>
            <p className="hero-line">{d.hero.tagline}</p>
            <p className="hero-desc">{d.hero.desc}</p>
            <div className="actions">
              <a
                className="btn primary"
                href="https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU"
                rel="noopener noreferrer"
              >
                {d.hero.cta}
              </a>
              <a className="btn ghost" href={`/${locale}/#catalog`}>
                {d.hero.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Stats signal box */}
          <aside className="signal" aria-label={d.hero.signalTitle}>
            <p className="signal-title kicker">{d.hero.signalTitle}</p>

            <div className="stat">
              <span aria-hidden="true">01</span>
              <b>43M+</b>
              <small>{d.facts[0].label}</small>
            </div>
            <div className="stat">
              <span aria-hidden="true">02</span>
              <b>30M+</b>
              <small>{d.facts[1].label}</small>
            </div>

            <p className="signal-note">{d.hero.signalNote}</p>
          </aside>
        </section>

        {/* ── Marquee ticker ── */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {d.marqueeItems.map((item, i) => (
              <span key={i}><i>✦</i> {item}</span>
            ))}
          </div>
        </div>

        {/* ── Latest release ── */}
        <section className="section" id="music" aria-labelledby="latest-heading">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.latest.eyebrow}</p>
              <h2 id="latest-heading">{d.latest.heading}</h2>
              <p>{d.latest.desc}</p>
            </div>

            <div className="latest">
              <div className="cover">
                <Image
                  className="cover-image"
                  src="/assets/og-hxi.jpg"
                  alt="HXI — Cold Front cover"
                  fill
                  sizes="(max-width: 900px) 100vw, 38vw"
                />
                <p className="cover-label">{d.latest.meta}</p>
              </div>

              <div className="latest-body">
                <p className="eyebrow">{d.latest.eyebrow}</p>
                <h3>{d.latest.heading}</h3>
                <p className="release-meta">{d.latest.meta}</p>
                <p>{d.latest.desc}</p>

                <div className="player-gate">
                  <p className="micro">{d.latest.playerLabel}</p>
                  <div className="player-slot">
                    <iframe
                      title="Spotify player"
                      src="https://open.spotify.com/embed/artist/3yRqd6IO6SamMAmnXwZKeU?utm_source=generator&theme=0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                  <p className="player-note">{d.latest.playerNote}</p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="facts" role="list">
              {d.facts.map((fact, i) => (
                <div key={i} className="fact" role="listitem">
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="timeline-wrap">
              <div>
                <p className="eyebrow">{d.timeline.eyebrow}</p>
                <h2 className="section-head" style={{ display: 'block', marginBottom: 0 }}>
                  {d.timeline.heading}
                </h2>
              </div>
              <div className="timeline" role="list">
                {d.timeline.rows.map((row, i) => (
                  <div key={i} className="timeline-row" role="listitem">
                    <span>{row.year}</span>
                    <p>{row.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Catalog / Releases ── */}
        <section className="section" id="catalog" aria-labelledby="catalog-heading">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.releases.eyebrow}</p>
              <h2 id="catalog-heading">{d.releases.heading}</h2>
              <p>{d.releases.desc}</p>
            </div>

            <div className="release-grid" role="list">
              {d.releases.items.map((release, i) => (
                <a
                  key={i}
                  className="release-card"
                  href="https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <span className="num">0{i + 1}</span>
                  <span className="card-arrow" aria-hidden="true">→</span>
                  <h3>{release.title}</h3>
                  <small>{release.year} · {release.platform}</small>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof / Placements ── */}
        <section className="section" aria-labelledby="proof-heading">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.proof.eyebrow}</p>
              <h2 id="proof-heading">{d.proof.heading}</h2>
            </div>

            <div className="proof-grid">
              {d.proof.items.map((item, i) => (
                <div key={i} className="proof-card">
                  <span className="tag">{item.tag}</span>
                  <h3>{item.heading}</h3>
                  <p>{item.desc}</p>
                  <a href={item.link} rel="noopener noreferrer">{item.linkLabel}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Nordic / Biography (light section) ── */}
        <section className="section nordic" id="about" aria-labelledby="nordic-heading">
          <div className="section-inner">
            <div className="nordic-grid">
              <div className="nordic-copy">
                <p className="eyebrow">{d.nordic.eyebrow}</p>
                <h2 id="nordic-heading">{d.nordic.heading}</h2>
                <p>{d.nordic.intro}</p>

                <div className="impact-copy">
                  <h3>{d.nordic.impactH}</h3>
                  <p>{d.nordic.impactP}</p>
                </div>

                <div className="identity-copy">
                  <p className="eyebrow">{d.nordic.identityEyebrow}</p>
                  <h3>{d.nordic.identityH}</h3>
                  <p>{d.nordic.identityP}</p>
                </div>
              </div>

              <div className="coordinate" aria-label={d.nordic.coord.label}>
                <p className="micro">{d.nordic.coord.label}</p>
                <strong>{d.nordic.coord.value}</strong>
                <div className="coordinate-footer">
                  <span>{d.nordic.coord.lat}</span>
                  <span>{d.nordic.coord.lon}</span>
                  <span>{d.nordic.coord.alt}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Platforms / Creators ── */}
        <section className="section" aria-labelledby="platforms-heading">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.creators.eyebrow}</p>
              <h2 id="platforms-heading">{d.creators.heading}</h2>
            </div>

            <div className="creator-grid">
              <div className="creator-list" role="list">
                {d.creators.items.map((item, i) => (
                  <a
                    key={i}
                    className="creator-link"
                    href={item.url}
                    rel="noopener noreferrer"
                    role="listitem"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </div>
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
              <div>
                <p className="creator-note">{d.creators.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Work / Use Cases ── */}
        <section className="section work-section" aria-labelledby="work-heading">
          <div className="section-inner">
            <div className="section-head">
              <p className="eyebrow">{d.work.eyebrow}</p>
              <h2 id="work-heading">{d.work.heading}</h2>
            </div>

            <div className="work-grid">
              {d.work.items.map((item, i) => (
                <div key={i} className="work-card">
                  <span>{item.tag}</span>
                  <h3>{item.heading}</h3>
                  <p>{item.desc}</p>
                  <a href={item.link} rel="noopener noreferrer">{item.linkLabel}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Frequency / Stems ── */}
        <section className="section frequency" id="stems" aria-labelledby="stems-heading">
          <div className="section-inner">
            <div className="frequency-grid">
              <div>
                <p className="eyebrow">{d.frequency.eyebrow}</p>
                <h2 id="stems-heading">{d.frequency.heading}</h2>
                <p className="frequency-intro">{d.frequency.intro}</p>

                <div className="gated-note">
                  <span aria-hidden="true" />
                  <p>{d.frequency.gatedNote}</p>
                </div>
              </div>

              <div className="align-end">
                <div className="actions">
                  <a className="btn primary" href="mailto:booking@hxi.no">
                    {d.frequency.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="section contact" id="contact" aria-labelledby="contact-heading">
          <div className="section-inner">
            <div className="contact-grid">
              <div>
                <p className="eyebrow">{d.contact.eyebrow}</p>
                <h2 id="contact-heading">{d.contact.heading}</h2>
              </div>
              <div>
                <p className="contact-copy">{d.contact.copy}</p>
                <div className="actions mt34">
                  <a className="btn primary" href="mailto:booking@hxi.no">
                    {d.contact.cta}
                  </a>
                  <a
                    className="btn ghost"
                    href="https://www.instagram.com/prod.hxi/"
                    rel="noopener noreferrer"
                  >
                    {d.contact.ctaSecondary}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div>
          <p>{d.footer.copy}</p>
          <p className="privacy-strip">{d.footer.privacyStrip}</p>
        </div>
        <div className="mark" aria-hidden="true"><b>X</b></div>
        <div>
          <Link href={`/${locale}/privacy/`}>{d.footer.privacyLink}</Link>
          {' · '}
          <a href={`${siteUrl}/sitemap.xml`}>Sitemap</a>
        </div>
      </footer>
    </>
  );
}
