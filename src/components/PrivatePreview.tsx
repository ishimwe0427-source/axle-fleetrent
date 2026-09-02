import Link from "next/link";
import type { Branding } from "@/lib/types";

export function PrivatePreview({ branding }: { branding: Branding }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-stone-950 px-5 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/fleet/hero.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary,#f5a623)]">
          Private preview
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-wide md:text-6xl">
          {branding.companyName}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/70">
          This new rental website is not the official public site yet. It is
          being reviewed internally and will go live when management approves it.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex bg-[var(--brand-primary,#f5a623)] px-6 py-3 text-sm font-semibold text-stone-950"
        >
          Staff login
        </Link>
      </div>
    </section>
  );
}
