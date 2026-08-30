import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/chuck-norris")({
  component: ChuckNorrisDemo,
});

type ChuckNorrisResponse = {
  id: string;
  value: string;
  url: string;
  icon_url: string;
  categories: string[];
};

function ChuckNorrisDemo() {
  const [joke, setJoke] = useState<string>("Press the button to fetch a random joke.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadJoke() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.chucknorris.io/jokes/random", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Chuck Norris API returned ${response.status}`);
      }

      const data = (await response.json()) as ChuckNorrisResponse;
      setJoke(data.value);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load a joke.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-20 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="label">Developer utility · external API demo</p>
        <h1 className="display mt-5 text-4xl sm:text-6xl">Chuck Norris Jokes</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This route is intentionally separate from the Beta Art archive experience. It demonstrates
          a live third-party JSON API integration without changing the public brand narrative.
        </p>

        <section className="rule-top mt-10 pt-8" aria-live="polite">
          <p className="display text-2xl leading-relaxed sm:text-3xl">
            {error ? `API error: ${error}` : joke}
          </p>
          <button
            type="button"
            onClick={loadJoke}
            disabled={loading}
            className="btn-ink focus-ring mt-8 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading…" : "Get random joke"}
          </button>
        </section>
      </div>
    </main>
  );
}
