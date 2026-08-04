"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroSlide } from "@/lib/types";

export function HeroSlider({
  slides,
  fallbackTitle,
  fallbackSubtitle,
  companyName,
  ctaLabel,
}: {
  slides: HeroSlide[];
  fallbackTitle: string;
  fallbackSubtitle: string;
  companyName: string;
  ctaLabel: string;
}) {
  const items =
    slides.length > 0
      ? slides
      : [
          {
            id: "fallback",
            image: "/fleet/hero.png",
            title: fallbackTitle,
            subtitle: fallbackSubtitle,
          },
        ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const active = items[index];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-stone-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.5, ease: "linear" }}
          >
            <Image
              src={active.image}
              alt={active.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-36 sm:pb-20 lg:px-8 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-[clamp(3.5rem,12vw,8rem)] leading-[0.85] tracking-[0.14em] text-[var(--brand-primary)]">
            {companyName}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${active.id}-copy`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="mt-5 max-w-2xl"
            >
              <h1 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] tracking-wide text-white">
                {active.title || fallbackTitle}
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/78 sm:text-lg">
                {active.subtitle || fallbackSubtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/fleet" className="btn-primary">
              View fleet
            </Link>
            <Link href="/rent" className="btn-ghost">
              {ctaLabel}
            </Link>
          </div>
        </motion.div>

        {items.length > 1 && (
          <div className="mt-12 flex items-center gap-2">
            {items.map((slide, i) => (
              <button
                key={slide.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-[3px] transition-all duration-500 ${
                  i === index
                    ? "w-12 bg-[var(--brand-primary)]"
                    : "w-6 bg-white/30 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
