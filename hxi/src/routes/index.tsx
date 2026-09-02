import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: HxiSite,
});

/* ---------------- Utilities ---------------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCounter(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const v = useCounter(value, active);
  const display =
    value >= 1_000_000
      ? (v / 1_000_000).toFixed(1) + "M"
      : value >= 1_000
        ? (v / 1_000).toFixed(0) + "K"
        : v.toString();
  return (
    <div ref={ref} className="border border-[#1e1e2e] p-6 md:p-8 bg-[#0e0e18]">
      <div className="font-[Barlow_Condensed] text-5xl md:text-6xl font-black text-[#F0EDE8] leading-none">
        {display}
        {suffix}
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
        {label}
      </div>
    </div>
  );
}

/* ---------------- Sections ---------------- */

function Preloader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080810]">
      <GlitchLogo size="text-8xl md:text-9xl" />
    </div>
  );
}

function GlitchLogo({ size = "text-7xl", text = "HXI" }: { size?: string; text?: string }) {
  return (
    <div className={`relative font-[Barlow_Condensed] font-black tracking-tighter ${size}`}>
      <span className="absolute inset-0 glitch-layer-red">{text}</span>
      <span className="absolute inset-0 glitch-layer-blue">{text}</span>
      <span className="relative text-[#F0EDE8]">{text}</span>
    </div>
  );
}

