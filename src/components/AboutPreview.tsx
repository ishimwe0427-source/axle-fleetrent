"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function AboutPreview({
  title,
  body,
  image,
}: {
  title: string;
  body: string;
  image: string;
}) {
  return (
    <section className="steel-mesh relative overflow-hidden py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-7xl items-stretch gap-0 px-5 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[420px] overflow-hidden lg:min-h-[560px]"
        >
          <Image
            src={image}
            alt="Equipment at work"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40 max-lg:bg-gradient-to-t max-lg:from-black/50 max-lg:to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75 }}
          className="flex flex-col justify-center border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm md:p-12 lg:-ml-8 lg:my-10"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
            Since 2017
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-wide md:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70">{body}</p>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-white/45">
            Mining · Construction · Agriculture · Energy
          </p>
          <Link href="/about" className="btn-primary mt-10 w-fit">
            Our story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
