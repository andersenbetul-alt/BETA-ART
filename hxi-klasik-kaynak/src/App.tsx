import { useState, useEffect, useRef } from 'react';
import { LANGS, LANG_NAMES, makeT, type Lang } from './i18n';

const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU';
const SPOTIFY_EMBED_TRACK = '54ggxbEopZwQ20zurJiHSD';
const INSTAGRAM = 'https://www.instagram.com/prod.hxi/';
const YOUTUBE = 'https://www.youtube.com/@hximusic';
const NCS_ARTIST = 'https://ncs.io/artist/1169/hxi';
const EMAIL = 'booking@hximusic.com';

function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const animate = (ts: number) => {
      if (!start.current) start.current = ts;
      const pct = Math.min((ts - start.current) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setCount(Math.round(ease * target));
      if (pct < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target]);
  return count;
}

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function AnimCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const { ref, visible } = useReveal();
  const count = useCounter(target, visible);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{count.toLocaleString()}{suffix}</span>;
}

function Ext({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

const MARQUEE = [
  'HELP URSELF · 43M+', 'FAST & FURIOUS / REMIX', 'BODYCAM / SOUNDTRACK',
  "NCS · LOCK N' LOAD", 'NCS · ROUND AROUND', 'OSLO · NORWAY',
  'MONTAGEM HYSTERIA EP', 'NCS 2024', '310BABII COLLAB',
];

const RELEASES = [
  { name: 'help urself', year: '2022', href: 'https://open.spotify.com/track/54ggxbEopZwQ20zurJiHSD' },
  { name: 'X-Pirata', year: '2023', href: SPOTIFY_ARTIST },
  { name: "Lock n' Load", year: '2024', href: 'https://ncs.io/LockNLoad' },
  { name: 'Round Around', year: '2024', href: 'https://ncs.io/roundaround' },
  { name: 'BODYCAM OST', year: '2024', href: SPOTIFY_ARTIST },
  { name: 'Montagem Hysteria', year: '2026', href: SPOTIFY_ARTIST },
];

const SOCIALS = [
  { platform: 'Spotify', handle: 'HXI', href: SPOTIFY_ARTIST },
  { platform: 'Instagram', handle: '@prod.hxi', href: INSTAGRAM },
  { platform: 'YouTube', handle: '@hximusic', href: YOUTUBE },
  { platform: 'NCS', handle: 'ncs.io/hxi', href: NCS_ARTIST },
];

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('hxi-lang');
    if (saved && (LANGS as readonly string[]).includes(saved)) return saved as Lang;
  } catch { /* localStorage kapalı olabilir */ }
  const nav = (navigator.language || 'tr').slice(0, 2).toLowerCase();
  return (LANGS as readonly string[]).includes(nav) ? (nav as Lang) : 'tr';
}