function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setW(scrolled * 100);
    };
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-50">
      <div className="h-full bg-[#EF2B2D] transition-[width] duration-75" style={{ width: `${w}%` }} />
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#music", label: "Music" },
    { href: "#sync", label: "Sync" },
    { href: "#store", label: "Store" },
    { href: "#booking", label: "Booking" },
  ];
  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#080810]/85 backdrop-blur border-b border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="font-[Barlow_Condensed] font-black text-2xl tracking-tight text-[#F0EDE8]">
            HXI
          </a>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-[#666660] hover:text-[#F0EDE8] transition"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#booking"
              className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-[#F0EDE8] hover:text-[#080810] transition"
            >
              Book
            </a>
          </div>
          <button
            className="md:hidden text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.2em]"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[60] bg-[#080810] flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e1e2e]">
            <span className="font-[Barlow_Condensed] font-black text-2xl">HXI</span>
            <button
              onClick={() => setOpen(false)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#EF2B2D]"
            >
              Close
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-[Barlow_Condensed] font-black text-5xl text-[#F0EDE8] hover:text-[#EF2B2D] transition"
              >
                {l.label.toUpperCase()}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-4 bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.2em] px-8 py-4"
            >
              Book
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[92vh] flex items-center overflow-hidden bg-grid">
      <div className="absolute inset-0 pointer-events-none noise-overlay" />
      <div className="scanline-bar" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-24 w-full">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D] mb-6">
          ◈ Nordic Phonk · Est. 2021
        </div>
        <div className="flex justify-start">
          <GlitchLogo size="text-[22vw] md:text-[16vw] leading-[0.85]" />
        </div>
        <div className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-[#F0EDE8]">
          Nordic Phonk · Norway · Est. 2021
        </div>

        <div className="mt-10 border border-[#EF2B2D]/50 bg-[#EF2B2D]/5 p-4 md:p-5 max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
            ◈ Help Urself — Official Stems
          </div>
          <div className="mt-2 text-[#F0EDE8] text-sm md:text-base">
            Free stem pack on signup — build with 43M+ streams of source material.
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://open.spotify.com/artist/"
            className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-[#F0EDE8] hover:text-[#080810] transition"
          >
            ▸ Stream Now
          </a>
          <a
            href="#sync"
            className="border border-[#F0EDE8] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-[#F0EDE8] hover:text-[#080810] transition"
          >
            License Music
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1e1e2e] border border-[#1e1e2e] max-w-4xl">
          {[
            ["43.4M+", "Streams"],
            ["8+", "Sync Placements"],
            ["NCS", "Artist"],
            ["5 Yrs", "Active"],
          ].map(([v, l]) => (
            <div key={l} className="bg-[#080810] px-4 py-4">
              <div className="font-[Barlow_Condensed] font-black text-2xl text-[#F0EDE8]">{v}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#666660] mt-1">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const text =
    "43M+ STREAMS · FAST & FURIOUS SYNC · BODYCAM OST · NCS ARTIST · 251K MONTHLY LISTENERS · NORWAY · 8+ SYNC PLACEMENTS · SCAR SCHEME RECORDS · ";
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-[#F0EDE8] px-8 whitespace-nowrap">
      {text}
    </span>
  ));
  return (
    <div className="bg-[#EF2B2D] border-y border-[#EF2B2D] py-4 overflow-hidden">
      <div className="marquee-track">{items}</div>
    </div>
  );
}

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mb-12" data-reveal>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">{tag}</div>
      <h2 className="mt-3 font-[Barlow_Condensed] font-black text-4xl md:text-6xl leading-[0.9] text-[#F0EDE8] tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-reveal
      className={`border border-[#1e1e2e] bg-[#0e0e18] p-6 md:p-8 hover:border-[#EF2B2D]/60 transition ${className}`}
    >
      {children}
    </div>
  );
}

function MusicSection() {
  return (
    <section id="music" className="py-24 md:py-32 border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader tag="◈ 001 — Discography" title="THE CATALOG." />
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
              Breakout · 2022
            </div>
            <h3 className="mt-3 font-[Barlow_Condensed] font-black text-4xl text-[#F0EDE8] leading-none">
              HELP URSELF
            </h3>
            <div className="mt-4 font-mono text-xs text-[#F0EDE8]">43,367,812 Spotify Streams</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
              Organic · Anime / Gaming Edits · TikTok Viral
            </div>
            <div className="mt-5">
              <iframe
                title="help urself"
                src="https://open.spotify.com/embed/track/54ggxbEopZwQ20zurJiHSD?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
            <div className="mt-5 flex gap-2 flex-wrap">
              <a
                href="https://open.spotify.com/track/54ggxbEopZwQ20zurJiHSD"
                className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5"
              >
                ▸ Spotify
              </a>
              <a
                href="#stems"
                className="border border-[#F0EDE8] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5"
              >
                ◈ Free Stems
              </a>
            </div>
          </Card>

          <Card>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
              2M+ Streams · 2024
            </div>
            <h3 className="mt-3 font-[Barlow_Condensed] font-black text-4xl text-[#F0EDE8] leading-none">
              X-PIRATA
            </h3>
            <div className="mt-4 font-mono text-xs text-[#F0EDE8]">
              2,607,379 streams + 622K (Slowed)
            </div>
            <div className="mt-6 border-t border-[#1e1e2e] divide-y divide-[#1e1e2e]">
              {["Original Version", "Slowed Version"].map((t, i) => (
                <div key={t} className="flex justify-between py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F0EDE8]">
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <a
                href="https://open.spotify.com"
                className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 inline-block"
              >
                ▸ Spotify
              </a>
            </div>
          </Card>

          <Card>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
              Latest · June 2026
            </div>
            <h3 className="mt-3 font-[Barlow_Condensed] font-black text-4xl text-[#F0EDE8] leading-none">
              MONTAGEM HYSTERIA
            </h3>
            <div className="mt-4 font-mono text-xs text-[#F0EDE8]">
              EP · 5 tracks · 8 min · feat. -Prey · pvppet · ToufG
            </div>
            <div className="mt-6 border-t border-[#1e1e2e] divide-y divide-[#1e1e2e]">
              {[
                "MONTAGEM HYSTERIA",
                "HYSTERIA MODE",
                "DARK FREQUENCY",
                "NORDIC DRIFT",
                "HELP URSELF FUNK",
              ].map((t, i) => (
                <div key={t} className="flex justify-between py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F0EDE8]">
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2 flex-wrap">
              <a
                href="https://open.spotify.com"
                className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5"
              >
                ▸ Spotify
              </a>
              <a
                href="https://music.apple.com"
                className="border border-[#F0EDE8] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5"
              >
                ▸ Apple Music
              </a>
            </div>
          </Card>
        </div>
        <div className="mt-10 text-right">
          <a
            href="https://open.spotify.com"
            className="font-mono text-xs uppercase tracking-[0.25em] text-[#F0EDE8] hover:text-[#EF2B2D]"
          >
            Full Discography on Spotify →
          </a>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-24 md:py-28 bg-[#0e0e18] border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader tag="◈ 002 — Numbers" title="THE FOOTPRINT." />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat value={43_000_000} suffix="+" label="Spotify Streams" />
          <Stat value={251_000} label="Monthly Listeners" />
          <Stat value={8} suffix="+" label="Sync Placements" />
          <Stat value={50_000_000} suffix="+" label="NCS Ecosystem" />
          <Stat value={5} label="Years Active" />
          <Stat value={69} suffix="%" label="Revenue = Streaming" />
        </div>
      </div>
    </section>
  );
}

function StemsSection() {
  const items = [
    {
      tag: "◈ Free",
      title: "HELP URSELF STEM PACK",
      desc: "All stems · CapCut ready · FREE on signup",
      price: "FREE",
    },
    {
      tag: "◈ Preset",
      title: "DARK PHONK PRESET PACK",
      desc: "FL Studio + Serum · 24 presets",
      price: "€12",
    },
    { tag: "◈ Stems", title: "X-PIRATA STEMS", desc: "Full stems · Drift phonk", price: "€9" },
  ];
  return (
    <section id="stems" className="py-24 md:py-32 border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader tag="◈ 003 — Creator Tools" title="YOU HEARD IT. NOW BUILD WITH IT." />
        <p className="max-w-2xl text-[#F0EDE8]/80 -mt-6 mb-12" data-reveal>
          The 43M-stream edit community runs on source material. Own the stems, presets, and sonic
          DNA behind the tracks.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((it) => (
            <Card key={it.title}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
                {it.tag}
              </div>
              <h3 className="mt-3 font-[Barlow_Condensed] font-black text-3xl text-[#F0EDE8] leading-tight">
                {it.title}
              </h3>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#666660]">
                {it.desc}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[#1e1e2e] pt-5">
                <span className="font-[Barlow_Condensed] font-black text-2xl text-[#F0EDE8]">
                  {it.price}
                </span>
                <button className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5">
                  Get →
                </button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]" data-reveal>
          Used in: Anime Edits · Gaming Clips · Drift/JDM · Gym Motivation · CapCut Templates ·
          YouTube Shorts
        </div>
      </div>
    </section>
  );
}

function NCSSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0e0e18] border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12">
        <div data-reveal>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
            ◈ 004 — NCS Ecosystem
          </div>
          <h2 className="mt-3 font-[Barlow_Condensed] font-black text-4xl md:text-5xl text-[#F0EDE8] leading-[0.9]">
            50 MILLION
            <br />
            SUBSCRIBERS.
            <br />
            YOUR CONTENT.
          </h2>
          <p className="mt-6 text-[#F0EDE8]/80 max-w-md">
            Official NoCopyrightSounds artist since 2024. Tracks distributed to a 200M+ global
            content creator community — free to use, license-clear, worldwide.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ["Lock n' Load", "NCS Release · September 2024"],
              ["Round Around feat. Nateki", "NCS Release · September 2025"],
            ].map(([t, s]) => (
              <div key={t} className="border border-[#1e1e2e] p-4 flex justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#F0EDE8]">
                  {t}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-[#1e1e2e] bg-[#080810] p-8" data-reveal>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D] mb-6">
            ◈ Reach
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {[
              ["NCS YouTube Subscribers", "50M+"],
              ["Global Content Creators", "200M+"],
              ["Countries Reached", "190+"],
              ["HXI Placements", "2"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between py-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
                  {k}
                </span>
                <span className="font-[Barlow_Condensed] font-black text-3xl text-[#F0EDE8]">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SyncSection() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const markets = [
    ["$9.73B", "Global sync market 2026"],
    ["$1.91B", "Video game music 2026"],
    ["+8.8%", "Sync market CAGR"],
    ["$5K–50K", "TV sync per track"],
  ];
  const credentials = [
    ["Fast & Furious", "Universal Pictures · Drift Phonk", "Film Sync ✓"],
    ["BODYCAM OST", "Never Phased · KRASH · Mix & Master: HXI", "Game Sync ✓"],
    ["NCS", "50M+ Subscriber Ecosystem", "Creator Platform ✓"],
    ["310babii", "Soak City · Phonk Remix", "Hip-Hop ✓"],
  ];
  const tiers = [
    ["Creator License", "YouTube/TikTok/Instagram", "€49/track", false],
    ["Sync Standard", "Indie film, short film", "€299/track", false],
    ["Game Sync", "Game soundtrack, trailer", "On request", true],
    ["Sync Pro", "Netflix, Amazon", "On request", false],
    ["Advertising", "TV/brand content", "On request", false],
  ] as const;

  return (
    <section id="sync" className="py-24 md:py-32 border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader tag="◈ 005 — Sync & Licensing" title="MUSIC THAT MOVES CULTURE." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1e1e2e] border border-[#1e1e2e] mb-16">
          {markets.map(([v, l]) => (
            <div key={l} className="bg-[#080810] p-5">
              <div className="font-[Barlow_Condensed] font-black text-2xl md:text-3xl text-[#EF2B2D]">
                {v}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
                {l}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {credentials.map(([t, s, tag]) => (
            <Card key={t} className="flex items-start justify-between gap-6">
              <div>
                <h4 className="font-[Barlow_Condensed] font-black text-2xl text-[#F0EDE8]">{t}</h4>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#666660]">
                  {s}
                </p>
              </div>
              <div className="shrink-0 border border-[#EF2B2D] text-[#EF2B2D] font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                {tag}
              </div>
            </Card>
          ))}
        </div>

        <div className="border border-[#1e1e2e]" data-reveal>
          <div className="grid grid-cols-12 border-b border-[#1e1e2e] bg-[#0e0e18]">
            <div className="col-span-4 md:col-span-3 p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
              Tier
            </div>
            <div className="col-span-5 md:col-span-6 p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
              Use
            </div>
            <div className="col-span-3 p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660] text-right">
              Price
            </div>
          </div>
          {tiers.map(([tier, use, price, hi]) => (
            <div
              key={tier}
              className={`grid grid-cols-12 border-b border-[#1e1e2e] last:border-b-0 ${hi ? "bg-[#EF2B2D]/10" : ""}`}
            >
              <div className={`col-span-4 md:col-span-3 p-4 font-[Barlow_Condensed] font-black text-xl ${hi ? "text-[#EF2B2D]" : "text-[#F0EDE8]"}`}>
                {tier}
              </div>
              <div className="col-span-5 md:col-span-6 p-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[#F0EDE8]/80 self-center">
                {use}
              </div>
              <div className="col-span-3 p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#F0EDE8] text-right self-center">
                {price}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.25em] px-6 py-3.5"
          >
            {showForm ? "Close Inquiry Form" : "◈ Start a Sync Inquiry"}
          </button>
        </div>

        {showForm && (
          <form
            className="mt-8 border border-[#1e1e2e] bg-[#0e0e18] p-6 md:p-8 grid md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            {submitted ? (
              <div className="md:col-span-2 py-12 text-center">
                <div className="font-[Barlow_Condensed] font-black text-3xl text-[#EF2B2D]">
                  INQUIRY RECEIVED.
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#F0EDE8]">
                  We'll reply within 48 hours to sync@hximusic.com.
                </p>
              </div>
            ) : (
              <>
                <Input label="Name" required />
                <Input label="Company" />
                <Input label="Email" type="email" required />
                <Input label="Media Type" placeholder="Film · Game · Ad · Trailer" />
                <div className="md:col-span-2">
                  <Label>Budget Range</Label>
                  <select className="w-full bg-[#080810] border border-[#1e1e2e] text-[#F0EDE8] font-mono text-xs px-4 py-3 focus:border-[#EF2B2D] outline-none">
                    <option>Under €500</option>
                    <option>€500 – €5K</option>
                    <option>€5K – €50K</option>
                    <option>€50K+</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label>Message</Label>
                  <textarea
                    rows={4}
                    className="w-full bg-[#080810] border border-[#1e1e2e] text-[#F0EDE8] font-mono text-xs px-4 py-3 focus:border-[#EF2B2D] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.25em] px-6 py-3.5"
                  >
                    Send Sync Inquiry →
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#666660] mb-2">
      {children}
    </label>
  );
}

function Input({
  label,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>
        {label} {required && <span className="text-[#EF2B2D]">*</span>}
      </Label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={200}
        className="w-full bg-[#080810] border border-[#1e1e2e] text-[#F0EDE8] font-mono text-xs px-4 py-3 focus:border-[#EF2B2D] outline-none"
      />
    </div>
  );
}

function AboutSection() {
  return (
    <section className="py-24 md:py-32 border-b border-[#1e1e2e] bg-[#0e0e18]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12">
        <div data-reveal>
          <div className="font-[Barlow_Condensed] font-black text-[16vw] md:text-[10vw] leading-[0.85] text-[#EF2B2D]/90 tracking-tighter">
            THE
            <br />
            FRE-
            <br />
            QUEN-
            <br />
            CY.
          </div>
        </div>
        <div data-reveal>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D] mb-4">
            ◈ 006 — About
          </div>
          <div className="space-y-5 text-[#F0EDE8]/85 leading-relaxed">
            <p>
              HXI is a Norwegian producer, DJ, and sound designer whose glitch-laced, bitcrushed
              approach to phonk has made him one of the genre's defining underground voices. Active
              since 2021, his sound moves between hard phonk, drift trap, and electronic
              experimentation.
            </p>
            <p>
              His breakout single 'help urself' surpassed 43 million streams on Spotify — earned
              organically through the anime and gaming edit community. Zero paid promotion. His
              music has placed in the Fast & Furious franchise and on the official BODYCAM game
              soundtrack, where he also handled mix and mastering independently.
            </p>
            <p>A NoCopyrightSounds artist since 2024. Based in Oslo. Active globally.</p>
          </div>

          <div className="mt-8 border border-[#EF2B2D]/50 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D] mb-2">
              Independent Artist · Market Position
            </div>
            <p className="text-[#F0EDE8]/80 text-sm">
              Major labels control 70% of streaming revenue. HXI operates with full master
              ownership, 100% royalty access, and direct sync licensing control — in a $37B+
              streaming market growing at 15% annually.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#"
              className="font-mono text-xs uppercase tracking-[0.25em] text-[#F0EDE8] hover:text-[#EF2B2D]"
            >
              Download EPK ↓
            </a>
            <a
              href="mailto:press@hximusic.com"
              className="font-mono text-xs uppercase tracking-[0.25em] text-[#F0EDE8] hover:text-[#EF2B2D]"
            >
              Press enquiries → press@hximusic.com
            </a>
          </div>

          <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
            Collaborators: -Prey · TWISTED · Nateki · pvppet · ToufG · 310babii · Crazy Mano ·
            Grioten
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreSection() {
  const items = [
    { t: "HELP URSELF STEMS", d: "Free on signup", p: "FREE", badge: "FREE" },
    { t: "DARK PHONK PRESETS", d: "FL Studio + Serum", p: "€12" },
    { t: "X LOGO TEE", d: "Heavyweight black", p: "€35", badge: "SOON" },
    { t: "NORDIC PHONK HOODIE", d: "Oversized", p: "€69", badge: "SOON" },
  ];
  return (
    <section id="store" className="py-24 md:py-32 border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader tag="◈ 007 — Store" title="WEAR THE FREQUENCY." />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((i) => (
            <Card key={i.t}>
              <div className="aspect-square bg-[#080810] border border-[#1e1e2e] mb-5 flex items-center justify-center relative">
                <span className="font-[Barlow_Condensed] font-black text-6xl text-[#1e1e2e]">
                  HXI
                </span>
                {i.badge && (
                  <span
                    className={`absolute top-2 right-2 font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                      i.badge === "FREE"
                        ? "bg-[#EF2B2D] text-[#F0EDE8]"
                        : "bg-[#002868] text-[#F0EDE8]"
                    }`}
                  >
                    {i.badge}
                  </span>
                )}
              </div>
              <div className="font-[Barlow_Condensed] font-black text-xl text-[#F0EDE8] leading-tight">
                {i.t}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
                {i.d}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-[Barlow_Condensed] font-black text-lg text-[#F0EDE8]">
                  {i.p}
                </span>
                <button className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#EF2B2D]">
                  {i.badge === "SOON" ? "Notify →" : "Get →"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailSection() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <section className="py-24 md:py-32 bg-[#0e0e18] border-b border-[#1e1e2e]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center" data-reveal>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
          ◈ 008 — Direct Line
        </div>
        <h2 className="mt-4 font-[Barlow_Condensed] font-black text-5xl md:text-7xl text-[#F0EDE8] leading-[0.9]">
          DROP FIRST.
          <br />
          WORLD LATER.
        </h2>
        <p className="mt-6 text-[#F0EDE8]/80 max-w-xl mx-auto">
          Releases, stem packs, unreleased tracks — direct to your inbox. Free 'help urself' stem
          pack on signup.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setOk(true);
          }}
          className="mt-10 flex flex-col sm:flex-row gap-0 max-w-xl mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-[#080810] border border-[#1e1e2e] text-[#F0EDE8] font-mono text-sm px-5 py-4 focus:border-[#EF2B2D] outline-none"
          />
          <button
            type="submit"
            className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.25em] px-8 py-4"
          >
            Enter →
          </button>
        </form>
        {ok && (
          <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#EF2B2D]">
            ✓ You're in. Check your inbox.
          </div>
        )}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
          GDPR compliant · Unsubscribe anytime · No spam
        </p>
      </div>
    </section>
  );
}

function BookingSection() {
  const [sent, setSent] = useState(false);
  return (
    <section id="booking" className="py-24 md:py-32 border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12">
        <div data-reveal>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D]">
            ◈ 009 — Booking
          </div>
          <h2 className="mt-3 font-[Barlow_Condensed] font-black text-5xl md:text-7xl text-[#F0EDE8] leading-[0.9]">
            BOOK HXI.
          </h2>
          <p className="mt-6 text-[#F0EDE8]/80">
            DJ sets and live performances rooted in hard phonk, drift, and Nordic industrial sound
            design. Clubs, festivals, brand events, virtual — worldwide.
          </p>
          <div className="mt-8 border border-[#1e1e2e] divide-y divide-[#1e1e2e]">
            {[
              ["DJ Set", "60 · 90 · 120 min"],
              ["B2B Set", "With approved artists"],
              ["Virtual / Livestream", "Worldwide"],
              ["Studio Session", "Invitation only"],
            ].map(([t, s]) => (
              <div key={t} className="flex justify-between p-4">
                <span className="font-[Barlow_Condensed] font-black text-xl text-[#F0EDE8]">{t}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660] self-center">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="border border-[#1e1e2e] bg-[#0e0e18] p-6 md:p-8 grid grid-cols-1 gap-4"
          data-reveal
        >
          {sent ? (
            <div className="py-16 text-center">
              <div className="font-[Barlow_Condensed] font-black text-3xl text-[#EF2B2D]">
                BOOKING RECEIVED.
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#F0EDE8]">
                Reply within 48h to booking@hximusic.com.
              </p>
            </div>
          ) : (
            <>
              <Input label="Name" required />
              <Input label="Company / Project" />
              <Input label="Email" type="email" required />
              <Input label="Event / Venue" />
              <Input label="Date / Location" />
              <div>
                <Label>Message *</Label>
                <textarea
                  rows={4}
                  required
                  className="w-full bg-[#080810] border border-[#1e1e2e] text-[#F0EDE8] font-mono text-xs px-4 py-3 focus:border-[#EF2B2D] outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.25em] px-6 py-4"
              >
                Send Booking Inquiry →
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#080810] py-16 border-t border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="font-[Barlow_Condensed] font-black text-6xl text-[#F0EDE8] leading-none">
              HXI
            </div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#666660]">
              Norway · Scar Scheme Records
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#666660]">
              Registered: TONO · GRAMO · Norway
            </div>
          </div>

          <FooterCol
            title="Music"
            links={["Spotify", "Apple Music", "SoundCloud", "YouTube", "NCS"]}
          />
          <FooterCol
            title="Social"
            links={["Instagram @prod.hxi", "TikTok @hximusic", "X/Twitter @HXIMusic"]}
          />
          <FooterCol
            title="Contact"
            links={["booking@hximusic.com", "sync@hximusic.com", "press@hximusic.com"]}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-[#1e1e2e] flex flex-col md:flex-row justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666660]">
          <div>© 2026 HXI. All masters owned by artist.</div>
          <div className="flex gap-6 flex-wrap">
            <a href="#" className="hover:text-[#F0EDE8]">Privacy Policy</a>
            <a href="#" className="hover:text-[#F0EDE8]">Terms</a>
            <a href="#" className="hover:text-[#F0EDE8]">Cookie Policy</a>
            <a href="#" className="hover:text-[#F0EDE8]">DMCA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EF2B2D] mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="font-mono text-xs text-[#F0EDE8]/80 hover:text-[#EF2B2D] transition"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 bg-[#EF2B2D] text-[#F0EDE8] font-mono text-xs uppercase tracking-[0.2em] px-4 py-3 hover:bg-[#F0EDE8] hover:text-[#080810] transition"
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("hxi-cookie")) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0e0e18] border-t border-[#EF2B2D] p-4 md:p-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F0EDE8]/80">
          ◈ This site uses cookies for analytics. By continuing you accept the cookie policy.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem("hxi-cookie", "declined");
              setShow(false);
            }}
            className="border border-[#1e1e2e] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2"
          >
            Decline
          </button>
          <button
            onClick={() => {
              localStorage.setItem("hxi-cookie", "accepted");
              setShow(false);
            }}
            className="bg-[#EF2B2D] text-[#F0EDE8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Root ---------------- */

function HxiSite() {
  useReveal();
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <div className="bg-[#080810] text-[#F0EDE8] min-h-screen">
      <Preloader />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Ticker />
      <MusicSection />
      <StatsSection />
      <StemsSection />
      <NCSSection />
      <SyncSection />
      <AboutSection />
      <StoreSection />
      <EmailSection />
      <BookingSection />
      <Footer />
      <BackToTop />
      <CookieBanner />

      <style>{`
        [data-reveal].reveal-in { animation: fade-up 0.9s ease-out both; }
      `}</style>
    </div>
  );
}
