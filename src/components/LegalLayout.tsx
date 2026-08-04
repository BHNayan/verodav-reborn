import { Link } from "@tanstack/react-router";

export function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-copper">— Accueil Verodav</Link>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{title}</h1>
          {intro && <p className="mt-4 text-muted-foreground max-w-2xl">{intro}</p>}
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-6 py-16 prose-legal">
        {children}
      </article>
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl mb-4 text-primary">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}
