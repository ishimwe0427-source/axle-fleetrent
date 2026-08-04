"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function CtaBand({ ctaLabel }: { ctaLabel: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/fleet/hero.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--brand-primary)]/92 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-center lg:px-8 lg:py-24"
      >
        <div>
          <h2 className="font-display text-4xl tracking-wide text-stone-950 md:text-6xl">
            Ready to put iron on site?
          </h2>
          <p className="mt-4 max-w-xl text-base text-stone-900/80">
            Pick a machine, send a booking request, and get a project quote—
            clear, fast, professional.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/rent"
            className="inline-flex bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/fleet"
            className="inline-flex border border-stone-950/30 px-6 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-stone-950/5"
          >
            Browse fleet
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
