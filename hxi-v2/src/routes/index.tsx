import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { MusicSection } from "@/components/music-section";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV = [
  { id: "music", label: "Music" },
  { id: "sync", label: "Sync" },
  { id: "store", label: "Store" },
  { id: "booking", label: "Booking" },
];

const TICKER = "43M+ STREAMS · FAST & FURIOUS SYNC · BODYCAM OST · NCS ARTIST · 251K MONTHLY LISTENERS · NORWAY";

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Counter({ end, suffix = "", duration = 1600 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const step = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.floor(eased * end));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  const formatted = useMemo(() => {
    if (end >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
    if (end >= 1_000) return (val / 1_000).toFixed(0) + "K";
    return String(val);
  }, [val, end]);
  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative px-6 md:px-12 py-24 md:py-32 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHeader({ label, title, kicker }: { label: string; title: string; kicker?: string }) {
  return (
    <div className="mb-12 reveal">
      <div className="font-label text-xs text-[color:var(--primary)] mb-3">{label}</div>
      <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">{title}</h2>
      {kicker && <p className="mt-4 text-[color:var(--muted)] max-w-2xl">{kicker}</p>}
    </div>
  );
}

function Index() {
  useScrollReveal();
  const progress = useScrollProgress();
  const active = useActiveSection(NAV.map((n) => n.id));
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [cookieOk, setCookieOk] = useState(true);
  const [preload, setPreload] = useState(true);
  const [syncOpen, setSyncOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPreload(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setCookieOk(typeof localStorage !== "undefined" && localStorage.getItem("hxi-cookies") === "1");
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || preload ? "hidden" : "";
  }, [menuOpen, preload]);

  const acceptCookies = () => {
    localStorage.setItem("hxi-cookies", "1");
    setCookieOk(true);
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      {/* Preloader */}
      {preload && (
        <div className="fixed inset-0 z-[100] bg-[color:var(--bg)] flex items-center justify-center">
          <div className="font-display text-7xl md:text-9xl glitch" data-text="HXI">HXI</div>
        </div>
      )}

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent">
        <div className="h-full bg-[color:var(--primary)]" style={{ width: `${progress}%` }} />
      </div>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-[color:var(--bg)]/80 border-b border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-2xl tracking-tight">HXI</a>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`font-label text-xs transition-colors ${
                  active === n.id ? "text-[color:var(--primary)]" : "text-[color:var(--text)]/70 hover:text-[color:var(--text)]"
                }`}
              >
                {n.label}
              </a>
            ))}
            <a href="#booking" className="btn-flag font-label text-xs px-4 py-2">
              Book
            </a>
          </nav>
          <button
            className="md:hidden font-label text-xs"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            MENU
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[color:var(--bg)] flex flex-col animate-[fade-in_0.2s_ease-out]">
          <div className="h-16 px-6 flex items-center justify-between border-b border-[color:var(--border)]">
            <span className="font-display text-2xl">HXI</span>
            <button onClick={() => setMenuOpen(false)} className="font-label text-xs" aria-label="Close menu">CLOSE</button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-8">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="font-display text-5xl uppercase">
                {n.label}
              </a>
            ))}
            <a href="#booking" onClick={() => setMenuOpen(false)} className="font-label px-6 py-3 bg-[color:var(--primary)] text-white mt-4">
              Book
            </a>
          </nav>
        </div>
      )}

      {/* Hero */}
      <section id="top" className="relative min-h-screen flex items-center px-6 md:px-12 pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color:var(--bg)]" />
        <div className="relative max-w-6xl mx-auto w-full">
          <div className="font-label text-xs text-[color:var(--primary)] mb-6 reveal">Norwegian Phonk Producer</div>
          <h1 className="font-display text-[22vw] md:text-[16rem] leading-[0.85] glitch" data-text="HXI">HXI</h1>
          <p className="font-label text-sm md:text-base mt-6 text-[color:var(--text)]/80 reveal">
            Nordic Phonk · Norway · Est. 2021
          </p>
          <div className="mt-10 flex flex-wrap gap-4 reveal">
            <a
              href="https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU"
              target="_blank" rel="noreferrer"
              className="btn-flag font-label text-sm px-6 py-3"
            >
              Stream Now
            </a>
            <a href="#sync" className="btn-outline-flag font-label text-sm px-6 py-3">
              License Music
            </a>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-t border-[color:var(--border)] pt-8 reveal">
            {[
              ["43.4M+", "Streams"],
              ["8+", "Sync Placements"],
              ["NCS", "Artist"],
              ["5 Years", "Active"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl md:text-4xl">{v}</div>
                <div className="font-label text-[10px] text-[color:var(--muted)] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-[color:var(--primary)] text-white overflow-hidden py-4 border-y border-[color:var(--primary)]">
        <div className="marquee-track flex whitespace-nowrap font-label text-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="px-8">{TICKER}</span>
          ))}
        </div>
      </div>

      {/* Music — Supabase-backed */}
      <Section id="music">
        <SectionHeader label="01 / Discography" title="Music" kicker="Selected releases and streaming numbers." />
        <MusicSection />
      </Section>

      {/* Stats */}
      <Section id="stats" className="border-y border-[color:var(--border)]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {[
            { end: 43_400_000, suffix: "+", label: "Streams" },
            { end: 251_000, suffix: "", label: "Monthly Listeners" },
            { end: 8, suffix: "+", label: "Sync Placements" },
            { end: 50_000_000, suffix: "+", label: "NCS Ecosystem" },
            { end: 5, suffix: "", label: "Years Active" },
          ].map((s) => (
            <div key={s.label} className="reveal">
              <div className="font-display text-4xl md:text-5xl text-[color:var(--primary)]">
                <Counter end={s.end} suffix={s.suffix} />
              </div>
              <div className="font-label text-[10px] text-[color:var(--muted)] mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Sync */}
      <Section id="sync">
        <SectionHeader label="02 / Sync & Licensing" title="Sync" kicker="Music placed in film, games, trailers and creator content worldwide." />
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            ["Fast & Furious", "Film sync"],
            ["BODYCAM", "Game OST"],
            ["NCS", "Copyright-free artist"],
            ["310babii", "Cross-scene collab"],
          ].map(([t, s]) => (
            <div key={t} className="reveal border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <div className="font-display text-xl">{t}</div>
              <div className="font-label text-[10px] text-[color:var(--muted)] mt-2">{s}</div>
            </div>
          ))}
        </div>
        <div className="reveal border border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              ["Creator", "€49", "Per track · Social + creator content"],
              ["Standard", "€299", "Per track · Ads, brand videos, corporate"],
              ["Game / Film Sync", "On request", "Feature film · Series · AAA games"],
            ].map(([tier, price, desc], i) => (
              <div key={tier} className={`p-8 ${i < 2 ? "md:border-r" : ""} border-[color:var(--border)] ${i === 1 ? "bg-[color:var(--primary)]/5" : ""}`}>
                <div className="font-label text-[10px] text-[color:var(--primary)]">{tier}</div>
                <div className="font-display text-4xl mt-2">{price}</div>
                <div className="text-sm text-[color:var(--muted)] mt-3">{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 reveal">
          <button
            onClick={() => setSyncOpen((v) => !v)}
            className="btn-ghost-flag font-label text-xs px-5 py-3"
          >
            {syncOpen ? "Close inquiry" : "Open sync inquiry →"}
          </button>
          {syncOpen && (
            <div className="mt-6 animate-[fade-in_0.3s_ease-out]">
              <InquiryForm to="sync@hximusic.com" placeholderMsg="Project brief, deadline, usage scope, budget..." />
            </div>
          )}
        </div>
      </Section>

      {/* About */}
      <Section id="about" className="border-t border-[color:var(--border)]">
        <SectionHeader label="03 / About" title="Independent" kicker="From Norway. Building a phonk catalog with real reach." />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="reveal space-y-4 text-[color:var(--text)]/80 leading-relaxed">
            <p>
              HXI is a Norwegian phonk producer working at the crossroads of drift-scene phonk, Brazilian montagem
              and cinematic sound design. Since 2021, his catalog has crossed 43 million Spotify streams, with
              placements in Fast & Furious, BODYCAM, and the NCS ecosystem.
            </p>
            <p>
              Self-released. Self-mastered. Distributed globally. 251K monthly listeners and counting.
            </p>
          </div>
          <div className="reveal border-l-2 border-[color:var(--primary)] pl-6">
            <div className="font-label text-[10px] text-[color:var(--primary)] mb-3">Independence</div>
            <div className="font-display text-3xl uppercase leading-none">No label.<br />No middleman.<br />Just the work.</div>
            <p className="mt-4 text-sm text-[color:var(--muted)]">Every release, every sync, every business call — direct.</p>
          </div>
        </div>
      </Section>

      {/* Store */}
      <Section id="store" className="border-t border-[color:var(--border)]">
        <SectionHeader label="04 / Store" title="Store" kicker="Stems, presets, merch. Support the catalog." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Stem Pack Vol. 1", price: "FREE", status: "Download" },
            { name: "HXI Serum Presets", price: "€12", status: "Buy" },
            { name: "HXI Logo Tee", price: "SOON", status: "Notify me" },
            { name: "Phonk Hoodie", price: "SOON", status: "Notify me" },
          ].map((p) => (
            <div key={p.name} className="reveal bg-[color:var(--surface)] border border-[color:var(--border)] aspect-[3/4] flex flex-col p-5">
              <div className="flex-1 flex items-center justify-center">
                <div className="font-display text-6xl text-[color:var(--primary)]/20">HXI</div>
              </div>
              <div className="mt-auto">
                <div className="font-display text-lg leading-tight">{p.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-label text-xs text-[color:var(--primary)]">{p.price}</span>
                  <span className="font-label text-[10px] text-[color:var(--muted)]">{p.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Email signup */}
      <section className="relative border-y border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <div className="font-label text-xs text-[color:var(--primary)] mb-3">Newsletter</div>
              <h2 className="font-display text-5xl md:text-6xl uppercase leading-none">Drop first.<br />World later.</h2>
              <p className="mt-4 text-[color:var(--muted)]">Join the list and get the HXI stem pack, plus first access to every release and sync drop.</p>
            </div>
            <div className="reveal">
              <SignupForm />
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <Section id="booking">
        <SectionHeader label="05 / Booking" title="Booking" kicker="Live sets, brand partnerships, DJ bookings." />
        <div className="reveal">
          <InquiryForm to="booking@hximusic.com" placeholderMsg="Event name, date, city, capacity, budget..." />
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-3xl">HXI</div>
            <p className="text-xs text-[color:var(--muted)] mt-3">Norwegian phonk producer. Independent since 2021.</p>
          </div>
          <div>
            <div className="font-label text-[10px] text-[color:var(--primary)] mb-4">Music</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://open.spotify.com/artist/3yRqd6IO6SamMAmnXwZKeU" target="_blank" rel="noreferrer" className="link-flag">Spotify</a></li>
              <li><a href="#music" className="link-flag">Discography</a></li>
              <li><a href="#sync" className="link-flag">Licensing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-label text-[10px] text-[color:var(--primary)] mb-4">Social</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://instagram.com/prod.hxi" target="_blank" rel="noreferrer" className="link-flag">Instagram @prod.hxi</a></li>
              <li><a href="https://tiktok.com/@hximusic" target="_blank" rel="noreferrer" className="link-flag">TikTok @hximusic</a></li>
              <li><a href="https://x.com/HXIMusic" target="_blank" rel="noreferrer" className="link-flag">X @HXIMusic</a></li>
            </ul>
          </div>
          <div>
            <div className="font-label text-[10px] text-[color:var(--primary)] mb-4">Contact</div>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:booking@hximusic.com" className="link-flag">booking@hximusic.com</a></li>
              <li><a href="mailto:sync@hximusic.com" className="link-flag">sync@hximusic.com</a></li>
              <li><a href="mailto:press@hximusic.com" className="link-flag">press@hximusic.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[color:var(--border)] px-6 md:px-12 py-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-3 text-[10px] font-label text-[color:var(--muted)]">
          <div>© {new Date().getFullYear()} HXI · All rights reserved</div>
          <div>Member of TONO & GRAMO · Norway</div>
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn-flag fixed bottom-6 right-6 z-40 w-12 h-12 font-label text-xs animate-[fade-in_0.3s_ease-out]"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Cookie banner */}
      {!cookieOk && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <p className="text-xs text-[color:var(--muted)]">
              We use minimal cookies for analytics. By continuing, you agree to our use of cookies (GDPR).
            </p>
            <div className="flex gap-2">
              <button onClick={acceptCookies} className="font-label text-xs px-4 py-2 bg-[color:var(--primary)] text-white">Accept</button>
              <button onClick={() => setCookieOk(true)} className="font-label text-xs px-4 py-2 border border-[color:var(--border)]">Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 255) {
      setErr("Enter a valid email address.");
      setStatus("err");
      return;
    }
    setStatus("ok");
    setEmail("");
    setErr("");
  };
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-[color:var(--bg)] border border-[color:var(--border)] px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--primary)]"
        />
        <button type="submit" className="btn-flag font-label text-xs px-6 py-3">
          Get stems
        </button>
      </div>
      {status === "ok" && <p className="text-xs text-[color:var(--primary)] font-label">Check your inbox — stem pack incoming.</p>}
      {status === "err" && <p className="text-xs text-[color:var(--primary)] font-label">{err}</p>}
      <p className="text-[10px] text-[color:var(--muted)] font-label">No spam. Unsubscribe anytime.</p>
    </form>
  );
}

function InquiryForm({ to, placeholderMsg }: { to: string; placeholderMsg: string }) {
  const [state, setState] = useState({ name: "", email: "", org: "", msg: "" });
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = state.name.trim();
    const email = state.email.trim();
    const msg = state.msg.trim();
    if (!name || name.length > 100) return fail("Enter your name (max 100).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return fail("Invalid email.");
    if (!msg || msg.length > 1000) return fail("Message required (max 1000 chars).");
    const subject = encodeURIComponent(`Inquiry from ${name}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name}${state.org ? ` / ${state.org}` : ""}\n${email}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setStatus("ok");
    setState({ name: "", email: "", org: "", msg: "" });
    function fail(m: string) { setErr(m); setStatus("err"); }
  };
  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
      <input
        type="text" required maxLength={100}
        value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })}
        placeholder="Name"
        className="bg-[color:var(--surface)] border border-[color:var(--border)] px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--primary)]"
      />
      <input
        type="email" required maxLength={255}
        value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })}
        placeholder="Email"
        className="bg-[color:var(--surface)] border border-[color:var(--border)] px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--primary)]"
      />
      <input
        type="text" maxLength={100}
        value={state.org} onChange={(e) => setState({ ...state, org: e.target.value })}
        placeholder="Company / Project (optional)"
        className="md:col-span-2 bg-[color:var(--surface)] border border-[color:var(--border)] px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--primary)]"
      />
      <textarea
        required maxLength={1000} rows={5}
        value={state.msg} onChange={(e) => setState({ ...state, msg: e.target.value })}
        placeholder={placeholderMsg}
        className="md:col-span-2 bg-[color:var(--surface)] border border-[color:var(--border)] px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--primary)] resize-none"
      />
      <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-3">
        <p className="text-[10px] font-label text-[color:var(--muted)]">Sent to {to}</p>
        <button type="submit" className="btn-flag font-label text-xs px-6 py-3">
          Send inquiry
        </button>
      </div>
      {status === "ok" && <p className="md:col-span-2 text-xs font-label text-[color:var(--primary)]">Opening your email client...</p>}
      {status === "err" && <p className="md:col-span-2 text-xs font-label text-[color:var(--primary)]">{err}</p>}
    </form>
  );
}
