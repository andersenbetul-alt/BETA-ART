import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Track = {
  id: string;
  title: string;
  kicker: string | null;
  streams_label: string | null;
  description: string | null;
  spotify_embed_url: string | null;
  cover_url: string | null;
  release_date: string | null;
  apple_url: string | null;
  youtube_url: string | null;
  soundcloud_url: string | null;
  sort_order: number;
  published: boolean;
};

export function MusicSection() {
  const [tracks, setTracks] = useState<Track[] | null>(null);
  useEffect(() => {
    supabase
      .from("tracks")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setTracks((data as Track[]) ?? []));
  }, []);

  if (!tracks) {
    return <div className="font-mono text-xs text-[color:var(--muted)]">Loading tracks…</div>;
  }
  if (tracks.length === 0) {
    return <div className="font-mono text-xs text-[color:var(--muted)]">No releases yet.</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tracks.map((t) => (
        <article key={t.id} className="reveal in bg-[color:var(--surface)] border border-[color:var(--border)] p-6 flex flex-col">
          {t.kicker && <div className="font-label text-[10px] text-[color:var(--primary)]">{t.kicker}</div>}
          <h3 className="font-display text-3xl mt-2">{t.title}</h3>
          {t.streams_label && (
            <div className="font-mono text-sm text-[color:var(--muted)] mt-1">{t.streams_label}</div>
          )}
          {t.cover_url && (
            <img src={t.cover_url} alt={t.title} loading="lazy" className="mt-4 w-full aspect-square object-cover" />
          )}
          {t.description && <p className="text-sm text-[color:var(--text)]/70 mt-4">{t.description}</p>}
          {t.spotify_embed_url && (
            <div className="mt-4">
              <iframe
                title={`${t.title} on Spotify`}
                src={t.spotify_embed_url}
                width="100%"
                height="152"
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}
          <div className="mt-auto pt-6 flex flex-wrap gap-x-4 gap-y-2 font-label text-xs">
            {t.apple_url && (
              <a href={t.apple_url} target="_blank" rel="noreferrer" className="text-[color:var(--primary)] hover:underline">Apple →</a>
            )}
            {t.youtube_url && (
              <a href={t.youtube_url} target="_blank" rel="noreferrer" className="text-[color:var(--primary)] hover:underline">YouTube →</a>
            )}
            {t.soundcloud_url && (
              <a href={t.soundcloud_url} target="_blank" rel="noreferrer" className="text-[color:var(--primary)] hover:underline">SoundCloud →</a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
