import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-[26rem] rounded-full bg-ink-700/40 blur-3xl"
      />
      <Container className="relative">
        <div className="max-w-3xl py-20 sm:py-24">
          <p className="eyebrow text-accent-300">{eyebrow}</p>
          <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-100/85">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