export default function App() {
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = makeT(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('hxi-lang', lang); } catch { /* yoksay */ }
  }, [lang]);

  const scrolled = useRef(false);
  useEffect(() => {
    const onScroll = () => { scrolled.current = window.scrollY > 40; };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const TIMELINE = [
    { year: '2021', event: t('tl2021') },
    { year: '2022', event: t('tl2022') },
    { year: '2023', event: t('tl2023') },
    { year: '2024', event: t('tl2024a') },
    { year: '2024', event: t('tl2024b') },
    { year: '2025', event: t('tl2025') },
    { year: '2026', event: t('tl2026') },
  ];

  return (
    <>
      {/* Topline */}
      <div className="topline" />

      {/* Nav */}
      <header className="nav">
        <a className="brand" href="#top" aria-label="HXI home"><span>X</span> HXI</a>
        <nav aria-label="Main">
          <ul className="nav-links">
            <li><a href="#music">{t('navMusic')}</a></li>
            <li><a href="#credits">{t('navCredits')}</a></li>
            <li><a href="#nordic">{t('navAbout')}</a></li>
            <li><a href="#social">{t('navSocial')}</a></li>
            <li><a href="#contact">{t('navContact')}</a></li>
          </ul>
        </nav>
        <select
          className="lang-select"
          aria-label="Language"
          value={lang}
          onChange={e => setLang(e.target.value as Lang)}
        >
          {LANGS.map(code => (
            <option key={code} value={code}>{code.toUpperCase()} · {LANG_NAMES[code]}</option>
          ))}
        </select>
        <Ext href={SPOTIFY_ARTIST} className="nav-cta">{t('listen')}</Ext>
      </header>

      <main id="top">
        {/* ─── HERO ─── */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-scrim" aria-hidden="true" />

          <div className="hero-copy">
            <p className="kicker">Oslo · Norway · Nordic Phonk</p>
            <h1 id="hero-title">H<span>X</span>I</h1>
            <p className="hero-line">THE SAME SPEED, <span>COLDER</span></p>
            <p className="hero-desc">{t('heroDesc')}</p>
            <div className="actions">
              <Ext href={SPOTIFY_ARTIST} className="btn primary">{t('listen')}</Ext>
              <a className="btn ghost" href="#music">{t('navMusic')}</a>
              <a className="btn ghost" href="#social">{t('btnSocial')}</a>
            </div>
          </div>

          <aside className="signal" aria-label={t('signalTitle')}>
            <p className="signal-title">{t('signalTitle')}</p>
            <div className="stat">
              <span className="stat-idx">01</span>
              <b className="stat-val">43M<span style={{ color: 'var(--acid)' }}>+</span></b>
              <small className="stat-lbl">help urself streams</small>
            </div>
            <div className="stat">
              <span className="stat-idx">02</span>
              <b className="stat-val">30M<span style={{ color: 'var(--acid)' }}>+</span></b>
              <small className="stat-lbl">{t('totalStreams')}</small>
            </div>
            <div className="stat">
              <span className="stat-idx">03</span>
              <b className="stat-val">50M<span style={{ color: 'var(--acid)' }}>+</span></b>
              <small className="stat-lbl">{t('ncsAudience')}</small>
            </div>
            <p className="signal-note">{t('signalNote')}</p>
          </aside>
        </section>

        {/* ─── MARQUEE ─── */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i}><i>✦</i> {item}</span>
            ))}
          </div>
        </div>

        {/* ─── MUSIC ─── */}
        <section className="section" id="music" aria-labelledby="music-title">
          <p className="eyebrow">{t('musicEyebrow')}</p>
          <h2 className="section-title" id="music-title">{t('musicTitleA')} <em>&</em><br />{t('musicTitleB')}</h2>

          <article className="latest">
            <div className="cover">
              <div className="cover-art">
                <span className="cover-art-inner">HU</span>
              </div>
              <p className="cover-label">2022 · Spotify</p>
            </div>

            <div className="latest-body">
              <p className="eyebrow">{t('breakthrough')}</p>
              <p className="release-meta">2022</p>
              <h3>help<br />urself</h3>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
                {t('huDesc')}
              </p>
              <div className="actions" style={{ marginBottom: 20 }}>
                <Ext href="https://open.spotify.com/track/54ggxbEopZwQ20zurJiHSD" className="btn primary">
                  {t('listen')}
                </Ext>
                <Ext href={SPOTIFY_ARTIST} className="btn ghost">{t('fullCatalog')}</Ext>
              </div>

              {!playerLoaded ? (
                <div className="player-gate">
                  <p className="eyebrow" style={{ marginBottom: 8 }}>Spotify Player</p>
                  <button className="btn ghost" type="button" onClick={() => setPlayerLoaded(true)}>
                    {t('playerLoad')}
                  </button>
                  <p className="player-note">{t('playerNote')}</p>
                </div>
              ) : (
                <div aria-live="polite">
                  <div className="player-slot">
                    <iframe
                      title="Spotify — help urself"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      src={`https://open.spotify.com/embed/track/${SPOTIFY_EMBED_TRACK}?utm_source=generator`}
                    />
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Facts */}
          <div className="facts" role="list">
            {[
              { val: '43M+', lbl: 'help urself streams' },
              { val: '30M+', lbl: t('totalStreams') },
              { val: '4+', lbl: t('ncsTracks') },
              { val: '2022', lbl: t('firstViral') },
              { val: 'OSLO', lbl: t('origin') },
              { val: '2026', lbl: 'Montagem Hysteria EP' },
            ].map((f, i) => (
              <div className="fact" key={i} role="listitem">
                <strong>{f.val}</strong>
                <span>{f.lbl}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="timeline-wrap">
            <p className="eyebrow">{t('tlTitle')}</p>
            <div className="timeline" role="list">
              {TIMELINE.map((row, i) => (
                <div className="timeline-row" key={i} role="listitem">
                  <span>{row.year}</span>
                  <p>{row.event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Release catalog */}
          <p className="eyebrow" style={{ marginBottom: 12 }}>{t('releasesTitle')}</p>
          <div className="release-grid" role="list">
            {RELEASES.map((r, i) => (
              <Ext href={r.href} className="release-card" key={i}>
                <span className="num">0{i + 1}</span>
                <h3>{r.name}</h3>
                <small>{r.year}</small>
                <span className="card-arrow">↗</span>
              </Ext>
            ))}
          </div>
        </section>

        {/* ─── CREDITS ─── */}
        <section className="section" id="credits" aria-labelledby="credits-title">
          <p className="eyebrow">{t('creditsEyebrow')}</p>
          <h2 className="section-title" id="credits-title">SYNC <em>&</em><br />PLATFORM</h2>
          <p className="section-intro">{t('creditsIntro')}</p>

          <div className="proof-grid">
            {[
              { tag: 'SYNC · FILM', tagAcid: true, title: 'Fast & Furious', desc: t('cardFF'), link: SPOTIFY_ARTIST, linkLabel: t('linkCatalog') },
              { tag: 'GAME OST', tagAcid: false, title: 'BODYCAM', desc: t('cardBodycam'), link: SPOTIFY_ARTIST, linkLabel: 'Spotify ↗' },
              { tag: 'LABEL · NCS', tagAcid: true, title: "Lock n' Load", desc: t('cardLock'), link: 'https://ncs.io/LockNLoad', linkLabel: t('linkNcsListen') },
              { tag: 'LABEL · NCS', tagAcid: false, title: 'Round Around', desc: t('cardRound'), link: 'https://ncs.io/roundaround', linkLabel: t('linkNcsListen') },
            ].map((item, i) => (
              <div className="proof-card" key={i}>
                <span className={`tag ${item.tagAcid ? 'acid' : ''}`}>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <Ext href={item.link}>{item.linkLabel}</Ext>
              </div>
            ))}
          </div>

          <div className="actions" style={{ marginTop: 28 }}>
            <Ext href={NCS_ARTIST} className="btn ghost">{t('btnNcsProfile')}</Ext>
            <Ext href={YOUTUBE} className="btn ghost">YouTube ↗</Ext>
            <Ext href={INSTAGRAM} className="btn ghost">Instagram ↗</Ext>
          </div>
        </section>

        {/* ─── NORDIC / BIO ─── */}
        <section className="section" id="nordic" aria-labelledby="nordic-title">
          <p className="eyebrow">{t('nordicEyebrow')}</p>
          <h2 className="section-title" id="nordic-title">{t('nordicTitleA')}<br /><em>PHONK</em></h2>

          <div className="nordic-grid">
            <div className="nordic-copy">
              <p className="intro">{t('nordicIntro')}</p>
              <div className="impact-copy">
                <h3>{t('impactH')}</h3>
                <p>{t('impactP')}</p>
              </div>
              <div className="identity-copy">
                <p className="eyebrow" style={{ marginBottom: 8 }}>{t('prodEyebrow')}</p>
                <h3>{t('identityH')}</h3>
                <p>{t('identityP')}</p>
              </div>
            </div>

            <div className="coordinate" aria-label={t('coordLabel')}>
              <span className="micro">{t('coordLabel')}</span>
              <strong>59°54'22"N<br />10°43'50"E</strong>
              <div className="coordinate-footer">
                <span>{t('coordCity')}</span>
                <span>{t('coordAlt')}</span>
                <span>UTC +01:00</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NCS ─── */}
        <section className="section" id="ncs" aria-labelledby="ncs-title">
          <p className="eyebrow">{t('ncsEyebrow')}</p>
          <h2 className="section-title" id="ncs-title">NCS <em>{t('ncsTitleB')}</em></h2>
          <div className="ncs-grid">
            <div>
              <div className="ncs-stat"><AnimCounter target={50} />M<span>+</span></div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.8, maxWidth: 400 }}>
                {t('ncsDesc')}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { num: '50M+', lbl: t('ncsSubscribers') },
                { num: t('twoTracks'), lbl: t('officialSingles') },
                { num: 'Free DL', lbl: t('creatorLicense') },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'baseline', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 900, minWidth: 100 }}>{s.num}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{s.lbl}</span>
                </div>
              ))}
              <div className="actions">
                <Ext href={NCS_ARTIST} className="btn ghost">{t('btnNcsProfile')}</Ext>
                <Ext href="https://ncs.io/LockNLoad" className="btn ghost">Lock n' Load ↗</Ext>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOSYAL & PODCAST ─── */}
        <section className="section" id="social" aria-labelledby="social-title">
          <p className="eyebrow">{t('socialEyebrow')}</p>
          <h2 className="section-title" id="social-title">{t('socialTitleA')}<br /><em>{t('socialTitleB')}</em></h2>
          <p className="section-intro">{t('socialIntro')}</p>

          <div className="social-grid" role="list">
            {SOCIALS.map((s, i) => (
              <Ext href={s.href} className="social-card" key={i}>
                <span className="platform">{s.platform}</span>
                <span className="handle">{s.handle}</span>
                <span className="card-arrow">↗</span>
              </Ext>
            ))}
          </div>

          <div className="podcast-box">
            <div>
              <p className="eyebrow" style={{ marginBottom: 8 }}>Podcast</p>
              <h3>HXI FREQUENCY</h3>
              <p>{t('podcastDesc')}</p>
            </div>
            <a href={`mailto:${EMAIL}?subject=Podcast`} className="btn ghost">
              {t('podcastCta')}
            </a>
          </div>
        </section>

        {/* ─── FREQUENCY ─── */}
        <section className="section" id="frequency" aria-labelledby="freq-title">
          <div className="frequency-grid">
            <div>
              <p className="eyebrow">{t('freqEyebrow')}</p>
              <h2 className="frequency-title" id="freq-title">
                <span className="freq-the">The</span>
                FREQUENCY<em>.</em>
              </h2>
              <div className="freq-rule" aria-hidden="true" />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 14, color: '#c4c5bf', lineHeight: 1.9, marginBottom: 24 }}>
                {t('freqP1')}
              </p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28 }}>
                {t('freqP2')}
              </p>
              <div className="actions">
                <Ext href={SPOTIFY_ARTIST} className="btn primary">{t('fullCatalog')} ↗</Ext>
                <Ext href={INSTAGRAM} className="btn ghost">Instagram</Ext>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section className="section" id="contact" aria-labelledby="contact-title">
          <div className="contact-grid">
            <div>
              <p className="eyebrow">{t('navContact')}</p>
              <h2 className="section-title" id="contact-title" style={{ marginBottom: 0 }}>
                {t('contactTitleA')}<br /><em>{t('contactTitleB')}</em>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'flex-end' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
                {t('contactDesc')}
              </p>
              <div className="actions">
                <Ext href={INSTAGRAM} className="btn primary">Instagram ↗</Ext>
                <Ext href={YOUTUBE} className="btn ghost">YouTube</Ext>
                <a href={`mailto:${EMAIL}`} className="btn ghost">{EMAIL}</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <p className="footer-copy">{t('footerRights')}</p>
        <span className="footer-mark">X</span>
        <p className="footer-copy">
          <Ext href={SPOTIFY_ARTIST}>Spotify</Ext>
          {' · '}
          <Ext href={INSTAGRAM}>Instagram</Ext>
          {' · '}
          <Ext href={NCS_ARTIST}>NCS</Ext>
          {' · '}
          <Ext href={YOUTUBE}>YouTube</Ext>
        </p>
      </footer>
    </>
  );
}
