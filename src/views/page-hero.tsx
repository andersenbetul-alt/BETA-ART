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
          <h1 className="mt-6 font-display text-4xl leading-[1.06] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ink-100/85 sm:text-xl">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
