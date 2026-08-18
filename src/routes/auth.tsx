import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { robotsContent } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => {
    const title = "Sign in — Beta Art archive administration";
    const description =
      "Sign in to the Beta Art archive administration area to review catalogue records, verification status and publication state.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "robots", content: robotsContent },
      ],
    };
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) throw error;
      setMessage("Account created. Check your inbox if confirmation is required, then sign in.");
      setMode("sign-in");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not complete the request.");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "focus-ring mt-2 w-full border border-input bg-card px-3 py-2 text-sm text-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-md px-5 py-20 sm:px-8">
        <p className="label">Archive administration</p>
        <h1 className="display mt-3 text-4xl">
          {mode === "sign-in" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          This area is restricted. Catalogue records remain unpublished and unverified until an
          administrator confirms them.
        </p>

        <form onSubmit={onSubmit} className="mt-10 border border-border p-6">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          <div className="mt-6">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>

          {message ? (
            <p role="status" className="mt-6 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}

          <button type="submit" disabled={busy} className="btn-ink focus-ring mt-8">
            {busy ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          className="label focus-ring mt-6 underline underline-offset-4"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setMessage(null);
          }}
        >
          {mode === "sign-in" ? "Create an account" : "I already have an account"}
        </button>
      </main>
      <SiteFooter />
    </div>
  );
}
