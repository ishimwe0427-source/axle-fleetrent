"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-stone-950">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={image}
          alt="AXLE heavy machinery"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/50" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-36 sm:pb-20 lg:px-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 inline-flex w-fit items-center gap-3 border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Rwanda · Earthmoving rental
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="font-[family-name:var(--font-display)] text-5xl tracking-[0.18em] text-amber-400 sm:text-6xl md:text-7xl"
        >
          AXLE
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] tracking-wide text-white sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/fleet"
            className="rounded-sm bg-amber-400 px-6 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
          >
            View fleet
          </Link>
          <Link
            href="/rent"
            className="rounded-sm border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Start rental
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
